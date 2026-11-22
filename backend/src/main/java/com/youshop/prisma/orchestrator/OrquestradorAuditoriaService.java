package com.youshop.prisma.orchestrator;

import com.youshop.prisma.domain.Campanha;
import com.youshop.prisma.domain.DiagnosticoICOResult;
import com.youshop.prisma.domain.ReprocessamentoResult;
import com.youshop.prisma.domain.Ticket;
import com.youshop.prisma.ingestion.CampanhaRepository;
import com.youshop.prisma.mcp.FerramentasMcp;
import com.youshop.prisma.mcp.FerramentasMcp.PromessaMidia;
import com.youshop.prisma.mcp.FerramentasMcp.RegrasProduto;
import com.youshop.prisma.mcp.FerramentasMcp.SinaisSuporte;
import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.content.Media;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeType;

/** Ingestão sanitizada -> ferramentas MCP -> ChatClient -> ICO, com fallback determinístico. */
@Service
public class OrquestradorAuditoriaService {

  private static final Logger log = LoggerFactory.getLogger(OrquestradorAuditoriaService.class);

  private static final String SISTEMA =
      "Você é o Orquestrador do YouShop Prisma. Cruze apenas as evidências sanitizadas fornecidas "
          + "pelas ferramentas MCP: promessa do Creator, regras oficiais do Produtor e tickets de "
          + "compradores. Nunca invente dados pessoais. Calcule um ICO de 0 a 100, classifique os "
          + "pilares escopo/prazo/preco como 'Divergente' ou 'Alinhado' e explique a causa-raiz em "
          + "português com o timestamp da promessa. Responda estritamente no schema solicitado.";

  private final CampanhaRepository repository;
  private final FerramentasMcp ferramentas;
  private final ToolCallbackProvider toolCallbackProvider;
  private final ObjectProvider<ChatClient> chatClientProvider;

  public OrquestradorAuditoriaService(
      CampanhaRepository repository,
      FerramentasMcp ferramentas,
      ToolCallbackProvider toolCallbackProvider,
      ObjectProvider<ChatClient> chatClientProvider) {
    this.repository = repository;
    this.ferramentas = ferramentas;
    this.toolCallbackProvider = toolCallbackProvider;
    this.chatClientProvider = chatClientProvider;
  }

  public ReprocessamentoResult reprocessar(String campanhaId) {
    Campanha campanha =
        repository
            .buscar(campanhaId)
            .orElseThrow(() -> new NoSuchElementException("Campanha não encontrada: " + campanhaId));

    log.info("[orchestrator] Iniciando reprocessamento de #{}", campanhaId);

    PromessaMidia promessa = ferramentas.consultarPromessaMidia(campanhaId);
    log.info(
        "[mcp] consultarPromessaMidia(campanhaId={}) -> timestamp={}, {} segmentos, {} promessas extraídas",
        campanhaId,
        promessa.timestamp(),
        promessa.transcricaoSegmentada().size(),
        promessa.promessasExtraidas().size());

    RegrasProduto regras = ferramentas.consultarRegrasProduto(campanha.evidencias().produtor().sku());
    log.info(
        "[mcp] consultarRegrasProduto(sku={}) -> formato={}, valorOficial={}",
        regras.sku(),
        regras.formato(),
        regras.valorOficial());

    SinaisSuporte sinais = ferramentas.consultarSinaisSuporte(campanhaId);
    log.info(
        "[mcp] consultarSinaisSuporte(campanhaId={}) -> volume={}, {} tickets sanitizados, tmr={}",
        campanhaId,
        sinais.volume(),
        sinais.ticketsSanitizados().size(),
        sinais.tmr());

    boolean modeloDisponivel = chatClientProvider.getIfAvailable() != null;
    DiagnosticoICOResult diagnostico = consolidar(campanha, promessa, regras, sinais);
    String origem = modeloDisponivel ? "chatclient-multimodal-openai" : "fallback-deterministico";

    log.info(
        "[orchestrator] ICO consolidado para #{} = {}% (escopo={}, prazo={}, preco={}, origem={})",
        campanhaId,
        diagnostico.ico(),
        diagnostico.escopo(),
        diagnostico.prazo(),
        diagnostico.preco(),
        origem);

    List<String> ferramentasUsadas =
        List.of("consultarPromessaMidia", "consultarRegrasProduto", "consultarSinaisSuporte");
    String detalhe =
        "Tools MCP consultadas: %s. Pilares: escopo=%s, prazo=%s, preco=%s. Origem: %s."
            .formatted(
                String.join(", ", ferramentasUsadas),
                diagnostico.escopo(),
                diagnostico.prazo(),
                diagnostico.preco(),
                origem);

    return new ReprocessamentoResult(
        campanhaId,
        diagnostico.ico(),
        diagnostico.escopo(),
        ferramentasUsadas,
        diagnostico.resumoCausaRaiz(),
        detalhe,
        diagnostico.resumoCausaRaiz(),
        diagnostico.confianca(),
        origem,
        Instant.now().toString());
  }

  private DiagnosticoICOResult consolidar(
      Campanha campanha, PromessaMidia promessa, RegrasProduto regras, SinaisSuporte sinais) {
    ChatClient chatClient = chatClientProvider.getIfAvailable();
    if (chatClient == null) {
      log.info("[orchestrator] OPENAI_API_KEY ausente: fallback determinístico sobre dados MCP");
      return fallback(campanha, promessa, regras, sinais);
    }

    try {
      log.info("[chatclient] Enviando evidências sanitizadas e mídia ao modelo multimodal");
      Media midia = midia(campanha);
      String prompt = promptUsuario(promessa, regras, sinais);

      DiagnosticoICOResult resultado =
          chatClient
              .prompt()
              .system(SISTEMA)
              .user(
                  usuario -> {
                    usuario.text(prompt);
                    if (midia != null) {
                      usuario.media(midia);
                    }
                  })
              .toolCallbacks(toolCallbackProvider.getToolCallbacks())
              .call()
              .entity(DiagnosticoICOResult.class);

      log.info(
          "[chatclient] Structured Outputs recebido: ico={}, escopo={}",
          resultado.ico(),
          resultado.escopo());
      return resultado;
    } catch (Exception ex) {
      log.warn(
          "[chatclient] Falha ao consultar o modelo ({}): aplicando fallback determinístico",
          ex.getMessage());
      return fallback(campanha, promessa, regras, sinais);
    }
  }

  private static String promptUsuario(
      PromessaMidia promessa, RegrasProduto regras, SinaisSuporte sinais) {
    List<String> mensagens =
        sinais.ticketsSanitizados().stream().map(Ticket::mensagem).map(m -> "  - " + m).toList();
    return """
        Campanha: %s
        Promessa do Creator (transcrição segmentada): %s
        Promessas extraídas: %s
        Timestamp da promessa: %s
        Regras oficiais do Produtor: formato=%s, prazo=%s, garantia=%s, valor=%s
        Sinais de suporte (tickets já sanitizados): volume=%d, tmr=%s
        Tickets:
        %s
        """
        .formatted(
            promessa.campanhaId(),
            promessa.transcricaoSegmentada(),
            promessa.promessasExtraidas(),
            promessa.timestamp(),
            regras.formato(),
            regras.prazoAcesso(),
            regras.garantia(),
            regras.valorOficial(),
            sinais.volume(),
            sinais.tmr(),
            String.join("\n", mensagens));
  }

  private static Media midia(Campanha campanha) {
    String imagem = campanha.evidencias().creator().imagem();
    if (imagem == null || imagem.isBlank()) {
      return null;
    }
    try {
      return Media.builder()
          .mimeType(MimeType.valueOf("image/jpeg"))
          .data(URI.create(imagem))
          .build();
    } catch (Exception ex) {
      log.warn("[orchestrator] Mídia indisponível; prosseguindo apenas com texto: {}", ex.getMessage());
      return null;
    }
  }

  /** Consolidação determinística usada quando não há API Key ou o modelo falha. */
  private static DiagnosticoICOResult fallback(
      Campanha campanha, PromessaMidia promessa, RegrasProduto regras, SinaisSuporte sinais) {
    String textoPromessa =
        String.join(" ", promessa.promessasExtraidas()).toLowerCase(Locale.ROOT);
    String formato = regras.formato().toLowerCase(Locale.ROOT);
    String prazo = regras.prazoAcesso().toLowerCase(Locale.ROOT);

    boolean escopoDivergente =
        textoPromessa.contains("ao vivo") && (formato.contains("gravado") || formato.contains("protocolo"));
    boolean prazoDivergente =
        textoPromessa.matches("(?s).*\\b\\d+\\s+dias\\b.*") && prazo.contains("meses");
    boolean precoDivergente =
        (textoPromessa.contains("grátis") || textoPromessa.contains("gratis"))
            && !"gratis".equals(regras.valorOficial().toLowerCase(Locale.ROOT));

    String promessaPrincipal =
        promessa.promessasExtraidas().isEmpty()
            ? promessa.transcricao()
            : promessa.promessasExtraidas().get(0);
    String resumo =
        ("O Creator prometeu \"%s\" no minuto %s, mas o Produtor cadastrou %s (%s, valor oficial %s). "
                + "%d tickets já sanitizados pelo LGPD (T.M.R. %s) confirmam a percepção de divergência de entrega.")
            .formatted(
                promessaPrincipal,
                promessa.timestamp(),
                regras.formato(),
                regras.prazoAcesso(),
                regras.valorOficial(),
                sinais.volume(),
                sinais.tmr());

    return new DiagnosticoICOResult(
        campanha.ico(),
        escopoDivergente ? "Divergente" : "Alinhado",
        prazoDivergente ? "Divergente" : "Alinhado",
        precoDivergente ? "Divergente" : "Alinhado",
        resumo,
        "Auditoria determinística sobre dados sanitizados (sem modelo externo)",
        escopoDivergente
            ? "Notificar Creator e Produtor antes de liberar o checkout."
            : "Manter monitoramento e decidir na fila de inspeção.");
  }
}

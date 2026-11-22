package com.youshop.prisma.mcp;

import com.youshop.prisma.domain.Campanha;
import com.youshop.prisma.domain.Ticket;
import com.youshop.prisma.ingestion.CampanhaRepository;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

/** Ferramentas MCP sobre evidências já sanitizadas na ingestão. */
@Component
public class FerramentasMcp {

  private static final Pattern MARCADOR_PROMOESSA =
      Pattern.compile(
          "(?i)(ganha|inclui|prometid|ao vivo|garantia|acompanhamento|acesso imediato|notar a diferen|em apenas)");

  public record PromessaMidia(
      String campanhaId,
      String transcricao,
      List<String> transcricaoSegmentada,
      List<String> promessasExtraidas,
      String timestamp) {}

  public record RegrasProduto(
      String sku, String formato, String prazoAcesso, String garantia, String valorOficial) {}

  public record SinaisSuporte(
      String campanhaId, int volume, List<Ticket> ticketsSanitizados, String tmr) {}

  private final CampanhaRepository repository;

  public FerramentasMcp(CampanhaRepository repository) {
    this.repository = repository;
  }

  @Tool(
      name = "consultarPromessaMidia",
      description =
          "Consulta a promessa feita pelo Creator em uma campanha: transcrição segmentada, "
              + "promessas extraídas e timestamp da mídia.")
  public PromessaMidia consultarPromessaMidia(
      @ToolParam(
              description = "Identificador da campanha, por exemplo CMP-8492.",
              required = true)
          String campanhaId) {
    Campanha campanha = obter(campanhaId);
    var creator = campanha.evidencias().creator();
    List<String> segmentos = segmentar(creator.transcricao());
    List<String> promessas =
        segmentos.stream()
            .filter(segmento -> MARCADOR_PROMOESSA.matcher(segmento).find())
            .toList();
    return new PromessaMidia(
        campanhaId,
        creator.transcricao(),
        List.copyOf(segmentos),
        List.copyOf(promessas),
        creator.minutoPromessa());
  }

  @Tool(
      name = "consultarRegrasProduto",
      description =
          "Consulta as regras oficiais do cadastro do produto pelo SKU: formato, prazo de acesso, "
              + "garantia e valor oficial.")
  public RegrasProduto consultarRegrasProduto(
      @ToolParam(
              description = "SKU cadastrado no checkout, por exemplo SKU #MNT-091.",
              required = true)
          String sku) {
    Campanha campanha =
        repository
            .buscarPorSku(sku)
            .orElseThrow(() -> new NoSuchElementException("SKU não encontrado: " + sku));
    var produtor = campanha.evidencias().produtor();
    return new RegrasProduto(
        produtor.sku(),
        produtor.formato(),
        produtor.prazoAcesso(),
        produtor.garantia(),
        produtor.valor());
  }

  @Tool(
      name = "consultarSinaisSuporte",
      description =
          "Consulta os sinais de suporte de uma campanha: volume de chamados, tickets já "
              + "sanitizados pelo módulo LGPD e tempo médio de resolução (T.M.R.).")
  public SinaisSuporte consultarSinaisSuporte(
      @ToolParam(
              description = "Identificador da campanha, por exemplo CMP-8492.",
              required = true)
          String campanhaId) {
    Campanha campanha = obter(campanhaId);
    var compradores = campanha.evidencias().compradores();
    int volume = Integer.parseInt(compradores.total().replaceAll("\\D", ""));
    return new SinaisSuporte(
        campanhaId, volume, List.copyOf(compradores.tickets()), compradores.tmr());
  }

  private Campanha obter(String campanhaId) {
    return repository
        .buscar(campanhaId)
        .orElseThrow(() -> new NoSuchElementException("Campanha não encontrada: " + campanhaId));
  }

  /** Segmentação determinística, sem chamada externa. */
  private static List<String> segmentar(String transcricao) {
    String limpa =
        transcricao
            .replace("“", "")
            .replace("”", "")
            .replace("\"", "")
            .trim();
    return Arrays.stream(limpa.split("(?<=[.!?;:])\\s+"))
        .map(String::trim)
        .filter(segmento -> !segmento.isBlank())
        .toList();
  }
}

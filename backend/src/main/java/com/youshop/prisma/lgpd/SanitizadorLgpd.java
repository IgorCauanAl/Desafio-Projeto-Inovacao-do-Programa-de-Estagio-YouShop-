package com.youshop.prisma.lgpd;

import com.youshop.prisma.domain.Campanha;
import com.youshop.prisma.domain.EvidenciaCompradores;
import com.youshop.prisma.domain.Evidencias;
import com.youshop.prisma.domain.Ticket;
import com.youshop.prisma.ingestion.RawSeed;
import java.util.List;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

/** Substitui PII por tokens e omite campos sensíveis antes de qualquer ferramenta ou IA. */
@Component
public class SanitizadorLgpd {

  public static final String TOKEN_NOME = "[NOME]";
  public static final String TOKEN_CPF = "[CPF]";
  public static final String TOKEN_EMAIL = "[EMAIL]";
  public static final String TOKEN_TELEFONE = "[TELEFONE]";

  private static final Pattern PADRAO_CPF =
      Pattern.compile("\\b\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}\\b");
  private static final Pattern PADRAO_EMAIL =
      Pattern.compile("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}");
  private static final Pattern PADRAO_TELEFONE =
      Pattern.compile("(?<!\\d)\\(?\\d{2}\\)?[\\s.-]?\\d{4,5}-?\\d{4}(?!\\d)");

  public String mascaraCpf(String texto) {
    return texto == null ? null : PADRAO_CPF.matcher(texto).replaceAll(TOKEN_CPF);
  }

  public String mascaraEmail(String texto) {
    return texto == null ? null : PADRAO_EMAIL.matcher(texto).replaceAll(TOKEN_EMAIL);
  }

  public String mascaraTelefone(String texto) {
    return texto == null ? null : PADRAO_TELEFONE.matcher(texto).replaceAll(TOKEN_TELEFONE);
  }

  public String mascaraNome(String texto, String nome) {
    if (texto == null || nome == null || nome.isBlank()) {
      return texto;
    }
    return Pattern.compile(Pattern.quote(nome), Pattern.CASE_INSENSITIVE)
        .matcher(texto)
        .replaceAll(TOKEN_NOME);
  }

  /** Ordem fixa garante sanitização determinística. */
  public String sanitizarTexto(String texto, String nome) {
    if (texto == null) {
      return null;
    }
    String resultado = mascaraCpf(texto);
    resultado = mascaraEmail(resultado);
    resultado = mascaraTelefone(resultado);
    return mascaraNome(resultado, nome);
  }

  /** Ticket público sem campos de PII (omissão estrutural). */
  public Ticket sanitizar(RawSeed.Ticket bruto) {
    String mensagem = sanitizarTexto(bruto.mensagem(), bruto.nomeComprador());
    String categoria = sanitizarTexto(bruto.categoria(), bruto.nomeComprador());

    return new Ticket(bruto.id(), bruto.tempo(), mensagem, categoria, bruto.icone());
  }

  public EvidenciaCompradores sanitizar(RawSeed.Compradores brutos) {
    List<Ticket> tickets = brutos.tickets().stream().map(this::sanitizar).toList();
    return new EvidenciaCompradores(brutos.total(), tickets, brutos.tmr(), brutos.frustracao());
  }

  public Campanha sanitizar(RawSeed.Campanha bruta) {
    RawSeed.Evidencias ev = bruta.evidencias();
    Evidencias evidencias =
        new Evidencias(
            ev.creator(),
            ev.produtor(),
            sanitizar(ev.compradores()),
            List.copyOf(ev.resumos()));
    return new Campanha(
        bruta.id(),
        bruta.titulo(),
        bruta.creator(),
        bruta.produtor(),
        bruta.nivel(),
        bruta.ico(),
        bruta.status(),
        bruta.diagnostico(),
        evidencias);
  }
}

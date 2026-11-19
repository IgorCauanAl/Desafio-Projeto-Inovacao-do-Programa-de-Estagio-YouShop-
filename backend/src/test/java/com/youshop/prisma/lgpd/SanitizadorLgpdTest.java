package com.youshop.prisma.lgpd;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.youshop.prisma.domain.Campanha;
import com.youshop.prisma.domain.Ticket;
import com.youshop.prisma.ingestion.RawSeed;
import java.io.InputStream;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

class SanitizadorLgpdTest {

  private final SanitizadorLgpd sanitizador = new SanitizadorLgpd();
  private final ObjectMapper mapper = new ObjectMapper();

  @Test
  void mascaraCpfComESemPontuacao() {
    assertThat(sanitizador.mascaraCpf("123.456.789-09")).isEqualTo("[CPF]");
    assertThat(sanitizador.mascaraCpf("12345678909")).isEqualTo("[CPF]");
    assertThat(sanitizador.mascaraCpf("CPF 987.654.321-00; CPF 11122233344"))
        .isEqualTo("CPF [CPF]; CPF [CPF]");
  }

  @Test
  void mascaraEmail() {
    assertThat(sanitizador.mascaraEmail("juliana.pereira@email.com")).isEqualTo("[EMAIL]");
    assertThat(sanitizador.mascaraEmail("fale com ricardo.nogueira@email.com agora"))
        .isEqualTo("fale com [EMAIL] agora");
  }

  @Test
  void mascaraTelefone() {
    assertThat(sanitizador.mascaraTelefone("(11) 98877-6655")).isEqualTo("[TELEFONE]");
    assertThat(sanitizador.mascaraTelefone("21 977771234")).isEqualTo("[TELEFONE]");
  }

  @Test
  void mascaraNomeIgnorandoCaixa() {
    assertThat(sanitizador.mascaraNome("Juliana Alves Pereira comprou", "juliana alves pereira"))
        .isEqualTo("[NOME] comprou");
  }

  @Test
  void sanitizaTicketEOmiteCamposDePiiNoDto() throws Exception {
    RawSeed.Ticket bruto =
        new RawSeed.Ticket(
            "TK-3921",
            "há 3h",
            "Eu, Juliana Alves Pereira (CPF 123.456.789-09, juliana.pereira@email.com, (11) 98877-6655), comprei pela mentoria ao vivo e só tem aula gravada.",
            "Solicitação de Reembolso imediato",
            "support_agent",
            "Juliana Alves Pereira",
            "123.456.789-09",
            "juliana.pereira@email.com",
            "(11) 98877-6655");

    Ticket limpo = sanitizador.sanitizar(bruto);
    String json = mapper.writeValueAsString(limpo);

    assertThat(limpo.mensagem())
        .contains("[NOME]", "[CPF]", "[EMAIL]", "[TELEFONE]")
        .doesNotContain("Juliana", "123.456.789-09", "juliana.pereira@email.com", "(11) 98877-6655");
    assertThat(json)
        .doesNotContain("nomeComprador", "cpf", "email", "telefone", "Juliana", "123.456.789-09");
    assertThat(limpo.id()).isEqualTo("TK-3921");
  }

  @Test
  void sanitizaCampanhaInteiraSemVazamentoNoJson() throws Exception {
    RawSeed.Dataset dataset;
    try (InputStream entrada = new ClassPathResource("data/campanhas.json").getInputStream()) {
      dataset = mapper.readValue(entrada, RawSeed.Dataset.class);
    }

    Campanha limpa =
        dataset.campanhas().stream()
            .filter(c -> "CMP-8492".equals(c.id()))
            .map(sanitizador::sanitizar)
            .findFirst()
            .orElseThrow();

    String json = mapper.writeValueAsString(limpa);

    assertThat(json)
        .doesNotContain(
            "Juliana Alves Pereira",
            "Ricardo Nogueira",
            "123.456.789-09",
            "987.654.321-00",
            "juliana.pereira@email.com",
            "ricardo.nogueira@email.com",
            "(11) 98877-6655",
            "nomeComprador",
            "\"cpf\"",
            "\"email\"",
            "\"telefone\"");
    assertThat(json).contains("01:12", "Instituto Pro", "[NOME]", "[CPF]", "[EMAIL]", "[TELEFONE]");
  }

  @Test
  void sanitizacaoEDeterministica() {
    RawSeed.Ticket bruto =
        new RawSeed.Ticket(
            "TK-1", "há 1h", "Maria Silva, CPF 123.456.789-09, maria@email.com", "Teste", "help_center",
            "Maria Silva", "123.456.789-09", "maria@email.com", "(11) 98888-7777");

    assertThat(sanitizador.sanitizar(bruto)).isEqualTo(sanitizador.sanitizar(bruto));
  }
}

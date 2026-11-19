package com.youshop.prisma.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ApiEndpointsIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @Test
  void dashboardRetornaMetricasEFilaOrdenadaPeloMenorIco() throws Exception {
    mockMvc
        .perform(get("/api/dashboard"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.metricas.indiceMedio").value(78))
        .andExpect(jsonPath("$.campanhas.length()").value(3))
        .andExpect(jsonPath("$.campanhas[0].id").value("CMP-8492"))
        .andExpect(jsonPath("$.campanhas[0].ico").value(34))
        .andExpect(jsonPath("$.campanhas[1].ico").value(68))
        .andExpect(jsonPath("$.campanhas[2].ico").value(96));
  }

  @Test
  void campanhaRetornaDiagnosticosEEvidenciasSemPii() throws Exception {
    mockMvc
        .perform(get("/api/campanhas/CMP-8492"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.diagnostico.escopo").value("Divergente"))
        .andExpect(jsonPath("$.diagnostico.prazo").value("Alinhado"))
        .andExpect(jsonPath("$.evidencias.creator.minutoPromessa").value("01:12"))
        .andExpect(jsonPath("$.evidencias.compradores.tickets[0].mensagem").value(org.hamcrest.Matchers.containsString("[CPF]")))
        .andExpect(jsonPath("$.evidencias.compradores.tickets[0].cpf").doesNotExist())
        .andExpect(jsonPath("$.evidencias.compradores.tickets[0].nomeComprador").doesNotExist());
  }

  @Test
  void acaoAtualizaStatusERetornaPayload() throws Exception {
    mockMvc
        .perform(
            post("/api/auditoria/CMP-8492/acao")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"acao\":\"Notificar Creator\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.campanhaId").value("CMP-8492"))
        .andExpect(jsonPath("$.payload.acao").value("Notificar Creator"))
        .andExpect(jsonPath("$.payload.evidencia").value("Promessa do Creator no minuto 01:12"))
        .andExpect(jsonPath("$.payload.status").value("Resolvido"));

    mockMvc
        .perform(get("/api/campanhas/CMP-8492"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("Resolvido"));
  }

  @Test
  void reprocessarDisparaOrquestradorERetornaResultado() throws Exception {
    mockMvc
        .perform(post("/api/auditoria/CMP-8492/reprocessar"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.campanhaId").value("CMP-8492"))
        .andExpect(jsonPath("$.ico").value(34))
        .andExpect(jsonPath("$.escopo").value("Divergente"))
        .andExpect(jsonPath("$.ferramentas.length()").value(3));
  }

  @Test
  void campanhaInexistenteRetorna404() throws Exception {
    mockMvc.perform(get("/api/campanhas/CMP-0000")).andExpect(status().isNotFound());
  }
}

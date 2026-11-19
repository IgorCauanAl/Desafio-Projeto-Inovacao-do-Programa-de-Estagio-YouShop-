package com.youshop.prisma.orchestrator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.test.web.servlet.MockMvc;

/** Gate 4: reprocessamento cruzando MCP + orquestrador com logs auditáveis. */
@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(OutputCaptureExtension.class)
class OrquestradorGateTest {

  @Autowired private MockMvc mockMvc;

  @Test
  void reprocessarCmp8492EntregaIco34EscopoDivergenteEResumoExplicavel(CapturedOutput output)
      throws Exception {
    mockMvc
        .perform(post("/api/auditoria/CMP-8492/reprocessar"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.campanhaId").value("CMP-8492"))
        .andExpect(jsonPath("$.ico").value(34))
        .andExpect(jsonPath("$.escopo").value("Divergente"))
        .andExpect(jsonPath("$.resumoCausaRaiz", containsString("01:12")))
        .andExpect(jsonPath("$.resumoCausaRaiz", containsString("ao vivo")))
        .andExpect(jsonPath("$.resumoCausaRaiz", containsString("100% Gravado")))
        .andExpect(jsonPath("$.resumoCausaRaiz", containsString("58 tickets")))
        .andExpect(jsonPath("$.origem").value("fallback-deterministico"))
        .andExpect(jsonPath("$.ferramentas.length()").value(3))
        .andExpect(jsonPath("$.ferramentas[0]").value("consultarPromessaMidia"))
        .andExpect(jsonPath("$.ferramentas[1]").value("consultarRegrasProduto"))
        .andExpect(jsonPath("$.ferramentas[2]").value("consultarSinaisSuporte"));

    String logs = output.getOut() + output.getErr();
    assertThat(logs)
        .contains(
            "[mcp] consultarPromessaMidia(campanhaId=CMP-8492)",
            "[mcp] consultarRegrasProduto(sku=SKU #MNT-091)",
            "[mcp] consultarSinaisSuporte(campanhaId=CMP-8492)",
            "[orchestrator] ICO consolidado para #CMP-8492 = 34% (escopo=Divergente");
  }

  @Test
  void reprocessarCmp8510DetectaDivergenciaDePrazo() throws Exception {
    mockMvc
        .perform(post("/api/auditoria/CMP-8510/reprocessar"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.ico").value(68))
        .andExpect(jsonPath("$.detalhe", containsString("prazo=Divergente")))
        .andExpect(jsonPath("$.resumoCausaRaiz", containsString("00:48")));
  }
}

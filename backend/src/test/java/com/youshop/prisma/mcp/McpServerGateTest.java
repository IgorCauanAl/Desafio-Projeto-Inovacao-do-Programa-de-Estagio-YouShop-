package com.youshop.prisma.mcp;

import static org.assertj.core.api.Assertions.assertThat;

import io.modelcontextprotocol.server.McpServerFeatures.SyncToolSpecification;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class McpServerGateTest {

  private static final List<String> PII_DO_SEED =
      List.of(
          "Juliana Alves Pereira",
          "123.456.789-09",
          "juliana.pereira@email.com",
          "(11) 98877-6655",
          "Ricardo Nogueira",
          "987.654.321-00",
          "ricardo.nogueira@email.com",
          "(21) 97777-1234");

  @Autowired private ToolCallbackProvider toolCallbackProvider;

  @Autowired
  @Qualifier("syncTools")
  private List<SyncToolSpecification> syncTools;

  @Test
  void servidorPublicaExatamenteAsTresToolsDoDominio() {
    Map<String, ToolCallback> callbacks = callbacks();

    assertThat(callbacks).hasSize(3);
    assertThat(callbacks.keySet())
        .containsExactlyInAnyOrder(
            "consultarPromessaMidia", "consultarRegrasProduto", "consultarSinaisSuporte");
    assertThat(syncTools).hasSize(3);
    assertThat(
            syncTools.stream()
                .map(spec -> spec.tool().name())
                .collect(Collectors.toSet()))
        .containsExactlyInAnyOrderElementsOf(callbacks.keySet());
    callbacks.values().forEach(callback -> assertThat(callback.getToolDefinition().description()).isNotBlank());
  }

  @Test
  void metodosSaoAnotadosComToolEUsamRecordsImutaveis() throws Exception {
    for (String nome :
        List.of("consultarPromessaMidia", "consultarRegrasProduto", "consultarSinaisSuporte")) {
      Method metodo = FerramentasMcp.class.getMethod(nome, String.class);
      assertThat(metodo.isAnnotationPresent(Tool.class)).as("falta @Tool em %s", nome).isTrue();
      assertThat(metodo.getAnnotation(Tool.class).name()).isEqualTo(nome);
      assertThat(metodo.getReturnType().isRecord()).as("%s deve retornar record", nome).isTrue();
      assertThat(metodo.getParameters()[0].isAnnotationPresent(
              org.springframework.ai.tool.annotation.ToolParam.class))
          .as("falta @ToolParam em %s", nome)
          .isTrue();
    }
  }

  @Test
  void consultarPromessaMidiaRetornaTranscricaoSegmentadaPromessasETimestampSemPii() {
    String json = callbacks().get("consultarPromessaMidia").call("{\"campanhaId\":\"CMP-8492\"}");

    assertThat(json).contains("\"campanhaId\":\"CMP-8492\"");
    assertThat(json).contains("\"timestamp\":\"01:12\"");
    assertThat(json).contains("\"transcricaoSegmentada\"");
    assertThat(json).contains("\"promessasExtraidas\"");
    assertThat(json).contains("acompanhamento ao vivo");
    assertSemPii(json);
  }

  @Test
  void consultarRegrasProdutoRetornaSomenteDadosOficiaisDoSku() {
    String json = callbacks().get("consultarRegrasProduto").call("{\"sku\":\"SKU #MNT-091\"}");

    assertThat(json).contains("\"sku\":\"SKU #MNT-091\"");
    assertThat(json).contains("\"formato\":\"100% Gravado\"");
    assertThat(json).contains("\"prazoAcesso\":\"Imediato (12 meses)\"");
    assertThat(json).contains("\"garantia\":\"7 dias\"");
    assertThat(json).contains("\"valorOficial\":\"R$ 997,00\"");
    assertThat(json).doesNotContain("TK-3921", "TK-3894");
    assertSemPii(json);
  }

  @Test
  void consultarSinaisSuporteRetornaApenasTicketsSanitizadosVolumeETmr() {
    String json = callbacks().get("consultarSinaisSuporte").call("{\"campanhaId\":\"CMP-8492\"}");

    assertThat(json).contains("\"campanhaId\":\"CMP-8492\"");
    assertThat(json).contains("\"volume\":58");
    assertThat(json).contains("\"tmr\":\"18 min\"");
    assertThat(json).contains("TK-3921", "TK-3894");
    assertThat(json).contains("[CPF]", "[EMAIL]", "[TELEFONE]", "[NOME]");
    assertThat(json).doesNotContain("nomeComprador", "\"cpf\"", "\"email\"", "\"telefone\"");
    assertSemPii(json);
  }

  @Test
  void toolsSaoIsoladasPorDominio() {
    Map<String, ToolCallback> callbacks = callbacks();

    assertThat(callbacks().get("consultarPromessaMidia").call("{\"campanhaId\":\"CMP-8510\"}"))
        .contains("\"timestamp\":\"00:48\"")
        .doesNotContain("SKU GLW-220", "TK-4102");
    assertThat(callbacks.get("consultarRegrasProduto").call("{\"sku\":\"SKU GLW-220\"}"))
        .contains("\"formato\":\"Protocolo de 90 dias\"")
        .doesNotContain("CMP-8492", "TK-4102");
    assertThat(callbacks.get("consultarSinaisSuporte").call("{\"campanhaId\":\"CMP-8477\"}"))
        .contains("\"volume\":2")
        .doesNotContain("SKU FTB-014", "R$ 297,00");
  }

  private Map<String, ToolCallback> callbacks() {
    return Arrays.stream(toolCallbackProvider.getToolCallbacks())
        .collect(Collectors.toMap(c -> c.getToolDefinition().name(), Function.identity()));
  }

  private static void assertSemPii(String json) {
    PII_DO_SEED.forEach(pii -> assertThat(json).as("PII vazou: %s", pii).doesNotContain(pii));
  }
}

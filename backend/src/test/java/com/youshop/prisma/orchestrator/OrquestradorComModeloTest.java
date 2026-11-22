package com.youshop.prisma.orchestrator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.youshop.prisma.domain.DiagnosticoICOResult;
import java.util.function.Consumer;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class OrquestradorComModeloTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ChatClient chatClient;

  @Test
  void usaStructuredOutputDoModeloQuandoChatClientEstaDisponivel() throws Exception {
    DiagnosticoICOResult esperado =
        new DiagnosticoICOResult(
            41,
            "Divergente",
            "Alinhado",
            "Alinhado",
            "Resumo explicável gerado pelo modelo multimodal sobre o minuto 01:12.",
            "Alta",
            "Notificar Creator");

    ChatClient.ChatClientRequestSpec spec = mock(ChatClient.ChatClientRequestSpec.class);
    ChatClient.CallResponseSpec call = mock(ChatClient.CallResponseSpec.class);
    when(chatClient.prompt()).thenReturn(spec);
    when(spec.system(anyString())).thenReturn(spec);
    when(spec.user(any(Consumer.class))).thenReturn(spec);
    when(spec.toolCallbacks(any(ToolCallback[].class))).thenReturn(spec);
    when(spec.call()).thenReturn(call);
    when(call.entity(DiagnosticoICOResult.class)).thenReturn(esperado);

    mockMvc
        .perform(post("/api/auditoria/CMP-8492/reprocessar"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.ico").value(41))
        .andExpect(jsonPath("$.origem").value("chatclient-multimodal-openai"))
        .andExpect(jsonPath("$.resumoCausaRaiz", containsString("modelo multimodal")));

    verify(spec).toolCallbacks(any(ToolCallback[].class));
    verify(call).entity(DiagnosticoICOResult.class);
  }

  @TestConfiguration
  static class ChatClientFake {
    @Bean
    @Primary
    ChatClient chatClientFake() {
      return mock(ChatClient.class);
    }
  }
}

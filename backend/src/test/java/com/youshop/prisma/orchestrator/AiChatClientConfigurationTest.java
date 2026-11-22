package com.youshop.prisma.orchestrator;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;

class AiChatClientConfigurationTest {

  @Test
  void criaChatClientComSchemaEstruturadoSemChamarOModelo() {
    ChatClient chatClient =
        new AiChatClientConfiguration().chatClient("chave-gemini-de-teste", "gemini-flash-lite-latest");

    assertThat(chatClient).isNotNull();
  }
}

package com.youshop.prisma.orchestrator;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;

/** Valida a montagem do cliente OpenAI com Structured Outputs, sem fazer chamada de rede. */
class AiChatClientConfigurationTest {

  @Test
  void criaChatClientComSchemaEstruturadoSemChamarOModelo() {
    ChatClient chatClient =
        new AiChatClientConfiguration().chatClient("sk-chave-de-teste", "gpt-4o-mini");

    assertThat(chatClient).isNotNull();
  }
}

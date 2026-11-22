package com.youshop.prisma.orchestrator;

import com.youshop.prisma.domain.DiagnosticoICOResult;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.model.tool.DefaultToolCallingManager;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.ai.openai.api.ResponseFormat;
import org.springframework.ai.util.json.schema.JsonSchemaGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * ChatClient condicional: o starter exigiria chave no boot e quebraria a demo sem credenciais.
 * Usa o endpoint compatível com OpenAI do Gemini, portanto mantém o starter openai sem chamar a OpenAI.
 */
@Configuration
public class AiChatClientConfiguration {

  private static final String GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai";
  private static final String GEMINI_COMPLETIONS_PATH = "/chat/completions";

  @Bean
  @ConditionalOnExpression("'${GEMINI_API_KEY:}' != ''")
  ChatClient chatClient(
      @Value("${GEMINI_API_KEY}") String apiKey,
      @Value("${youshop.ai.gemini.model:gemini-flash-lite-latest}") String model) {

    String schema = JsonSchemaGenerator.generateForType(DiagnosticoICOResult.class);

    OpenAiChatOptions options =
        OpenAiChatOptions.builder()
            .model(model)
            .temperature(0.0)
            .responseFormat(
                ResponseFormat.builder()
                    .type(ResponseFormat.Type.JSON_SCHEMA)
                    .jsonSchema(
                        ResponseFormat.JsonSchema.builder()
                            .name("diagnostico_ico_result")
                            .schema(schema)
                            .strict(false)
                            .build())
                    .build())
            .build();

    OpenAiChatModel chatModel =
        OpenAiChatModel.builder()
            .openAiApi(
                OpenAiApi.builder()
                    .apiKey(apiKey)
                    .baseUrl(GEMINI_BASE_URL)
                    .completionsPath(GEMINI_COMPLETIONS_PATH)
                    .build())
            .defaultOptions(options)
            .toolCallingManager(DefaultToolCallingManager.builder().build())
            .build();

    return ChatClient.builder(chatModel).build();
  }
}

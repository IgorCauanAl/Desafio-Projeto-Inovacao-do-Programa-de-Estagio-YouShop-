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
 * Cria o {@link ChatClient} somente quando {@code OPENAI_API_KEY} está definida.
 *
 * <p>Não usamos o starter de modelo: sua auto-configuração exige uma chave já no boot, o que
 * impediria a demo de rodar no ambiente de avaliação sem credenciais.
 */
@Configuration
public class AiChatClientConfiguration {

  @Bean
  @ConditionalOnExpression("'${OPENAI_API_KEY:}' != ''")
  ChatClient chatClient(
      @Value("${OPENAI_API_KEY}") String apiKey,
      @Value("${youshop.ai.openai.model:gpt-4o-mini}") String model) {

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
            .openAiApi(OpenAiApi.builder().apiKey(apiKey).build())
            .defaultOptions(options)
            .toolCallingManager(DefaultToolCallingManager.builder().build())
            .build();

    return ChatClient.builder(chatModel).build();
  }
}

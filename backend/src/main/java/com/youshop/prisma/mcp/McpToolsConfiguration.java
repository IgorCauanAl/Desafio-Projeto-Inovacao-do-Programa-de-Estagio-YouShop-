package com.youshop.prisma.mcp;

import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Registra os métodos {@code @Tool} de {@link FerramentasMcp} como um {@link ToolCallbackProvider}.
 *
 * <p>O auto-configuração do MCP Server (Spring AI 1.1.8) agrega todos os {@code ToolCallbackProvider}
 * do contexto e publica cada callback como uma ferramenta MCP em {@code tools/list}.
 */
@Configuration
public class McpToolsConfiguration {

  @Bean
  ToolCallbackProvider ferramentasMcpToolCallbackProvider(FerramentasMcp ferramentas) {
    return MethodToolCallbackProvider.builder().toolObjects(ferramentas).build();
  }
}

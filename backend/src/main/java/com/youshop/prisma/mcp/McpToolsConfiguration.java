package com.youshop.prisma.mcp;

import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class McpToolsConfiguration {

  @Bean
  ToolCallbackProvider ferramentasMcpToolCallbackProvider(FerramentasMcp ferramentas) {
    return MethodToolCallbackProvider.builder().toolObjects(ferramentas).build();
  }
}

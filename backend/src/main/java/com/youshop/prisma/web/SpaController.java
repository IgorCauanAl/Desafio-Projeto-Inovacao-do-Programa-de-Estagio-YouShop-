package com.youshop.prisma.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Etapa 5: entrega o bundle Angular para os deep links da SPA quando o JAR é servido sozinho.
 *
 * <p>Os endpoints REST ({@code /api/**}) e os canais MCP ({@code /sse}, {@code /mcp/**}) não são
 * afetados: só as rotas da aplicação são encaminhadas para {@code index.html}. Assim o front e o
 * back compartilham a mesma origem ({@code http://localhost:8080}) e não há CORS em produção.
 */
@Controller
public class SpaController {

  @GetMapping({"/campanha/{id}", "/campanha/{id}/evidencias"})
  public String index(@PathVariable String id) {
    return "forward:/index.html";
  }
}

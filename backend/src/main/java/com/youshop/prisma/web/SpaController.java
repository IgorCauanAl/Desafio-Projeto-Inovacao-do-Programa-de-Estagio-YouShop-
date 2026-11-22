package com.youshop.prisma.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/** Encaminha deep links da SPA para o index.html servido pelo JAR. */
@Controller
public class SpaController {

  @GetMapping({"/campanha/{id}", "/campanha/{id}/evidencias"})
  public String index(@PathVariable String id) {
    return "forward:/index.html";
  }
}

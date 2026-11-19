package com.youshop.prisma.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

/** Gate 5: deep links da SPA devem cair no index.html servido pelo proprio JAR. */
@SpringBootTest
@AutoConfigureMockMvc
class SpaFallbackTest {

  @Autowired private MockMvc mockMvc;

  @Test
  void diagnosticoEhServidoPeloIndexDaSpA() throws Exception {
    mockMvc
        .perform(get("/campanha/CMP-8492"))
        .andExpect(status().isOk())
        .andExpect(forwardedUrl("/index.html"));
  }

  @Test
  void evidenciasEhServidoPeloIndexDaSpA() throws Exception {
    mockMvc
        .perform(get("/campanha/CMP-8492/evidencias"))
        .andExpect(status().isOk())
        .andExpect(forwardedUrl("/index.html"));
  }

  @Test
  void apiNaoEhInterceptadaPeloFallback() throws Exception {
    mockMvc.perform(get("/api/dashboard")).andExpect(status().isOk()).andExpect(forwardedUrl(null));
  }
}

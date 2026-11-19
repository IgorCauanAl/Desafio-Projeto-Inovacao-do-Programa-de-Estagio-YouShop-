package com.youshop.prisma.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** CORS apenas para o dev server Angular/túneis; em produção o front serve pelo próprio JAR. */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry
        .addMapping("/api/**")
        .allowedOriginPatterns(
            "http://localhost:4200",
            "http://127.0.0.1:4200",
            "https://*.trycloudflare.com",
            "https://*.loca.lt")
        .allowedMethods("GET", "POST", "OPTIONS")
        .allowedHeaders("*");
  }
}

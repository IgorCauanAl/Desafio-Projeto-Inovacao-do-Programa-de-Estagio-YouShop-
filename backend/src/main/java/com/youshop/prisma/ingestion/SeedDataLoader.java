package com.youshop.prisma.ingestion;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.youshop.prisma.domain.Campanha;
import com.youshop.prisma.lgpd.SanitizadorLgpd;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class SeedDataLoader {

  private static final Logger log = LoggerFactory.getLogger(SeedDataLoader.class);

  private final ObjectMapper objectMapper;
  private final SanitizadorLgpd sanitizador;
  private final CampanhaRepository repository;

  public SeedDataLoader(
      ObjectMapper objectMapper, SanitizadorLgpd sanitizador, CampanhaRepository repository) {
    this.objectMapper = objectMapper;
    this.sanitizador = sanitizador;
    this.repository = repository;
  }

  @PostConstruct
  public void carregar() throws IOException {
    try (InputStream entrada = new ClassPathResource("data/campanhas.json").getInputStream()) {
      RawSeed.Dataset dataset = objectMapper.readValue(entrada, RawSeed.Dataset.class);
      List<Campanha> campanhas = dataset.campanhas().stream().map(sanitizador::sanitizar).toList();
      repository.carregar(dataset.metricas(), campanhas);
      log.info(
          "[ingestion] Seed carregado: {} campanhas, {} tickets sanitizados antes de qualquer tool/IA",
          campanhas.size(),
          campanhas.stream()
              .mapToInt(c -> c.evidencias().compradores().tickets().size())
              .sum());
    }
  }
}

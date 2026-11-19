package com.youshop.prisma.web;

import com.youshop.prisma.domain.DashboardResponse;
import com.youshop.prisma.ingestion.CampanhaRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {

  private final CampanhaRepository repository;

  public DashboardController(CampanhaRepository repository) {
    this.repository = repository;
  }

  @GetMapping("/dashboard")
  public DashboardResponse dashboard() {
    return new DashboardResponse(repository.metricas(), repository.listarResumosOrdenados());
  }
}

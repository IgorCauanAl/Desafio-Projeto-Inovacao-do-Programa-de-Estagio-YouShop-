package com.youshop.prisma.web;

import com.youshop.prisma.domain.Campanha;
import com.youshop.prisma.ingestion.CampanhaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/campanhas")
public class CampanhaController {

  private final CampanhaRepository repository;

  public CampanhaController(CampanhaRepository repository) {
    this.repository = repository;
  }

  @GetMapping("/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Campanha buscar(@PathVariable String id) {
    return repository
        .buscar(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campanha não encontrada: " + id));
  }
}

package com.youshop.prisma.web;

import com.youshop.prisma.domain.AcaoPayload;
import com.youshop.prisma.domain.AcaoRegistrada;
import com.youshop.prisma.domain.AcaoRequest;
import com.youshop.prisma.domain.Campanha;
import com.youshop.prisma.domain.ReprocessamentoResult;
import com.youshop.prisma.domain.StatusCampanha;
import com.youshop.prisma.ingestion.CampanhaRepository;
import com.youshop.prisma.orchestrator.OrquestradorAuditoriaService;
import java.time.Instant;
import java.util.NoSuchElementException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auditoria")
public class AuditoriaController {

  private final CampanhaRepository repository;
  private final OrquestradorAuditoriaService orquestrador;

  public AuditoriaController(
      CampanhaRepository repository, OrquestradorAuditoriaService orquestrador) {
    this.repository = repository;
    this.orquestrador = orquestrador;
  }

  @PostMapping("/{id}/acao")
  @ResponseStatus(HttpStatus.OK)
  public AcaoRegistrada registrarAcao(
      @PathVariable String id, @RequestBody AcaoRequest request) {
    Campanha campanha =
        repository
            .buscar(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campanha não encontrada: " + id));

    AcaoPayload payload =
        new AcaoPayload(
            request.acao(),
            id,
            "Promessa do Creator no minuto " + campanha.diagnostico().minuto(),
            StatusCampanha.RESOLVIDO,
            Instant.now().toString());

    repository.atualizarStatus(id, StatusCampanha.RESOLVIDO);
    return new AcaoRegistrada(id, request.acao(), payload);
  }

  @PostMapping("/{id}/reprocessar")
  @ResponseStatus(HttpStatus.OK)
  public ReprocessamentoResult reprocessar(@PathVariable String id) {
    try {
      return orquestrador.reprocessar(id);
    } catch (NoSuchElementException ex) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
    }
  }
}

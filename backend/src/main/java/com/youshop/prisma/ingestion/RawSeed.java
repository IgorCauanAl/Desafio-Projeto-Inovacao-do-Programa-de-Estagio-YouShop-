package com.youshop.prisma.ingestion;

import com.youshop.prisma.domain.Diagnostico;
import com.youshop.prisma.domain.EvidenciaCreator;
import com.youshop.prisma.domain.EvidenciaProdutor;
import com.youshop.prisma.domain.MetricasDashboard;
import com.youshop.prisma.domain.NivelRisco;
import com.youshop.prisma.domain.ResumoEvidencia;
import com.youshop.prisma.domain.StatusCampanha;
import java.util.List;

/**
 * Contratos brutos do seed. O {@code RawTicket} carrega PII de propósito para que o
 * módulo LGPD seja exercitado antes de qualquer dado seguir para o Orquestrador/MCP.
 */
public final class RawSeed {

  private RawSeed() {}

  public record Dataset(MetricasDashboard metricas, List<Campanha> campanhas) {}

  public record Campanha(
      String id,
      String titulo,
      String creator,
      String produtor,
      NivelRisco nivel,
      int ico,
      StatusCampanha status,
      Diagnostico diagnostico,
      Evidencias evidencias) {}

  public record Evidencias(
      EvidenciaCreator creator,
      EvidenciaProdutor produtor,
      Compradores compradores,
      List<ResumoEvidencia> resumos) {}

  public record Compradores(
      String total, List<Ticket> tickets, String tmr, String frustracao) {}

  public record Ticket(
      String id,
      String tempo,
      String mensagem,
      String categoria,
      String icone,
      String nomeComprador,
      String cpf,
      String email,
      String telefone) {}
}

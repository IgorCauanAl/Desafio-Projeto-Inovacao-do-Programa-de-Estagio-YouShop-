package com.youshop.prisma.domain;

public record Campanha(
    String id,
    String titulo,
    String creator,
    String produtor,
    NivelRisco nivel,
    int ico,
    StatusCampanha status,
    Diagnostico diagnostico,
    Evidencias evidencias) {

  public CampanhaResumo resumo() {
    return new CampanhaResumo(id, titulo, creator, produtor, nivel, ico);
  }

  public Campanha comStatus(StatusCampanha novoStatus) {
    return new Campanha(id, titulo, creator, produtor, nivel, ico, novoStatus, diagnostico, evidencias);
  }
}

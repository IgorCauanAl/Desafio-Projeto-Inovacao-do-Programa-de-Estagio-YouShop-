package com.youshop.prisma.domain;

public record AcaoPayload(
    AcaoOperacional acao,
    String campanhaId,
    String evidencia,
    StatusCampanha status,
    String registradoEm) {}

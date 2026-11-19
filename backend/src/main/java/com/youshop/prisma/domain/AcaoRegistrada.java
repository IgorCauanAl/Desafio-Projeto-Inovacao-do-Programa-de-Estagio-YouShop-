package com.youshop.prisma.domain;

public record AcaoRegistrada(
    String campanhaId, AcaoOperacional acao, AcaoPayload payload) {}

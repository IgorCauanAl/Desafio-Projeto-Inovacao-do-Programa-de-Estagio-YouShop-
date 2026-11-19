package com.youshop.prisma.domain;

public record EvidenciaProdutor(
    String formato,
    String inconsistencia,
    String prazoAcesso,
    String garantia,
    String garantiaDetalhe,
    String sku,
    String valor) {}

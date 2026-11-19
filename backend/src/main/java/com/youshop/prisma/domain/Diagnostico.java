package com.youshop.prisma.domain;

public record Diagnostico(
    String titulo,
    String resumo,
    String detalhe,
    String destaque,
    String minuto,
    int chamados,
    String causaRaiz,
    String confianca,
    String escopo,
    String prazo,
    String preco) {}

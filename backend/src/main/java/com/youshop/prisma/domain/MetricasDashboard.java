package com.youshop.prisma.domain;

public record MetricasDashboard(
    int indiceMedio,
    String variacao,
    int totalCampanhas,
    int criticos,
    int atencao,
    int alinhados,
    String relatosHoje) {}

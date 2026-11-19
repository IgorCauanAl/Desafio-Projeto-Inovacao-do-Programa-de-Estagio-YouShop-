package com.youshop.prisma.domain;

import java.util.List;

public record DashboardResponse(MetricasDashboard metricas, List<CampanhaResumo> campanhas) {}

package com.youshop.prisma.domain;

import java.util.List;

public record EvidenciaCompradores(
    String total, List<Ticket> tickets, String tmr, String frustracao) {}

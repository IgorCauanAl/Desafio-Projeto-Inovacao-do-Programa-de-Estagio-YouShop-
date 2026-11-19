package com.youshop.prisma.domain;

import java.util.List;

public record Evidencias(
    EvidenciaCreator creator,
    EvidenciaProdutor produtor,
    EvidenciaCompradores compradores,
    List<ResumoEvidencia> resumos) {}

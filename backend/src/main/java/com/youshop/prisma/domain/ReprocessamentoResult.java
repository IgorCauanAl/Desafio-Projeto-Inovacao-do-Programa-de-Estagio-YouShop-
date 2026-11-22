package com.youshop.prisma.domain;

import java.util.List;

public record ReprocessamentoResult(
    String campanhaId,
    int ico,
    String escopo,
    List<String> ferramentas,
    String mensagem,
    String detalhe,
    String resumoCausaRaiz,
    String confianca,
    String origem,
    String reprocessadoEm) {}

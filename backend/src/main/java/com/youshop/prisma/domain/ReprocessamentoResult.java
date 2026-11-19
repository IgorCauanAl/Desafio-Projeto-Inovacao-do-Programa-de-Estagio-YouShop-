package com.youshop.prisma.domain;

import java.util.List;

/** Resultado auditável de uma reanálise disparada pelo endpoint de auditoria. */
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

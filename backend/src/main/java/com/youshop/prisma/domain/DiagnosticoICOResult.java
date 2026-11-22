package com.youshop.prisma.domain;

/** Structured Outputs do ChatClient: ICO de 0 a 100 e pilares escopo/prazo/preço. */
public record DiagnosticoICOResult(
    int ico,
    String escopo,
    String prazo,
    String preco,
    String resumoCausaRaiz,
    String confianca,
    String recomendacao) {}

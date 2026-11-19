package com.youshop.prisma.domain;

/**
 * Contrato estruturado devolvido pelo ChatClient multimodal na Etapa 4.
 *
 * <p>O mesmo record é usado pelo fallback determinístico quando não há API Key no ambiente.
 *
 * @param ico índice de conformidade consolidado (0 a 100)
 * @param escopo situação do pilar Escopo
 * @param prazo situação do pilar Prazo
 * @param preco situação do pilar Preço
 * @param resumoCausaRaiz explicação XAI cruzando as três fontes sanitizadas
 * @param confianca descrição da confiança do diagnóstico
 * @param recomendacao ação sugerida para o analista humano
 */
public record DiagnosticoICOResult(
    int ico,
    String escopo,
    String prazo,
    String preco,
    String resumoCausaRaiz,
    String confianca,
    String recomendacao) {}

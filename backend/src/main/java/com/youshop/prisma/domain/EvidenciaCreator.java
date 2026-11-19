package com.youshop.prisma.domain;

public record EvidenciaCreator(
    String midia,
    String duracao,
    String minutoPromessa,
    int percentualLinhaDoTempo,
    String transcricao,
    String confiancaTranscricao,
    String origem,
    String imagem) {}

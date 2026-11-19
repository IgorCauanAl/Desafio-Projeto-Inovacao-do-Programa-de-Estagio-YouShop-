package com.youshop.prisma.domain;

/**
 * Ticket já sanitizado. Os campos de PII do seed bruto (nomeComprador, cpf, email, telefone)
 * deliberadamente NÃO existem neste record: são omitidos por construção no DTO exposto.
 */
public record Ticket(String id, String tempo, String mensagem, String categoria, String icone) {}

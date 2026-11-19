package com.youshop.prisma.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusCampanha {
  EM_DELIBERACAO("Em Deliberação"),
  RESOLVIDO("Resolvido");

  private final String valor;

  StatusCampanha(String valor) {
    this.valor = valor;
  }

  @JsonValue
  public String getValor() {
    return valor;
  }

  @JsonCreator
  public static StatusCampanha from(String valor) {
    for (StatusCampanha status : values()) {
      if (status.valor.equalsIgnoreCase(valor)) {
        return status;
      }
    }
    throw new IllegalArgumentException("Status de campanha desconhecido: " + valor);
  }
}

package com.youshop.prisma.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum NivelRisco {
  CRITICO("critico"),
  ATENCAO("atencao"),
  ALINHADO("alinhado");

  private final String valor;

  NivelRisco(String valor) {
    this.valor = valor;
  }

  @JsonValue
  public String getValor() {
    return valor;
  }

  @JsonCreator
  public static NivelRisco from(String valor) {
    for (NivelRisco nivel : values()) {
      if (nivel.valor.equalsIgnoreCase(valor)) {
        return nivel;
      }
    }
    throw new IllegalArgumentException("Nível de risco desconhecido: " + valor);
  }
}

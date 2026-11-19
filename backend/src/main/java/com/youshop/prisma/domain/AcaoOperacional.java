package com.youshop.prisma.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AcaoOperacional {
  NOTIFICAR_CREATOR("Notificar Creator"),
  NOTIFICAR_PRODUTOR("Notificar Produtor"),
  GERAR_DOSSIE("Gerar Dossiê / Restrição"),
  APROVAR_IGNORAR("Aprovar / Ignorar");

  private final String valor;

  AcaoOperacional(String valor) {
    this.valor = valor;
  }

  @JsonValue
  public String getValor() {
    return valor;
  }

  @JsonCreator
  public static AcaoOperacional from(String valor) {
    for (AcaoOperacional acao : values()) {
      if (acao.valor.equalsIgnoreCase(valor)) {
        return acao;
      }
    }
    throw new IllegalArgumentException("Ação operacional desconhecida: " + valor);
  }
}

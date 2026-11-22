package com.youshop.prisma.ingestion;

import com.youshop.prisma.domain.Campanha;
import com.youshop.prisma.domain.CampanhaResumo;
import com.youshop.prisma.domain.MetricasDashboard;
import com.youshop.prisma.domain.StatusCampanha;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

/** Repositório em memória: substitui o H2 neste recorte de demo. */
@Repository
public class CampanhaRepository {

  private final Map<String, Campanha> campanhas = new ConcurrentHashMap<>();
  private MetricasDashboard metricas;

  public void carregar(MetricasDashboard metricas, List<Campanha> campanhas) {
    this.metricas = metricas;
    this.campanhas.clear();
    campanhas.forEach(campanha -> this.campanhas.put(campanha.id(), campanha));
  }

  public MetricasDashboard metricas() {
    return metricas;
  }

  public List<CampanhaResumo> listarResumosOrdenados() {
    return campanhas.values().stream()
        .sorted(Comparator.comparingInt(Campanha::ico).thenComparing(Campanha::id))
        .map(Campanha::resumo)
        .toList();
  }

  public Optional<Campanha> buscar(String id) {
    return Optional.ofNullable(campanhas.get(id));
  }

  public Optional<Campanha> buscarPorSku(String sku) {
    return campanhas.values().stream()
        .filter(c -> c.evidencias() != null && c.evidencias().produtor() != null)
        .filter(c -> sku.equalsIgnoreCase(c.evidencias().produtor().sku()))
        .findFirst();
  }

  public Campanha atualizarStatus(String id, StatusCampanha status) {
    Campanha atual = campanhas.get(id);
    if (atual == null) {
      throw new IllegalArgumentException("Campanha não encontrada: " + id);
    }
    Campanha atualizada = atual.comStatus(status);
    campanhas.put(id, atualizada);
    return atualizada;
  }
}

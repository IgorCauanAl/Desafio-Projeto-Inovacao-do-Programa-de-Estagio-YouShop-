import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  AcaoOperacional,
  AcaoRegistrada,
  Campanha,
  CampanhaResumo,
  DashboardResponse,
  MetricasDashboard,
  Notificacao,
  ReprocessamentoResult,
  StatusCampanha,
} from '../models/campanha.model';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private readonly http = inject(HttpClient);

  private readonly campanhas = signal<Campanha[]>([]);

  readonly metricas = signal<MetricasDashboard | null>(null);
  readonly resumos = signal<CampanhaResumo[]>([]);
  readonly carregandoDashboard = signal(false);
  readonly carregandoCampanha = signal(false);
  readonly erroApi = signal<string | null>(null);

  readonly statusPorCampanha = signal<Record<string, StatusCampanha>>({});
  readonly ultimaAcao = signal<AcaoRegistrada | null>(null);
  readonly notificacao = signal<Notificacao | null>(null);
  readonly reanalisando = signal<string | null>(null);
  readonly ultimaReanalise = signal<Record<string, string>>({});

  readonly totalCampanhas = computed(() => this.campanhas().length);

  carregarDashboard(): void {
    this.carregandoDashboard.set(true);
    this.erroApi.set(null);
    this.http.get<DashboardResponse>('/api/dashboard').subscribe({
      next: (resposta) => {
        this.metricas.set(resposta.metricas);
        this.resumos.set(resposta.campanhas);
      },
      error: () => this.erroApi.set('Não foi possível carregar o dashboard. Verifique se a API está no ar.'),
      complete: () => this.carregandoDashboard.set(false),
    });
  }

  carregarCampanha(id: string): void {
    if (this.obterCampanha(id) || this.carregandoCampanha()) {
      return;
    }

    this.carregandoCampanha.set(true);
    this.erroApi.set(null);
    this.http.get<Campanha>(`/api/campanhas/${encodeURIComponent(id)}`).subscribe({
      next: (campanha) => {
        this.campanhas.update((lista) => [...lista.filter((item) => item.id !== id), campanha]);
        this.statusPorCampanha.update((statuses) => ({ ...statuses, [id]: campanha.status }));
      },
      error: () => this.erroApi.set(`Não foi possível carregar a campanha #${id}.`),
      complete: () => this.carregandoCampanha.set(false),
    });
  }

  obterCampanha(id: string | null): Campanha | undefined {
    return this.campanhas().find((campanha) => campanha.id === id);
  }

  registrarAcao(id: string, acao: AcaoOperacional): void {
    this.http
      .post<AcaoRegistrada>(`/api/auditoria/${encodeURIComponent(id)}/acao`, { acao })
      .subscribe({
        next: (resposta) => {
          this.statusPorCampanha.update((statuses) => ({ ...statuses, [id]: resposta.payload.status }));
          this.ultimaAcao.set(resposta);
          this.notificacao.set({
            titulo: `${acao} registrado`,
            mensagem: `Campanha #${id} atualizada de "Em Deliberação" para "${resposta.payload.status}".`,
            detalhe: `Evidência anexada: ${resposta.payload.evidencia}.`,
            tipo: 'acao',
          });
        },
        error: () => {
          this.notificacao.set({
            titulo: 'Falha ao registrar ação',
            mensagem: `Não foi possível registrar "${acao}" para a campanha #${id}.`,
            tipo: 'acao',
          });
        },
      });
  }

  simularReauditoria(id: string): void {
    if (this.reanalisando()) {
      return;
    }

    this.reanalisando.set(id);
    this.http
      .post<ReprocessamentoResult>(`/api/auditoria/${encodeURIComponent(id)}/reprocessar`, {})
      .subscribe({
        next: (resposta) => {
          const horario = new Date(resposta.reprocessadoEm).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          });
          this.ultimaReanalise.update((mapa) => ({ ...mapa, [id]: horario }));
          this.notificacao.set({
            titulo: 'Nova auditoria concluída',
            mensagem: resposta.mensagem,
            detalhe: [resposta.resumoCausaRaiz, resposta.detalhe].filter(Boolean).join(' '),
            tipo: 'auditoria',
          });
        },
        error: () => {
          this.notificacao.set({
            titulo: 'Falha na reauditoria',
            mensagem: `Não foi possível reprocessar a campanha #${id}.`,
            tipo: 'auditoria',
          });
        },
        complete: () => this.reanalisando.set(null),
      });
  }

  limparNotificacao(): void {
    this.notificacao.set(null);
  }
}

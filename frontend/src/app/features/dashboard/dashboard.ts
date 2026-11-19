import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuditoriaService } from '../../core/services/auditoria.service';
import { AlignmentMetric } from './alignment-metric';
import { FiltroFila, InspectionQueue } from './inspection-queue';
import { PriorityAlert } from './priority-alert';

@Component({
  selector: 'app-dashboard',
  imports: [PriorityAlert, AlignmentMetric, InspectionQueue],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly router = inject(Router);
  readonly auditoria = inject(AuditoriaService);

  readonly termo = signal('');
  readonly filtro = signal<FiltroFila>('all');
  readonly painelFiltros = signal(false);

  readonly metricas = this.auditoria.metricas;
  readonly resumos = this.auditoria.resumos;
  readonly erroApi = this.auditoria.erroApi;
  readonly carregandoDashboard = this.auditoria.carregandoDashboard;

  constructor() {
    this.auditoria.carregarDashboard();
  }

  aoBuscar(evento: Event): void {
    this.termo.set((evento.target as HTMLInputElement).value);
  }

  definirFiltro(filtro: FiltroFila): void {
    this.filtro.set(filtro);
    this.painelFiltros.set(false);
  }

  revisarCriticos(): void {
    this.definirFiltro('critico');
    document.getElementById('fila-inspecao')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  abrirCampanha(id: string): void {
    this.router.navigate(['/campanha', id]);
  }
}

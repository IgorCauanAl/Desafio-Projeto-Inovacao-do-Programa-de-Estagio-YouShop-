import { Component, input, output } from '@angular/core';
import { CREATOR_AVATARS } from '../../core/data/campanhas.mock';
import { MetricasDashboard } from '../../core/models/campanha.model';

@Component({
  selector: 'app-priority-alert',
  template: `
    <div class="h-full bg-primary-container text-on-primary-container rounded-[24px] p-8 xl:p-9 shadow-[0_12px_36px_-6px_rgba(33,112,228,0.22)] relative overflow-hidden flex flex-col justify-between group transition-transform duration-300">
      <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-fixed-dim/20 blur-3xl pointer-events-none"></div>
      <div class="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-surface-container-lowest/10 blur-2xl pointer-events-none"></div>

      <div class="relative z-10 flex items-center justify-between mb-space-lg">
        <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-on-primary font-label-sm text-label-sm tracking-wide uppercase">
          <span class="material-symbols-outlined text-[15px] animate-pulse">bolt</span>
          <span>Prioridade Máxima</span>
        </div>
        <span class="font-label-sm text-label-sm text-primary-fixed opacity-80 tracking-wider">LIVE TELEMETRIA</span>
      </div>

      <div class="relative z-10 my-space-md">
        <h2 class="font-headline-lg text-headline-lg font-bold text-on-primary tracking-tight leading-tight">Alertas Prioritários</h2>
        <p class="font-body-lg text-body-lg text-primary-fixed max-w-lg mt-2 leading-relaxed opacity-95">
          3 campanhas exigem revisão imediata antes de escalar reembolsos e retenções de faturamento.
        </p>
      </div>

      <div class="relative z-10 pt-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div class="flex items-center gap-space-sm">
          <div class="flex -space-x-2.5 items-center">
            @for (avatar of avatares; track avatar) {
              <img class="w-10 h-10 rounded-full object-cover ring-2 ring-primary-container shadow-sm" [src]="avatar" alt="Creator em análise" />
            }
          </div>
          <div class="flex flex-col">
            <span class="font-label-md text-label-md text-on-primary font-bold tracking-tight">{{ metricas().relatosHoje }} relatos hoje</span>
            <span class="font-body-sm text-body-sm text-primary-fixed opacity-75 leading-tight">reclamacoes registradas</span>
          </div>
        </div>
        <button
          type="button"
          (click)="revisarCriticos.emit()"
          class="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-on-background text-on-primary font-label-lg text-label-lg font-semibold hover:bg-inverse-surface shadow-[0_4px_16px_rgba(24,28,33,0.25)] transition-all duration-200 active:scale-[0.97] self-start sm:self-auto"
        >
          <span>Revisar Críticos</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  `,
})
export class PriorityAlert {
  readonly metricas = input.required<MetricasDashboard>();
  readonly revisarCriticos = output<void>();
  readonly avatares = CREATOR_AVATARS;
}

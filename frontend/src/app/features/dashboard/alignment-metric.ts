import { Component, input } from '@angular/core';
import { MetricasDashboard } from '../../core/models/campanha.model';

@Component({
  selector: 'app-alignment-metric',
  template: `
    <div class="h-full bg-surface-container-lowest rounded-[24px] p-8 xl:p-9 shadow-[0_4px_24px_-2px_rgba(24,24,27,0.03),0_2px_8px_-1px_rgba(24,24,27,0.02)] flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <span class="font-label-lg text-label-lg text-on-surface-variant font-medium">Índice Médio de Alinhamento</span>
        <div class="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
          <span class="material-symbols-outlined text-[18px]">verified</span>
        </div>
      </div>

      <div class="my-space-md">
        <div class="flex items-baseline gap-space-sm">
          <span class="font-metric-stat text-metric-stat font-extrabold text-on-background tracking-tighter">{{ metricas().indiceMedio }}%</span>
          <span class="inline-flex items-center gap-0.5 font-label-md text-label-md font-semibold text-tertiary bg-on-tertiary-container/30 px-2.5 py-0.5 rounded-full">
            <span class="material-symbols-outlined text-[14px]">trending_up</span>{{ metricas().variacao }}
          </span>
        </div>
        <p class="font-body-sm text-body-sm text-outline mt-1">Conformidade nas últimas 24 horas sobre {{ metricas().totalCampanhas }} campanhas ativas</p>

        <div class="mt-space-lg flex items-center gap-1.5 w-full h-3">
          <div class="h-full rounded-full bg-error flex-[3] transition-all" title="Críticos (30%)"></div>
          <div class="h-full rounded-full bg-amber-400 flex-[4] transition-all" title="Atenção (40%)"></div>
          <div class="h-full rounded-full bg-tertiary flex-[13] transition-all" title="Alinhados (130%)"></div>
        </div>
      </div>

      <div class="pt-space-md grid grid-cols-3 gap-space-xs bg-surface-container-low rounded-xl p-3">
        <div class="flex flex-col items-center justify-center py-1">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-error inline-block"></span>
            <span class="font-headline-sm text-headline-sm font-bold text-on-surface">{{ metricas().criticos }}</span>
          </div>
          <span class="font-label-sm text-label-sm text-on-surface-variant font-medium mt-0.5">Críticos</span>
        </div>
        <div class="flex flex-col items-center justify-center py-1">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span class="font-headline-sm text-headline-sm font-bold text-on-surface">{{ metricas().atencao }}</span>
          </div>
          <span class="font-label-sm text-label-sm text-on-surface-variant font-medium mt-0.5">Atenção</span>
        </div>
        <div class="flex flex-col items-center justify-center py-1">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
            <span class="font-headline-sm text-headline-sm font-bold text-on-surface">{{ metricas().alinhados }}</span>
          </div>
          <span class="font-label-sm text-label-sm text-on-surface-variant font-medium mt-0.5">Alinhados</span>
        </div>
      </div>
    </div>
  `,
})
export class AlignmentMetric {
  readonly metricas = input.required<MetricasDashboard>();
}

import { Component, input } from '@angular/core';
import { ResumoEvidencia } from '../../core/models/campanha.model';

@Component({
  selector: 'app-evidence-summary-card',
  template: `
    <div class="h-full bg-surface-container-lowest rounded-[24px] p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div class="flex flex-col gap-space-md">
        <div class="w-11 h-11 rounded-2xl bg-surface-container-low text-on-surface flex items-center justify-center">
          <span class="material-symbols-outlined text-[22px]">{{ resumo().icone }}</span>
        </div>
        <div>
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-1">{{ resumo().label }}</span>
          @if (resumo().destaque) {
            <div class="flex items-baseline gap-2">
              <span class="font-headline-lg text-headline-lg font-extrabold text-on-surface tracking-tight">{{ resumo().destaque }}</span>
              <span class="font-body-md text-body-md font-semibold flex items-center" [class.text-error]="ehPico()" [class.text-tertiary]="!ehPico()">
                <span class="material-symbols-outlined text-[16px]">arrow_upward</span>{{ resumo().destaqueSufixo }}
              </span>
            </div>
          } @else {
            <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug">{{ resumo().titulo }}</h2>
          }
        </div>
      </div>
      <div class="pt-space-md mt-space-md flex items-center justify-between border-t border-surface-container">
        @if (resumo().rodapeIcone) {
          <span class="inline-flex items-center gap-1.5 bg-surface-container-low text-on-surface-variant font-label-md text-label-md px-3 py-1 rounded-full font-medium">
            <span class="material-symbols-outlined text-[14px]">{{ resumo().rodapeIcone }}</span>{{ resumo().rodapeTexto }}
          </span>
        } @else {
          <span class="font-body-sm text-body-sm text-on-surface-variant font-medium">{{ resumo().rodapeTexto }}</span>
        }
        <span class="font-body-sm text-body-sm text-outline">{{ resumo().rodapeDetalhe }}</span>
      </div>
    </div>
  `,
})
export class EvidenceSummaryCard {
  readonly resumo = input.required<ResumoEvidencia>();

  ehPico(): boolean {
    return (this.resumo().destaqueSufixo ?? '').toLowerCase().includes('pico');
  }
}

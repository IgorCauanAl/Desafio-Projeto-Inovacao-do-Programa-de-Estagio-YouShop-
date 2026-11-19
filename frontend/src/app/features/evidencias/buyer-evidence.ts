import { Component, input } from '@angular/core';
import { EvidenciaCompradores } from '../../core/models/campanha.model';

@Component({
  selector: 'app-buyer-evidence',
  template: `
    <div class="h-full bg-surface-container-lowest rounded-[24px] p-space-lg lg:p-space-xl flex flex-col justify-between shadow-[0_4px_24px_-2px_rgba(24,28,33,0.04)]">
      <div>
        <div class="flex items-center justify-between mb-space-md">
          <div class="flex items-center gap-2.5">
            <div class="flex -space-x-2">
              <div class="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface font-label-sm text-label-sm ring-2 ring-white">C1</div>
              <div class="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-label-sm text-label-sm ring-2 ring-white">C2</div>
              <div class="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-label-sm text-label-sm ring-2 ring-white">C3</div>
            </div>
            <div>
              <span class="font-headline-sm text-headline-sm text-on-surface">Compradores</span>
              <span class="font-body-sm text-body-sm text-on-surface font-semibold block leading-tight">{{ evidencia().total }} relatos similares</span>
            </div>
          </div>
          <span
            class="px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold flex items-center gap-1"
            [class]="ehPico() ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed'"
          >
            <span class="w-1.5 h-1.5 rounded-full" [class]="ehPico() ? 'bg-error' : 'bg-tertiary'"></span>
            {{ ehPico() ? 'Pico atípico' : 'Dentro da média' }}
          </span>
        </div>

        <div class="flex flex-col gap-3 mb-space-md">
          @for (ticket of evidencia().tickets; track ticket.id) {
            <div class="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2">
              <div class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span class="font-bold text-on-surface">Ticket #{{ ticket.id }}</span>
                <span>{{ ticket.tempo }}</span>
              </div>
              <p class="font-body-md text-body-md text-on-surface italic leading-snug">{{ ticket.mensagem }}</p>
              <div class="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                <span class="material-symbols-outlined text-[14px]">{{ ticket.icone }}</span>
                <span>{{ ticket.categoria }}</span>
              </div>
            </div>
          }
        </div>

        <div class="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">timer</span>
            <span class="font-body-sm text-body-sm text-on-surface-variant">T.M.R: <strong class="text-on-surface">{{ evidencia().tmr }}</strong></span>
          </div>
          <div class="flex items-center gap-1 text-error font-label-md text-label-md font-semibold">
            <span class="material-symbols-outlined text-[16px]">sentiment_dissatisfied</span>
            <span>{{ evidencia().frustracao }} Frustração</span>
          </div>
        </div>
      </div>

      <div class="mt-space-lg pt-space-md flex items-center justify-between">
        <span class="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">Últimas 24 horas</span>
        <span class="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>Fila prioritária Ops
        </span>
      </div>
    </div>
  `,
})
export class BuyerEvidence {
  readonly evidencia = input.required<EvidenciaCompradores>();

  ehPico(): boolean {
    return parseFloat(this.evidencia().frustracao) > 50;
  }
}

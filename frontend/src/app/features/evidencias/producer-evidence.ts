import { Component, input } from '@angular/core';
import { EvidenciaProdutor } from '../../core/models/campanha.model';

@Component({
  selector: 'app-producer-evidence',
  template: `
    <div class="h-full bg-surface-container-lowest rounded-[24px] p-space-lg lg:p-space-xl flex flex-col justify-between shadow-[0_4px_24px_-2px_rgba(24,28,33,0.04)]">
      <div>
        <div class="flex items-center justify-between mb-space-md">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
            </div>
            <div>
              <span class="font-headline-sm text-headline-sm text-on-surface">Produtor</span>
              <span class="font-body-sm text-body-sm text-on-surface-variant block leading-tight">Configuração Oficial</span>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">Parametrização</span>
        </div>

        <div class="flex flex-col gap-3 mb-space-md">
          <div class="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <span class="font-body-sm text-body-sm text-on-surface-variant">Formato cadastrado:</span>
              <span
                class="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1"
                [class]="temInconsistencia() ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed'"
              >
                <span class="material-symbols-outlined text-[14px]">{{ temInconsistencia() ? 'cancel' : 'check_circle' }}</span>{{ evidencia().formato }}
              </span>
            </div>
            <div class="flex items-center gap-1 text-error font-label-sm text-label-sm">
              <span class="material-symbols-outlined text-[14px]">info</span>
              <span>{{ evidencia().inconsistencia }}</span>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-on-surface-variant">schedule</span>
              <span class="font-body-sm text-body-sm text-on-surface-variant">Prazo de acesso:</span>
            </div>
            <span class="font-label-lg text-label-lg text-on-surface font-bold">{{ evidencia().prazoAcesso }}</span>
          </div>

          <div class="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-on-surface-variant">verified_user</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant">Garantia:</span>
              </div>
              <span class="font-label-lg text-label-lg text-on-surface font-bold">{{ evidencia().garantia }}</span>
            </div>
            <span class="font-body-sm text-body-sm text-on-surface-variant self-end">{{ evidencia().garantiaDetalhe }}</span>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-surface-container flex items-center justify-between">
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Identificador</span>
            <span class="font-label-md text-label-md font-bold text-on-surface">{{ evidencia().sku }}</span>
          </div>
          <div class="h-6 w-px bg-outline-variant"></div>
          <div class="flex flex-col text-right">
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Valor Checkout</span>
            <span class="font-headline-sm text-headline-sm font-extrabold text-on-surface">{{ evidencia().valor }}</span>
          </div>
        </div>
      </div>

      <div class="mt-space-lg pt-space-md flex items-center justify-between">
        <span class="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-semibold">Dados do Checkout</span>
        <button type="button" class="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline">
          <span>Ver contrato oficial</span>
          <span class="material-symbols-outlined text-[14px]">north_east</span>
        </button>
      </div>
    </div>
  `,
})
export class ProducerEvidence {
  readonly evidencia = input.required<EvidenciaProdutor>();

  temInconsistencia(): boolean {
    return !this.evidencia().inconsistencia.toLowerCase().startsWith('sem');
  }
}

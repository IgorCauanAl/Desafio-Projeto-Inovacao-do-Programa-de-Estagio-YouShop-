import { Component, input, output } from '@angular/core';
import { AcaoOperacional, StatusCampanha } from '../../core/models/campanha.model';

@Component({
  selector: 'app-decision-bar',
  template: `
    <div class="bg-surface-container-lowest rounded-[24px] p-space-lg lg:p-space-xl shadow-[0_6px_32px_-4px_rgba(24,28,33,0.06)] flex flex-col gap-space-md">
      <div class="flex items-center justify-between flex-wrap gap-space-sm">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[20px] text-primary">gavel</span>
          <span class="font-label-lg text-label-lg text-on-surface font-bold uppercase tracking-wider">Ação Operacional Recomendada</span>
        </div>
        @if (status() === 'Resolvido') {
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
            <span class="material-symbols-outlined text-[14px]">check_circle</span>Resolvido
          </span>
        } @else {
          <span class="font-body-sm text-body-sm text-on-surface-variant">Selecione uma resolução preventiva para a esteira #{{ campanhaId() }}</span>
        }
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <button type="button" (click)="acao.emit('Notificar Creator')" class="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#18181B] text-white hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-md">
          <span class="material-symbols-outlined text-[18px]">send</span>
          <span class="font-label-lg text-label-lg">Notificar Creator</span>
        </button>
        <button type="button" (click)="acao.emit('Notificar Produtor')" class="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-surface-container-lowest text-on-surface shadow-[inset_0_0_0_2px_#18181B] hover:bg-surface-container-low active:scale-[0.98] transition-all">
          <span class="material-symbols-outlined text-[18px]">contact_mail</span>
          <span class="font-label-lg text-label-lg">Notificar Produtor</span>
        </button>
        <button type="button" (click)="acao.emit('Gerar Dossiê / Restrição')" class="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-error-container text-on-error-container hover:bg-[#ffcdc8] active:scale-[0.98] transition-all">
          <span class="material-symbols-outlined text-[18px] text-error">shield_with_heart</span>
          <span class="font-label-lg text-label-lg font-bold">Gerar Dossiê / Restrição</span>
        </button>
        <button type="button" (click)="acao.emit('Aprovar / Ignorar')" class="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface active:scale-[0.98] transition-all">
          <span class="material-symbols-outlined text-[18px]">done_all</span>
          <span class="font-label-lg text-label-lg">Aprovar / Ignorar</span>
        </button>
      </div>
    </div>
  `,
})
export class DecisionBar {
  readonly campanhaId = input.required<string>();
  readonly status = input.required<StatusCampanha>();
  readonly acao = output<AcaoOperacional>();
}

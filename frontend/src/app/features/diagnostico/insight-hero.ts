import { Component, input } from '@angular/core';
import { Diagnostico } from '../../core/models/campanha.model';

@Component({
  selector: 'app-insight-hero',
  template: `
    <div class="h-full min-h-[300px] bg-primary rounded-[24px] p-space-xl text-on-primary shadow-sm flex flex-col justify-between relative overflow-hidden">
      <div class="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-primary-container/40 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 flex flex-col items-start gap-space-lg">
        <span class="inline-flex items-center gap-1.5 bg-surface-container-lowest/15 backdrop-blur-md px-3.5 py-1 rounded-full text-on-primary font-label-sm text-label-sm uppercase tracking-wider">
          <span class="material-symbols-outlined text-[14px]">auto_awesome</span>
          Resumo da Análise Inteligente
        </span>
        <p class="font-headline-sm text-headline-sm text-on-primary font-medium leading-relaxed max-w-2xl">
          <span class="font-bold underline decoration-white/40 underline-offset-4">{{ diagnostico().titulo }}:</span>
          {{ diagnostico().resumo }}
          <span class="bg-surface-container-lowest/20 px-1.5 py-0.5 rounded font-semibold text-on-primary text-body-sm">{{ diagnostico().destaque }}</span>{{ diagnostico().detalhe }}
        </p>
      </div>
      <div class="relative z-10 flex items-center justify-between pt-space-lg mt-space-md border-t border-on-primary/15 flex-wrap gap-space-sm">
        <div class="inline-flex items-center gap-2 bg-surface-container-lowest/20 backdrop-blur-sm text-on-primary px-3 py-1.5 rounded-full font-label-md text-label-md">
          <span class="material-symbols-outlined text-[16px] text-tertiary-fixed">check_circle</span>
          <span>{{ diagnostico().causaRaiz }}</span>
        </div>
        <div class="inline-flex items-center gap-1.5 text-on-primary/75 font-body-sm text-body-sm">
          <span class="material-symbols-outlined text-[16px]">verified_user</span>
          <span>{{ diagnostico().confianca }}</span>
        </div>
      </div>
    </div>
  `,
})
export class InsightHero {
  readonly diagnostico = input.required<Diagnostico>();
}

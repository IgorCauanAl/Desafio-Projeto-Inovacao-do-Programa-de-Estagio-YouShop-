import { Component, computed, input } from '@angular/core';
import { Diagnostico } from '../../core/models/campanha.model';

@Component({
  selector: 'app-ico-gauge',
  template: `
    <div class="h-full bg-surface-container-lowest rounded-[24px] p-space-xl shadow-sm flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="font-headline-sm text-headline-sm text-on-surface font-bold">Compatibilidade (ICO)</span>
          <button aria-label="Informações sobre ICO" class="text-outline hover:text-on-surface transition-colors flex items-center" type="button">
            <span class="material-symbols-outlined text-[18px]">info</span>
          </button>
        </div>
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm" [class]="seloClasses()">
          <span class="material-symbols-outlined text-[14px]">{{ ico() < 85 ? 'trending_down' : 'trending_up' }}</span>
          {{ seloTexto() }}
        </span>
      </div>

      <div class="my-space-md">
        <div class="flex items-baseline gap-2 mb-space-sm">
          <span class="font-metric-stat text-metric-stat text-on-surface font-extrabold tracking-tight">{{ ico() }}%</span>
          <span class="font-label-md text-label-md text-outline">índice de conformidade</span>
        </div>
        <div aria-hidden="true" class="flex items-center gap-1 w-full h-8 py-1.5">
          @for (barra of barras; track $index) {
            <div
              class="h-full flex-1 rounded-full transition-all"
              [class.bg-error]="$index < barrasAtivas()"
              [class.bg-surface-variant]="$index >= barrasAtivas()"
            ></div>
          }
        </div>
      </div>

      <div class="flex items-center justify-between pt-space-md border-t border-surface-container flex-wrap gap-2">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full" [class.bg-error]="diagnostico().escopo === 'Divergente'" [class.bg-tertiary]="diagnostico().escopo === 'Alinhado'"></span>
          <span class="font-label-sm text-label-sm text-on-surface">Escopo: <strong class="font-semibold" [class.text-error]="diagnostico().escopo === 'Divergente'" [class.text-tertiary]="diagnostico().escopo === 'Alinhado'">{{ diagnostico().escopo }}</strong></span>
        </div>
        <div class="w-1 h-3 rounded-full bg-surface-container hidden sm:block"></div>
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full" [class.bg-error]="diagnostico().prazo === 'Divergente'" [class.bg-tertiary]="diagnostico().prazo === 'Alinhado'"></span>
          <span class="font-label-sm text-label-sm text-on-surface">Prazo: <strong class="font-semibold" [class.text-error]="diagnostico().prazo === 'Divergente'" [class.text-tertiary]="diagnostico().prazo === 'Alinhado'">{{ diagnostico().prazo }}</strong></span>
        </div>
        <div class="w-1 h-3 rounded-full bg-surface-container hidden sm:block"></div>
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full" [class.bg-error]="diagnostico().preco === 'Divergente'" [class.bg-tertiary]="diagnostico().preco === 'Alinhado'"></span>
          <span class="font-label-sm text-label-sm text-on-surface">Preço: <strong class="font-semibold" [class.text-error]="diagnostico().preco === 'Divergente'" [class.text-tertiary]="diagnostico().preco === 'Alinhado'">{{ diagnostico().preco }}</strong></span>
        </div>
      </div>
    </div>
  `,
})
export class IcoGauge {
  readonly ico = input.required<number>();
  readonly diagnostico = input.required<Diagnostico>();
  readonly barras = Array.from({ length: 22 }, (_, indice) => indice);
  readonly barrasAtivas = computed(() => Math.ceil((this.ico() / 100) * this.barras.length));

  readonly seloClasses = computed(() => {
    const ico = this.ico();
    if (ico < 50) return 'text-error bg-error-container/60';
    if (ico < 85) return 'text-amber-800 bg-amber-100';
    return 'text-tertiary bg-tertiary-fixed/60';
  });

  readonly seloTexto = computed(() => {
    const ico = this.ico();
    if (ico < 50) return 'Incompatibilidade Alta';
    if (ico < 85) return 'Atenção Moderada';
    return 'Alinhamento Alto';
  });
}

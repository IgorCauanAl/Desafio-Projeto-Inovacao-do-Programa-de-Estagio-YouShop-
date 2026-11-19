import { Component, input } from '@angular/core';
import { NivelRisco } from '../../core/models/campanha.model';

@Component({
  selector: 'app-status-badge',
  template: `
    @switch (nivel()) {
      @case ('critico') {
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-error"></span>Crítico
        </span>
      }
      @case ('atencao') {
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-label-sm text-label-sm font-semibold shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Atenção
        </span>
      }
      @case ('alinhado') {
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>Alinhado
        </span>
      }
    }
  `,
})
export class StatusBadge {
  readonly nivel = input.required<NivelRisco>();
}

import { Component, input, output } from '@angular/core';
import { CampanhaResumo } from '../../core/models/campanha.model';
import { IcoBadge } from '../../shared/ico-badge/ico-badge';
import { StatusBadge } from '../../shared/status-badge/status-badge';

@Component({
  selector: 'app-queue-row',
  imports: [StatusBadge, IcoBadge],
  template: `
    <div
      (click)="abrir.emit(campanha().id)"
      class="group flex flex-col md:flex-row md:items-center justify-between p-space-md lg:p-space-lg rounded-2xl hover:bg-surface-container-low/60 transition-all duration-200 cursor-pointer gap-space-md"
    >
      <div class="flex items-center gap-space-md min-w-0">
        <app-status-badge [nivel]="campanha().nivel" />
        <span class="font-label-lg text-label-lg font-bold text-on-surface tracking-wider shrink-0">#{{ campanha().id }}</span>
        <div class="flex items-center gap-space-xs truncate">
          <span class="font-body-md text-body-md font-medium text-on-surface truncate">
            {{ campanha().creator }} <span class="text-outline font-normal">(Creator)</span> + {{ campanha().produtor }}
            <span class="text-outline font-normal">(Produtor)</span>
          </span>
        </div>
      </div>
      <div class="flex items-center justify-between md:justify-end gap-space-lg shrink-0">
        <app-ico-badge [ico]="campanha().ico" />
        <div class="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant group-hover:bg-on-background group-hover:text-on-primary group-hover:translate-x-1 transition-all">
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </div>
      </div>
    </div>
  `,
})
export class QueueRow {
  readonly campanha = input.required<CampanhaResumo>();
  readonly abrir = output<string>();
}

import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-ico-badge',
  template: `
    <span
      class="px-3 py-1 rounded-full font-label-md text-label-md font-bold"
      [class]="classes()"
    >
      ICO {{ ico() }}%
    </span>
  `,
})
export class IcoBadge {
  readonly ico = input.required<number>();

  readonly classes = computed(() => {
    const value = this.ico();
    if (value < 50) {
      return 'bg-error-container/60 text-error';
    }
    if (value < 85) {
      return 'bg-amber-100/80 text-amber-800';
    }
    return 'bg-tertiary-fixed/60 text-tertiary';
  });
}

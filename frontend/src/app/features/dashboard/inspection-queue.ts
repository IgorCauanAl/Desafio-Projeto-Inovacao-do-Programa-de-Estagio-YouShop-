import { Component, computed, input, output } from '@angular/core';
import { CampanhaResumo, NivelRisco } from '../../core/models/campanha.model';
import { QueueRow } from './queue-row';

export type FiltroFila = 'all' | NivelRisco;

@Component({
  selector: 'app-inspection-queue',
  imports: [QueueRow],
  template: `
    <div id="fila-inspecao" class="bg-surface-container-lowest rounded-[24px] p-8 lg:p-9 shadow-[0_4px_24px_-2px_rgba(24,24,27,0.03),0_2px_8px_-1px_rgba(24,24,27,0.02)]">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg">
        <div class="flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-[22px] text-on-surface-variant">tune</span>
          <h3 class="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">Fila de Inspeção por Prioridade</h3>
        </div>
        <div class="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-full self-start sm:self-auto overflow-x-auto max-w-full">
          @for (opcao of opcoes; track opcao.valor) {
            <button
              type="button"
              (click)="aoFiltrar.emit(opcao.valor)"
              [class.bg-on-background]="filtro() === opcao.valor"
              [class.text-on-primary]="filtro() === opcao.valor"
              [class.font-semibold]="filtro() === opcao.valor"
              [class.font-medium]="filtro() !== opcao.valor"
              [class.text-on-surface-variant]="filtro() !== opcao.valor"
              class="px-4 py-1.5 rounded-full font-label-md text-label-md hover:text-on-surface transition-all duration-150"
            >
              {{ opcao.label }}
            </button>
          }
        </div>
      </div>

      <div class="flex flex-col gap-space-sm mt-space-sm">
        @for (campanha of visiveis(); track campanha.id) {
          <app-queue-row [campanha]="campanha" (abrir)="abrir.emit($event)" />
        } @empty {
          <div class="p-space-lg rounded-2xl bg-surface-container-low/60 text-center">
            <span class="material-symbols-outlined text-[22px] text-outline">filter_alt_off</span>
            <p class="font-body-md text-body-md text-on-surface-variant mt-2">Nenhuma campanha corresponde aos filtros selecionados.</p>
          </div>
        }
      </div>

      <div class="pt-space-lg mt-space-md flex items-center justify-between border-t-0 text-outline">
        <span class="font-body-sm text-body-sm">Exibindo {{ visiveis().length }} de 45 campanhas prioritárias</span>
        <button type="button" (click)="aoFiltrar.emit('all')" class="inline-flex items-center gap-1 font-label-md text-label-md font-semibold text-primary hover:text-primary-container transition-colors">
          <span>Ver todas as pendências</span>
          <span class="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  `,
})
export class InspectionQueue {
  readonly campanhas = input<CampanhaResumo[]>([]);
  readonly termo = input('');
  readonly filtro = input.required<FiltroFila>();
  readonly abrir = output<string>();
  readonly aoFiltrar = output<FiltroFila>();

  readonly opcoes: { valor: FiltroFila; label: string }[] = [
    { valor: 'all', label: 'Todos' },
    { valor: 'critico', label: 'Crítico' },
    { valor: 'atencao', label: 'Atenção' },
    { valor: 'alinhado', label: 'Alinhado' },
  ];

  readonly visiveis = computed(() => {
    const busca = this.termo().trim().toLocaleLowerCase('pt-BR');
    return this.campanhas().filter((campanha) => {
      const filtraNivel = this.filtro() === 'all' || campanha.nivel === this.filtro();
      const filtraBusca =
        !busca ||
        `${campanha.id} ${campanha.titulo} ${campanha.creator} ${campanha.produtor}`.toLocaleLowerCase('pt-BR').includes(busca);
      return filtraNivel && filtraBusca;
    }).sort((a, b) => a.ico - b.ico);
  });
}

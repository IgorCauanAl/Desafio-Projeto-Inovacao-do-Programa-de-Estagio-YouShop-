import { Component, computed, effect, inject, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AcaoOperacional, StatusCampanha } from '../../core/models/campanha.model';
import { AuditoriaService } from '../../core/services/auditoria.service';
import { BuyerEvidence } from './buyer-evidence';
import { CreatorEvidence } from './creator-evidence';
import { DecisionBar } from './decision-bar';
import { ProducerEvidence } from './producer-evidence';

@Component({
  selector: 'app-evidencias',
  imports: [RouterLink, CreatorEvidence, ProducerEvidence, BuyerEvidence, DecisionBar],
  templateUrl: './evidencias.html',
})
export class Evidencias {
  private readonly route = inject(ActivatedRoute);
  readonly auditoria = inject(AuditoriaService);

  private readonly paramMap = toSignal(this.route.paramMap);
  readonly campanha = computed(() => this.auditoria.obterCampanha(this.paramMap()?.get('id') ?? null));
  readonly status = computed<StatusCampanha>(() => {
    const id = this.campanha()?.id;
    return (id && this.auditoria.statusPorCampanha()[id]) || 'Em Deliberação';
  });
  readonly carregando = this.auditoria.carregandoCampanha;
  readonly erroApi = this.auditoria.erroApi;

  constructor() {
    effect(() => {
      const id = this.paramMap()?.get('id');
      if (id) {
        untracked(() => this.auditoria.carregarCampanha(id));
      }
    });
  }

  registrarAcao(acao: AcaoOperacional): void {
    const id = this.campanha()?.id;
    if (id) {
      this.auditoria.registrarAcao(id, acao);
    }
  }
}

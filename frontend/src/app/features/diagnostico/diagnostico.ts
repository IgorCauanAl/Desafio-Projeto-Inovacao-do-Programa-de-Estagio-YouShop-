import { Component, computed, effect, inject, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuditoriaService } from '../../core/services/auditoria.service';
import { EvidenceSummaryCard } from './evidence-summary-card';
import { IcoGauge } from './ico-gauge';
import { InsightHero } from './insight-hero';

@Component({
  selector: 'app-diagnostico',
  imports: [RouterLink, InsightHero, IcoGauge, EvidenceSummaryCard],
  templateUrl: './diagnostico.html',
})
export class Diagnostico {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly auditoria = inject(AuditoriaService);

  private readonly paramMap = toSignal(this.route.paramMap);
  readonly campanha = computed(() => this.auditoria.obterCampanha(this.paramMap()?.get('id') ?? null));
  readonly reanalisando = this.auditoria.reanalisando;
  readonly carregando = this.auditoria.carregandoCampanha;
  readonly erroApi = this.auditoria.erroApi;
  readonly ultimaReanalise = computed(() => {
    const id = this.campanha()?.id;
    return id ? this.auditoria.ultimaReanalise()[id] : undefined;
  });

  constructor() {
    effect(() => {
      const id = this.paramMap()?.get('id');
      if (id) {
        untracked(() => this.auditoria.carregarCampanha(id));
      }
    });
  }

  inspecionarEvidencias(): void {
    const id = this.campanha()?.id;
    if (id) {
      this.router.navigate(['/campanha', id, 'evidencias']);
    }
  }

  simularAuditoria(): void {
    const id = this.campanha()?.id;
    if (id) {
      this.auditoria.simularReauditoria(id);
    }
  }
}

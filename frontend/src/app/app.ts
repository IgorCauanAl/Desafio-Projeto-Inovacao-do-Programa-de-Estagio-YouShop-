import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuditoriaService } from './core/services/auditoria.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  readonly auditoria = inject(AuditoriaService);
  readonly notificacao = this.auditoria.notificacao;

  constructor() {
    effect(() => {
      if (!this.notificacao()) {
        return;
      }
      window.setTimeout(() => this.auditoria.limparNotificacao(), 7000);
    });
  }

  rotaAtual(path: 'dashboard' | 'campanhas'): boolean {
    return path === 'dashboard' ? this.router.url === '/' : this.router.url.startsWith('/campanha');
  }
}

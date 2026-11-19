import { Component, input, signal } from '@angular/core';
import { EvidenciaCreator } from '../../core/models/campanha.model';

@Component({
  selector: 'app-creator-evidence',
  template: `
    <div class="h-full bg-surface-container-lowest rounded-[24px] p-space-lg lg:p-space-xl flex flex-col justify-between shadow-[0_4px_24px_-2px_rgba(24,28,33,0.04)]">
      <div>
        <div class="flex items-center justify-between mb-space-md">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-[18px]">videocam</span>
            </div>
            <div>
              <span class="font-headline-sm text-headline-sm text-on-surface">Creator</span>
              <span class="font-body-sm text-body-sm text-on-surface-variant block leading-tight">Divulgação Pública</span>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Mídia Gravada</span>
        </div>

        <div class="relative w-full h-64 rounded-2xl overflow-hidden bg-inverse-surface group mb-space-md shadow-inner flex items-center justify-center">
          <div class="absolute inset-0 bg-cover bg-center" [style.background-image]="'url(' + evidencia().imagem + ')'"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <div class="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-label-sm text-label-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
            <span>{{ evidencia().duracao }}</span>
          </div>
          <div class="absolute top-3 right-3 text-white/90">
            <span class="material-symbols-outlined text-[18px]">volume_up</span>
          </div>

          <button
            type="button"
            aria-label="Reproduzir evidência em vídeo"
            (click)="reproduzindo.set(!reproduzindo())"
            class="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg transition-transform duration-200 group-hover:scale-110 active:scale-95"
          >
            @if (reproduzindo()) {
              <span class="material-symbols-outlined text-[24px]">pause</span>
            } @else {
              <svg class="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            }
          </button>

          <div class="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5 z-10">
            <div class="flex items-center justify-between text-white font-label-sm text-label-sm">
              <div class="flex items-center gap-1 bg-primary text-on-primary px-2 py-0.5 rounded-full shadow-sm">
                <span class="material-symbols-outlined text-[12px]">flag</span>
                <span>Promessa: {{ evidencia().minutoPromessa }}</span>
              </div>
              <span class="opacity-80">Final: {{ evidencia().duracao }}</span>
            </div>
            <div class="w-full h-1.5 bg-white/30 rounded-full overflow-hidden relative">
              <div class="h-full bg-primary-container rounded-full" [style.width.%]="evidencia().percentualLinhaDoTempo"></div>
              <div class="absolute top-0 bottom-0 w-2 bg-tertiary-fixed rounded-full" [style.left.%]="evidencia().percentualLinhaDoTempo"></div>
            </div>
          </div>
        </div>

        <div class="bg-surface-container-low rounded-xl p-space-md relative overflow-hidden">
          <div class="flex items-start gap-2">
            <span class="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">format_quote</span>
            <div class="flex flex-col">
              <p class="font-body-md text-body-md text-on-surface italic font-medium leading-relaxed">{{ evidencia().transcricao }}</p>
              <span class="font-label-sm text-label-sm text-on-surface-variant mt-2 font-medium">{{ evidencia().confiancaTranscricao }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-space-lg pt-space-md flex items-center justify-between">
        <span class="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-semibold">{{ evidencia().midia }}</span>
        <span class="font-body-sm text-body-sm text-on-surface-variant">{{ evidencia().origem }}</span>
      </div>
    </div>
  `,
})
export class CreatorEvidence {
  readonly evidencia = input.required<EvidenciaCreator>();
  readonly reproduzindo = signal(false);
}

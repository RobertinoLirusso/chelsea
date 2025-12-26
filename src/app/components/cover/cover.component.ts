import { Component, AfterViewInit, ViewChild, ElementRef, HostListener, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrl: './cover.component.css'
})
export class CoverComponent implements AfterViewInit, OnDestroy {
  backgroundImage: string = 'assets/img/cover_photo.jpg';

  @ViewChild('backgroundAudio') backgroundAudio!: ElementRef<HTMLAudioElement>;
  private audioStarted = false;
  private audioPausedByVideo = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // Intentar reproducir el audio inmediatamente al cargar la página
    this.tryPlayAudio();

    // Configurar listeners para videos
    this.setupVideoListeners();
  }

  ngOnDestroy(): void {
    // Limpiar event listeners solo si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('play', this.onVideoPlay.bind(this), true);
      document.removeEventListener('ended', this.onVideoEnded.bind(this), true);
      document.removeEventListener('pause', this.onVideoPause.bind(this), true);
    }
  }

  // Escuchar cualquier interacción del usuario para activar el audio (como respaldo)
  @HostListener('document:click', ['$event'])
  @HostListener('document:keydown', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onUserInteraction(event: Event): void {
    // Solo intentar iniciar si no se ha iniciado aún (por si el autoplay fue bloqueado)
    if (!this.audioStarted && !this.audioPausedByVideo) {
      this.tryPlayAudio();
    }
  }

  private tryPlayAudio(): void {
    if (this.backgroundAudio?.nativeElement && typeof this.backgroundAudio.nativeElement.play === 'function') {
      const audio = this.backgroundAudio.nativeElement;

      // Intentar reproducir
      audio.play().then(() => {
        this.audioStarted = true;
        // Quitar mute después de iniciar la reproducción
        setTimeout(() => {
          audio.muted = false;
        }, 100);
      }).catch((error) => {
        console.log('Audio autoplay prevented by browser:', error);
        // Mantener muted si autoplay falla
        audio.muted = true;
      });
    } else {
      console.warn('Background audio element not found or play method not available');
    }
  }

  // Configurar listeners para detectar reproducción de videos
  private setupVideoListeners(): void {
    // Solo configurar listeners si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      // Usar event delegation para escuchar eventos de video
      document.addEventListener('play', this.onVideoPlay.bind(this), true);
      document.addEventListener('ended', this.onVideoEnded.bind(this), true);
      document.addEventListener('pause', this.onVideoPause.bind(this), true);
    }
  }

  // Pausar audio cuando se reproduce un video
  private onVideoPlay(event: Event): void {
    const target = event.target as HTMLVideoElement;
    if (target && target.tagName === 'VIDEO' && this.backgroundAudio?.nativeElement) {
      const audio = this.backgroundAudio.nativeElement;
      if (!audio.paused && !audio.muted) {
        audio.pause();
        this.audioPausedByVideo = true;
      }
    }
  }

  // Reanudar audio cuando termina un video
  private onVideoEnded(event: Event): void {
    const target = event.target as HTMLVideoElement;
    if (target && target.tagName === 'VIDEO' && this.audioPausedByVideo && this.backgroundAudio?.nativeElement) {
      const audio = this.backgroundAudio.nativeElement;
      if (audio.paused) {
        audio.play().catch(error => {
          console.log('Could not resume background audio:', error);
        });
        this.audioPausedByVideo = false;
      }
    }
  }

  // Manejar pausa de video (no reanudar audio automáticamente)
  private onVideoPause(event: Event): void {
    const target = event.target as HTMLVideoElement;
    if (target && target.tagName === 'VIDEO') {
      // No hacer nada, mantener el audio pausado hasta que el video termine
    }
  }

  // Métodos públicos para controlar el audio desde otros componentes
  pauseBackgroundAudio(): void {
    if (this.backgroundAudio?.nativeElement && !this.backgroundAudio.nativeElement.paused) {
      this.backgroundAudio.nativeElement.pause();
    }
  }

  resumeBackgroundAudio(): void {
    if (this.backgroundAudio?.nativeElement && this.backgroundAudio.nativeElement.paused && !this.audioPausedByVideo) {
      this.backgroundAudio.nativeElement.play().catch(error => {
        console.log('Could not resume background audio:', error);
      });
    }
  }
}

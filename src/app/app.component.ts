import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'chelsea';
  @ViewChild('backgroundAudio') backgroundAudio!: ElementRef<HTMLAudioElement>;
  private audioStarted = false;

  ngOnInit(): void {
    // Intentar reproducir el audio después de un pequeño delay
    setTimeout(() => {
      this.tryPlayAudio();
    }, 1000);
  }

  // Escuchar cualquier interacción del usuario para activar el audio
  @HostListener('document:click', ['$event'])
  @HostListener('document:keydown', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onUserInteraction(event: Event): void {
    if (!this.audioStarted && this.backgroundAudio) {
      this.tryPlayAudio();
    }
  }

  private tryPlayAudio(): void {
    if (this.backgroundAudio && this.backgroundAudio.nativeElement) {
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
    }
  }
}

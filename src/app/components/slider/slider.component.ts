import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
declare var bootstrap: any;


interface Match {
  match: string;
  description: string;
  match_image: string;
  match_report: string;
  stage: string;
  goal_video: string;
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent implements OnInit {
  matches: Match[] = [];
  currentIndex: number = 0;
  isLoading: boolean = true;
  hasError: boolean = false;
  finalVideoUrl: string = 'assets/video/drogba_penalty_bayern.mp4'; // Video final global
  isShowingFinalSlide: boolean = false;

  @ViewChild('goalVideo') goalVideoRef!: ElementRef<HTMLVideoElement>;


  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.hasError = false;

    this.http.get<{matches: Match[]}>('assets/json/matches.json').subscribe({
      next: (data) => {
        this.matches = data.matches;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading matches data:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  nextMatch(): void {
    if (this.isShowingFinalSlide) {
      return; // No hacer nada si ya estamos en el slide final
    }
    if (this.currentIndex < this.matches.length - 1) {
      this.currentIndex++;
    } else {
      // Si estamos en el último partido, pasar al slide final
      this.isShowingFinalSlide = true;
    }
  }

  previousMatch(): void {
    if (this.isShowingFinalSlide) {
      // Si estamos en el slide final, volver al último partido
      this.isShowingFinalSlide = false;
      this.currentIndex = this.matches.length - 1;
      return;
    }
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  get currentMatch(): Match | null {
    if (this.isShowingFinalSlide) {
      return null; // No mostrar partido cuando estamos en el slide final
    }
    return this.matches[this.currentIndex] || null;
  }

  playVideo(): void {
    const video = this.goalVideoRef?.nativeElement;
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  }


  onVideoEnded(): void {
    if (this.isShowingFinalSlide) {
      // Si terminó el video final, navegar a la ruta padre
      this.router.navigate(['/']);
      return;
    }

    // Para videos normales, solo cerrar el modal
    const modalEl = document.getElementById('goalModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modal.hide();
    }
  }

}

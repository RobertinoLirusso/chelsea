import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  
  @ViewChild('goalVideo') goalVideoRef!: ElementRef<HTMLVideoElement>;


  constructor(private http: HttpClient,  private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.http.get<Match[]>('assets/json/matches.json').subscribe(data => {
      this.matches = data;
    });
  }

  nextMatch(): void {
    if (this.currentIndex < this.matches.length - 1) {
      this.currentIndex++;
    }
  }

  previousMatch(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  get currentMatch(): Match | null {
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
    const modalEl = document.getElementById('goalModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modal.hide();
    }
  }

}

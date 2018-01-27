import { Component, ElementRef, ViewChild } from '@angular/core';
import { ViewChildren } from '@angular/core/src/metadata/di';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    navigator.getUserMedia({
      audio: true, video: false
    }, media => {
      (this.audio.nativeElement as HTMLAudioElement).srcObject = media;
    }, error => {

    });
  }
  @ViewChild('audioTag') audio: ElementRef;
}

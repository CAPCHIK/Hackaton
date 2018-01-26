import { Component, ViewChild, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Engine, Scene, Vector3, PointLight, HemisphericLight, ArcRotateCamera } from 'babylonjs';
import { CarryScene } from './game/scenes/CarryScene';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canva') canvasEl: ElementRef;


  // Логика клиентской части
  ngOnInit(): void {
    const canvas = this.canvasEl.nativeElement;
    const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine
    // Create the scene space
    const scene = new Scene(engine);
    scene.debugLayer.show();

    //TODO: make scene selection
    const currentScene = new CarryScene(scene);
    
    currentScene.onStart();

    engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
      currentScene.preUpdate();

      currentScene.onGui();
      currentScene.onUpdate();
      currentScene.onDraw();
    });

    window.addEventListener('resize', function () { // Watch for browser/canvas resize events
      engine.resize();
      currentScene.onResize();
    });
  }

}

/* Babylon.js ARToolKit integration */

(function() {
	var integrate = function() {

		ARController.getUserMediaBabylonScene = function(configuration) {
			var obj = {};
			for (var i in configuration) {
				obj[i] = configuration[i];
			}
			var onSuccess = configuration.onSuccess;

			obj.onSuccess = function(arController, arCameraParam) {
				var scenes = arController.createBabylonScene();
				onSuccess(scenes, arController, arCameraParam);
			};

			var video = this.getUserMediaARController(obj);
			return video;
		};
		
		ARController.prototype.createBabylonScene = function(video) {
			video = video || this.image;

			this.setupBabylon();

			var engine = new BABYLON.Engine(window.canvas, true);
            engine.setSize(video.width, video.height);
			
			var scene = new BABYLON.Scene(engine);
            scene.useRightHandedSystem = true;

            camera = new BABYLON.Camera('camera1', new BABYLON.Vector3(0, 0, 0), scene);      		
			camera.freezeProjectionMatrix(BABYLON.Matrix.FromArray(this.getCameraMatrix()));
			window.camera = camera;	

			var videoScene = new BABYLON.Layer("back", null, scene);
			videoScene.texture = new BABYLON.VideoTexture("video", video, scene, false);
			videoScene.isBackground = true;
			videoScene.texture.level = 0;

			if (this.orientation === 'portrait') {
				videoScene.rotation.z = Math.PI/2;
			}
	
			var self = this;

			return {
				scene: scene,
				videoScene: videoScene,
				camera: camera,

				arController: this,

				video: video,

				process: function() {
					for (var i in self.BabylonPatternMarkers) {
						self.BabylonPatternMarkers[i].visible = false;
						self.BabylonPatternMarkers[i].getChildMeshes().forEach(function (mesh) {
							mesh.isVisible = false;
						});						
					}
					for (var i in self.BabylonNFTMarkers) {
						self.BabylonNFTMarkers[i].visible = false;
						self.BabylonNFTMarkers[i].getChildMeshes().forEach(function (mesh) {
							mesh.isVisible = false;
						});
					}
					for (var i in self.BabylonBarcodeMarkers) {
						self.BabylonBarcodeMarkers[i].visible = false;
						self.BabylonBarcodeMarkers[i].getChildMeshes().forEach(function (mesh) {
							mesh.isVisible = false;
						});							
					}
					for (var i in self.BabylonMultiMarkers) {
						self.BabylonMultiMarkers[i].visible = false;
						for (var j=0; j<self.BabylonMultiMarkers[i].markers.length; j++) {
							if (self.BabylonMultiMarkers[i].markers[j]) {
								self.BabylonMultiMarkers[i].markers[j].visible = false;
								self.BabylonMultiMarkers[i].markers[j].getChildMeshes().forEach(function (mesh) {
									mesh.isVisible = false;
								});									
							}
						}
					}
					self.process(video);
				}
			};
		};

		ARController.prototype.createBabylonMarker = function(markerUID, arScene, markerWidth) {
			this.setupBabylon();
			var obj = new BABYLON.AbstractMesh('markerRoot', arScene);
			obj.markerTracker = this.trackPatternMarkerId(markerUID, markerWidth);
			this.BabylonPatternMarkers[markerUID] = obj;
			return obj;
		};

		ARController.prototype.createBabylonNFTMarker = function(markerUID, arScene, markerWidth) {
			this.setupBabylon();
			var obj = new BABYLON.AbstractMesh('markerRoot', arScene);
			obj.markerTracker = this.trackNFTMarkerId(markerUID, markerWidth);
			//obj.freezeWorldMatrix();
			this.BabylonNFTMarkers[markerUID] = obj;
			return obj;
		};

		ARController.prototype.createBabylonMultiMarker = function(markerUID, arScene) {
			this.setupBabylon();
			var obj = new BABYLON.AbstractMesh('markerRoot', arScene);
			obj.markers = [];
			this.BabylonMultiMarkers[markerUID] = obj;
			return obj;
		};

		ARController.prototype.createBabylonBarcodeMarker = function(markerUID, arScene, markerWidth) {
			this.setupBabylon();
			var obj = new BABYLON.AbstractMesh('markerRoot', arScene);
			obj.markerTracker = this.trackBarcodeMarkerId(markerUID, markerWidth);
			this.BabylonBarcodeMarkers[markerUID] = obj;
			return obj;
		};

		ARController.prototype.setupBabylon = function() {
			if (this.Babylon_JS_ENABLED) {
				return;
			}
			this.Babylon_JS_ENABLED = true;

			/*
				Listen to getMarker events to keep track of Babylon.js markers.
			*/
			this.addEventListener('getMarker', function(ev) {
				var marker = ev.data.marker;
				var obj;
				if (ev.data.type === artoolkit.PATTERN_MARKER) {
					obj = this.BabylonPatternMarkers[ev.data.marker.idPatt];

				} else if (ev.data.type === artoolkit.BARCODE_MARKER) {
					obj = this.BabylonBarcodeMarkers[ev.data.marker.idMatrix];
				}
				if (obj) {
					obj._worldMatrix.m = ev.data.matrix;
					obj.visible = true;
					obj.getChildMeshes().forEach(function (mesh) {
						mesh.isVisible = true;
					});
				}
			});

			/*
				Listen to getNFTMarker events to keep track of Babylon.js markers.
			*/
			this.addEventListener('getNFTMarker', function(ev) {
				var marker = ev.data.marker;
				var obj = this.BabylonNFTMarkers[ev.data.marker.id];
				if (obj) {
					obj._worldMatrix.m = ev.data.matrix;
					obj.visible = true;
					obj.getChildMeshes().forEach(function (mesh) {
							mesh.isVisible = true;
					});
				}
			});

			/*
				Listen to getMultiMarker events to keep track of Babylon.js multimarkers.
			*/
			this.addEventListener('getMultiMarker', function(ev) {
				var obj = this.BabylonMultiMarkers[ev.data.multiMarkerId];
				if (obj) {
					obj._worldMatrix.m = ev.data.matrix;
					obj.visible = true;
					obj.getChildMeshes().forEach(function (mesh) {
							mesh.isVisible = true;
					});					
				}
			});

			/*
				Listen to getMultiMarkerSub events to keep track of Babylon.js multimarker submarkers.
			*/
			this.addEventListener('getMultiMarkerSub', function(ev) {
				var marker = ev.data.multiMarkerId;
				var subMarkerID = ev.data.markerIndex;
				var subMarker = ev.data.marker;
				var obj = this.BabylonMultiMarkers[marker];
				if (obj && obj.markers && obj.markers[subMarkerID]) {
					var sub = obj.markers[subMarkerID];
					sub._worldMatrix.m = ev.data.matrix;
					sub.visible = (subMarker.visible >= 0);
				}
			});

			this.BabylonPatternMarkers = {};

			this.BabylonNFTMarkers = {};

			this.BabylonBarcodeMarkers = {};

			this.BabylonMultiMarkers = {};
		};

	};

	var tick = function() {
		if (window.ARController) {
			integrate();
			if (window.ARBabylonOnLoad) {
				window.ARBabylonOnLoad();
			}
		} else {
			setTimeout(tick, 50);
		}			
	};

	tick();

})();

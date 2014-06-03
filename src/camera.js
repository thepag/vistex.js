/*
 * The Vistex Library - Camera Module for Kernel
 * http://www.happyworm.com
 *
 * Copyright (c) 2014 Mark J Panaghiston
 * Licensed under the MIT license.
 * https://github.com/thepag/vistex.js/blob/master/LICENSE
 *
 * Author: Mark J Panaghiston
 * Version: 0.1.0
 * Date: 3rd June 2014
 */

(function(Kernel) {

	Kernel.module.define('Camera', {

		updateId: null,
		init: function(options) {
			// The default options
			this.options = {
				id: '', // The id of messages being broadcast.
				target: '#camera',
				audio: false,
				video: true,
				width: 400,
				height: 300,
				fps: 15,
				open: true,
				run: true
			};
			// Read in instancing options.
			for(var option in options) {
				if(options.hasOwnProperty(option)) {
					this.options[option] = options[option];
				}
			}
			this.target = typeof this.options.target === 'string' ? document.querySelector(this.options.target) : this.options.target;

			navigator.getUserMedia = navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia;

			if(this.options.open) {
				this.open();
			}
		},
		broadcast: function(type) {
			// Broadcast the message
			this.hub.broadcast(type, {
				id: this.options.id,
				target: this,
				msg: 'Generated by: Camera'
			});
		},
		open: function() {
			var self = this;
			navigator.getUserMedia({
				audio: self.options.audio,
				video: self.options.video
			}, function(stream) {
				self.stream = stream;
				self.success(stream);
				self.broadcast("camera-open");
			}, function(error) {
				self.error = error;
				self.broadcast("camera-error");
			});
		},
		success: function(stream) {
			var self = this;
			if(this.target && this.options.video) {
				this.videoElem = document.createElement('video');
				this.videoElem.src = window.URL.createObjectURL(stream);
				this.videoElem.setAttribute("width", this.options.width);
				this.videoElem.setAttribute("height", this.options.height);
				this.videoElem.play();
				// this.target.appendChild(this.videoElem);

				this.cameraCanvas = document.createElement("canvas");
				this.cameraCanvas.setAttribute("width", this.options.width);
				this.cameraCanvas.setAttribute("height", this.options.height);
				this.cameraCanvas.className = 'camera';
				this.cameraContext = this.cameraCanvas.getContext("2d");

				this.overlayCanvas = document.createElement("canvas");
				this.overlayCanvas.setAttribute("width", this.options.width);
				this.overlayCanvas.setAttribute("height", this.options.height);
				this.overlayCanvas.className = 'overlay';
				this.overlayContext = this.overlayCanvas.getContext("2d");

				this.target.appendChild(this.cameraCanvas);
				this.target.appendChild(this.overlayCanvas);

				if(this.options.run) {
					self.update();
				}
			}
		},
		update: function() {
			var self = this;
			// try/catch since video is not available at the start and no (known) other way to test.
			try {
				// Copy video to canvas
				this.cameraContext.drawImage(this.videoElem, 0, 0, this.options.width, this.options.height);
			} catch(err) {}

			clearTimeout(this.updateId);
			this.updateId = setTimeout(function() {
				self.update();
			}, 1000 / this.options.fps);

			this.broadcast("camera-update");
		}
	});

}(Kernel));

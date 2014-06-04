/*
 * The Vistex Library - Motion Module for Kernel
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

	Kernel.module.define('Motion', {

		init: function(options) {
			// The default options
			this.options = {
				id: '', // The id of messages being broadcast.
				target: '#motion',
				width: 400,
				height: 300,
				threshold_pixel: 40 // Out of 255
			};
			// Read in instancing options.
			for(var option in options) {
				if(options.hasOwnProperty(option)) {
					this.options[option] = options[option];
				}
			}
			this.target = typeof this.options.target === 'string' ? document.querySelector(this.options.target) : this.options.target;

			this.firstTime = true;

			this.previousData = null;
			this.currentData = null;
			this.outputData = null;

			this.initCanvas();
			this.start();
		},
		broadcast: function(type, event) {
			// Broadcast the message
			this.hub.broadcast(type, {
				id: this.options.id,
				target: this,
				event: event,
				msg: 'Generated by: Motion'
			});
		},
		initCanvas: function() {
			this.motionCanvas = document.createElement("canvas");
			this.motionCanvas.setAttribute("width", this.options.width);
			this.motionCanvas.setAttribute("height", this.options.height);
			this.motionCanvas.className = 'motion';
			this.motionContext = this.motionCanvas.getContext("2d");

			this.target.appendChild(this.motionCanvas);
		},
		start: function() {
			var self = this;

			var measure = function(diff) {
				var fired = 255;
				if(diff > self.options.threshold_pixel) {
					return fired;
				} else if(diff < -self.options.threshold_pixel) {
					return fired;
				} else {
					return 0;
				}
			};

			this.hub.listen('camera-update', function(data) {
				var media = data.target;
				self.previousData = self.currentData;
				self.currentData = data.target.cameraContext.getImageData(0, 0, data.target.options.width, data.target.options.height);
				if(self.firstTime) {
					self.firstTime = false;
				} else {
					self.outputData = self.motionContext.createImageData(self.currentData.width, self.currentData.height);
					self.motionSum = {
						red:0,
						green:0,
						blue:0
					};
					for(var i = 0, iLen = self.currentData.data.length; i < iLen; i+=4) {
						var rDiff = measure(self.currentData.data[i] - self.previousData.data[i]);
						var gDiff = measure(self.currentData.data[i+1] - self.previousData.data[i+1]);
						var bDiff = measure(self.currentData.data[i+2] - self.previousData.data[i+2]);
						var aDiff = measure(self.currentData.data[i+3] - self.previousData.data[i+3]);

						self.outputData.data[i] = rDiff;
						self.outputData.data[i+1] = gDiff;
						self.outputData.data[i+2] = bDiff;

						self.motionSum.red += rDiff;
						self.motionSum.green += gDiff;
						self.motionSum.blue += bDiff;

						if(rDiff || gDiff || bDiff) {
							self.outputData.data[i+3] = 255;
						} else {
							self.outputData.data[i+3] = 0;
						}
					}
					var factorToRatio = 4 / self.currentData.data.length / 255;
					self.motionAvg = {
						red: self.motionSum.red * factorToRatio,
						green: self.motionSum.green * factorToRatio,
						blue: self.motionSum.blue * factorToRatio
					};
					self.motion = (self.motionAvg.red + self.motionAvg.green + self.motionAvg.blue) / 3;
					self.motionContext.putImageData(self.outputData, 0, 0);

					if(self.motion > self.options.threshold) {
						self.broadcast('motion');
					}
				}
			});
		}
	});

}(Kernel));
/*
 * The Vistex Library - Kernel Main Hub
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

	// Define the main Hub - NOTE: 'main' is the default hub used if not otherwise specified in Kernel.start()
	Kernel.hub.define('main', {

/*
		// Expose ajax capabilities to modules as well - you could potentially abstract this level even further
		request: function(config) {
			Kernel.request(config);
		},
		
		refreshStatusFeed: function() {
			
			var self = this;
			
			self.request({
				type: 'GET',
				url: 'feed',
				success: function(data) {
					self.broadcast('status-feed-update', data)
				},
				failure: function(er) {
					
					// NOTE: No module in this example listens for error messages to errors will go unnoticed
					self.broadcast('error', "Couldn't fetch the feed: "+er);
				}
			});
		},
		
		updateStatus: function(status) {
			
			var self = this;
			
			self.request({
				type: 'POST',
				url: 'status',
				params: { newstatus: status },
				success: function(data) {
					
					// Let everyone know that you updated your status
					self.broadcast('status-update', status);
					
					// Also update the feed
					self.refreshStatusFeed();
				},
				failure: function(er) {
					self.broadcast('error', "Couldn't update the status: "+er);
				}
			});
		}
*/	
	});

}(Kernel));

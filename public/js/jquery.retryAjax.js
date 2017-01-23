function AjaxRetry (settings, maxTries, interval) {
  var self = this;
  this.settings = settings;
  this.maxTries = typeof maxTries === 'number' ? maxTries : 0;
  this.completedTries = 0;
  this.interval = typeof interval === 'number' ? interval : 0;

  // Return a promise, so that you can chain methods
  // as you would with regular jQuery ajax calls
  return tryAjax().promise();

  function tryAjax (deferred) {
    console.log('Trying ajax #' + (self.completedTries + 1));
    var d = deferred || $.Deferred();
    $.ajax(self.settings)
    .done(function (data) {
      // If it succeeds, don't keep retrying
      d.resolve(data);
    })
    .fail(function (error) {
      self.completedTries++;

      // Recursively call this function again (after a timeout)
      // until either it succeeds or we hit the max number of tries
      if (self.completedTries < self.maxTries) {
        console.log('Waiting ' + interval + 'ms before retrying...');
        setTimeout(function () {
          tryAjax(d);
        }, self.interval);
      } else {
        d.reject(error);
      }
    });
    return d;
  }
}

'use strict';

define(function() {
  var cbName = 'cb';

  var load = function(url, callback) {
    
    window[cbName] = function(data) {
      callback(data);
    };
    var script = document.createElement('script');
    script.src = url + '?callback=' + cbName;
    document.body.appendChild(script);
  };
  return load;
  console.log(load);
});
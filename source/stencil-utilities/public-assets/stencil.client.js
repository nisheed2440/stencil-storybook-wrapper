/**
 * The vanilla JS to check if dom is loaded.
 * @param {function} fn Callback function
 */
function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading') fn();
    });
  }
}

/**
 * Function to get the websocket client.
 * @param {string} protocol The stencil server protocol
 * @param {string} hostname The stencil server hostname
 * @param {number|string} port The stencil server port
 */
function getSocketUrl(protocol, hostname, port) {
  return (protocol === 'https:' ? 'wss:' : 'ws:') + '//' + hostname + ':' + port + '/';
}

// test
window.ready(function() {
  var wsUrl = getSocketUrl(
    window.STENCIL_DEV_PROTOCOL,
    window.STENCIL_DEV_HOST,
    window.STENCIL_DEV_PORT,
  );
  // have the browser open a web socket with the server
  clientWs = new window.WebSocket(wsUrl, ['xmpp']);
  // add all our event listeners to our new web socket
  clientWs.addEventListener('open', function() {
    console.log('open', this);
  });
  clientWs.addEventListener('error', function() {
    console.log('error', this);
  });
  clientWs.addEventListener('close', function() {
    console.log('close', this);
  });
  clientWs.addEventListener('message', function(event) {
    var data = JSON.parse(event.data);
    if (data.buildResults) {
      // Show error modal
      return;
    }
    console.log('message', data);
  });
});

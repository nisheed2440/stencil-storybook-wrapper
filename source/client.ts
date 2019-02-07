import {
  DEV_SERVER_MODAL,
  NORMAL_CLOSURE_CODE,
  RECONNECT_ATTEMPTS,
  RECONNECT_RETRY_MS,
} from './client-utils/client-constants';

import {
  logWarn,
  logReload,
  logDisabled,
  getSocketUrl,
  ready,
  updateBuildStatus,
  appError,
} from './client-utils/client-utilities';

import './client.less';

/**
 * Remove the error modal
 * @param doc the document object
 */
function clearDevServerModal(doc) {
  var appErrorElm = doc.getElementById(DEV_SERVER_MODAL);
  if (appErrorElm) {
    appErrorElm.parentNode.removeChild(appErrorElm);
  }
}

function appUpdate(win, doc, buildResults) {
  try {
    // remove any app errors that may already be showing
    clearDevServerModal(doc);
    if (buildResults.hasError) {
      // looks like we've got an error
      // let's show the error all pretty like
      appError(doc, buildResults);
      return;
    }
    if (buildResults.hmr) {
      logReload('Reloading due to changes in Stencil!!');
      win.location.reload(true);
      return;
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Initialize websocket to connect to stencil server
 * @param win The window object
 * @param doc The document object
 */
function initClientWebSocket(win, doc) {
  // Websocket url to test
  let wsUrl: string = getSocketUrl(
    win.STENCIL_DEV_PROTOCOL,
    win.STENCIL_DEV_HOST,
    win.STENCIL_DEV_PORT,
  );
  // Websocket instance
  let clientWs: any;
  // Websocket reconnection timer
  let reconnectTmrId: any;
  // Websocket reconnection attempts
  let reconnectAttempts: number = 0;

  let requestBuildResultsTmrId: any;
  let hasGottenBuildResults: boolean = false;

  /**
   * Function callback on socket open event
   */
  function onOpen() {
    var _this = this;
    if (reconnectAttempts > 0) {
      // we just reconnected
      // we'll request the build results and wait on its response
      updateBuildStatus(doc, 'pending');
    }
    if (!hasGottenBuildResults) {
      requestBuildResultsTmrId = setInterval(function() {
        if (!hasGottenBuildResults && _this.readyState === win.WebSocket.OPEN) {
          var msg = {
            requestBuildResults: true,
          };
          _this.send(JSON.stringify(msg));
        } else {
          clearInterval(requestBuildResultsTmrId);
        }
      }, 1000);
    }
    // we just connected, let's just
    // double check we don't have a reconnect queued
    clearTimeout(reconnectTmrId);
  }
  function onError() {
    // looks like we can't connect to the server
    // let's give it another shot in a few seconds
    queueReconnect();
  }
  function onClose(event) {
    updateBuildStatus(doc, 'disabled');
    if (event.code > NORMAL_CLOSURE_CODE) {
      // the browser's web socket has closed w/ an unexpected code
      logWarn('Dev Server', 'web socket closed: ' + event.code + ' ' + event.reason);
    } else {
      logDisabled('Dev Server', 'Disconnected, attempting to reconnect...');
    }
    // web socket closed, let's try to reconnect
    queueReconnect();
  }
  function onMessage(event) {
    // the browser's web socket received a message from the server
    var msg = JSON.parse(event.data);
    if (reconnectAttempts > 0) {
      // we got a message and we know we've been trying to reconnect
      if (msg.isActivelyBuilding) {
        // looks like there's still an active build
        return;
      }
      if (msg.buildResults) {
        // this is from a reconnect, and we were just notified w/ build results
        // so it's probably best if we do a full page refresh
        logReload('Reconnected to dev server');
        hasGottenBuildResults = true;
        clearInterval(requestBuildResultsTmrId);
        win.location.reload(true);
        return;
      }
    }
    if (msg.buildLog) {
      var statusMsg = new win.CustomEvent('buildLog', { detail: msg.buildLog });
      win.dispatchEvent(statusMsg);
      updateBuildStatus(doc, 'pending');
      return;
    }
    if (msg.buildResults) {
      // we just got build results from the server
      // let's update our app with the data received
      hasGottenBuildResults = true;
      clearInterval(requestBuildResultsTmrId);
      updateBuildStatus(doc, 'default');
      appUpdate(win, doc, msg.buildResults);
      return;
    }
  }
  function connect() {
    // ensure we don't have a reconnect timeout running
    clearTimeout(reconnectTmrId);
    // have the browser open a web socket with the server
    clientWs = new win.WebSocket(wsUrl, ['xmpp']);
    // add all our event listeners to our new web socket
    clientWs.addEventListener('open', onOpen);
    clientWs.addEventListener('error', onError);
    clientWs.addEventListener('close', onClose);
    clientWs.addEventListener('message', onMessage);
  }
  function queueReconnect() {
    // either it closed or was a connection error
    hasGottenBuildResults = false;
    // let's clear out the existing web socket
    if (clientWs) {
      if (
        clientWs.readyState === win.WebSocket.OPEN ||
        clientWs.readyState === win.WebSocket.CONNECTING
      ) {
        // probably fine as is, but let's double check we're closed out
        clientWs.close(NORMAL_CLOSURE_CODE);
      }
      // let's remove all the existing event listeners
      clientWs.removeEventListener('open', onOpen);
      clientWs.removeEventListener('error', onError);
      clientWs.removeEventListener('close', onClose);
      clientWs.removeEventListener('message', onMessage);
      clientWs = null;
    }
    // ensure clear out any other pending reconnect timeouts
    clearTimeout(reconnectTmrId);
    if (reconnectAttempts > RECONNECT_ATTEMPTS) {
      logWarn('Dev Server', 'Canceling reconnect attempts');
    } else {
      // keep track how many times we tried to reconnect
      reconnectAttempts++;
      // queue up a reconnect in a few seconds
      reconnectTmrId = setTimeout(connect, RECONNECT_RETRY_MS);
      updateBuildStatus(doc, 'disabled');
    }
  }
  // let's do this!
  // try to connect up with our web socket server
  connect();
}

// Custom window ready function
window['ready'] = ready;
window['ready'](function() {
  initClientWebSocket(window, document);
});

import { BLUE, GRAY, RED, YELLOW, DEV_SERVER_MODAL, DEV_SERVER_PREFIX } from './client-constants';

/**
 * The vanilla JS to check if dom is loaded.
 * @param {function} fn Callback function
 */
export function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document['attachEvent']('onreadystatechange', function() {
      if (document.readyState != 'loading') fn();
    });
  }
}

/**
 * Log build message styles
 * @param msg The message to be shown
 */
export function logBuild(msg) {
  log(BLUE, 'Build', msg);
}
/**
 * Log reload message
 * @param msg The message to be shown
 */
export function logReload(msg) {
  logWarn('Reload', msg);
}
/**
 * Log warning message style
 * @param prefix The message prefeix
 * @param msg The message to be shown
 */
export function logWarn(prefix, msg) {
  log(YELLOW, prefix, msg);
}
/**
 * Log disabled message style
 * @param prefix The message prefix
 * @param msg The message to be shown
 */
export function logDisabled(prefix, msg) {
  log(GRAY, prefix, msg);
}
/**
 * Log the diagnostic data to the console
 * @param diagnostic The diagnostic object returned by the websocket
 */
export function logDiagnostic(diagnostic) {
  let color = RED;
  let prefix = 'Error';
  if (diagnostic.level === 'warn') {
    color = YELLOW;
    prefix = 'Warning';
  }
  if (diagnostic.header) {
    prefix = diagnostic.header;
  }
  let msg = '';
  if (diagnostic.relFilePath) {
    msg += diagnostic.relFilePath;
    if (typeof diagnostic.lineNumber === 'number' && diagnostic.lineNumber > 0) {
      msg += ', line ' + diagnostic.lineNumber;
      if (typeof diagnostic.columnNumber === 'number' && diagnostic.columnNumber > 0) {
        msg += ', column ' + diagnostic.columnNumber;
      }
    }
    msg += '\n';
  }
  msg += diagnostic.messageText;
  log(color, prefix, msg);
}
/**
 * Base logger function to display data in the console
 * @param color The message intesity color
 * @param prefix The message prefix
 * @param msg The message to be shown
 */
export function log(color, prefix, msg) {
  const styledPrefix = [
    '%c' + prefix,
    'background: ' +
      color +
      '; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;',
  ];
  console.log.apply(console, styledPrefix.concat([msg]));
}

/**
 * Function to get the websocket client.
 * @param {string} protocol The stencil server protocol
 * @param {string} hostname The stencil server hostname
 * @param {number|string} port The stencil server port
 */
export function getSocketUrl(protocol, hostname, port) {
  return (protocol === 'https:' ? 'wss:' : 'ws:') + '//' + hostname + ':' + port + '/';
}

/**
 * Function to notify developer about any build
 * @param doc The document object
 * @param status The build status
 */
export function updateBuildStatus(doc, status) {
  // @TODO:Update the dom to reflect different build statuses
  // -----
}
/**
 * Return the diagnostic modal adding styles to it
 * @param doc The document object
 */
export function getDevServerModal(doc) {
  var outer = doc.getElementById(DEV_SERVER_MODAL);
  if (!outer) {
    outer = doc.createElement('div');
    outer.id = DEV_SERVER_MODAL;
    doc.body.appendChild(outer);
  }
  outer.innerHTML = `
    <style>
        #${DEV_SERVER_MODAL} {
            display: none;
        }
    </style>
    <link href="/stencil.client.css" rel="stylesheet">
    <div id="${DEV_SERVER_MODAL}-inner"></div>
  `;
  return doc.getElementById(`${DEV_SERVER_MODAL}-inner`);
}

/**
 * Escape potentially unsafe html before setting innerHTML on DOM node
 * @param unsafe The unsafe html string to parse
 */
function escapeHtml(unsafe) {
  if (typeof unsafe === 'number' || typeof unsafe === 'boolean') {
    return unsafe.toString();
  }
  if (typeof unsafe === 'string') {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  return '';
}

/**
 * Titlecase the input string
 * @param str The string to convert
 */
function titleCase(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

/**
 * Highlight the input string
 * @param text The text to be checked
 * @param errorCharStart Location to highlight from
 * @param errorLength Length to highlight to
 */
function highlightError(text, errorCharStart, errorLength) {
  if (typeof text !== 'string') {
    return '';
  }
  var errorCharEnd = errorCharStart + errorLength;
  return text
    .split('')
    .map(function(inputChar, charIndex) {
      var outputChar;
      if (inputChar === '<') {
        outputChar = '&lt;';
      } else if (inputChar === '>') {
        outputChar = '&gt;';
      } else if (inputChar === '"') {
        outputChar = '&quot;';
      } else if (inputChar === "'") {
        outputChar = '&#039;';
      } else if (inputChar === '&') {
        outputChar = '&amp;';
      } else {
        outputChar = inputChar;
      }
      if (charIndex >= errorCharStart && charIndex < errorCharEnd) {
        outputChar = `<span class="${DEV_SERVER_PREFIX}-server-diagnostic-error-chr">${outputChar}</span>`;
      }
      return outputChar;
    })
    .join('');
}
/**
 * Prepare error lines for rendering
 * @param orgLines The error lines to be display
 */
function prepareLines(orgLines) {
  var lines = JSON.parse(JSON.stringify(orgLines));
  for (var i = 0; i < 100; i++) {
    if (!eachLineHasLeadingWhitespace(lines)) {
      return lines;
    }
    for (var i_1 = 0; i_1 < lines.length; i_1++) {
      lines[i_1].text = lines[i_1].text.substr(1);
      lines[i_1].errorCharStart--;
      if (!lines[i_1].text.length) {
        return lines;
      }
    }
  }
  return lines;
}
/**
 * Check if the error messages have white spaces
 * @param lines The error string to check
 */
function eachLineHasLeadingWhitespace(lines) {
  if (!lines.length) {
    return false;
  }
  for (var i = 0; i < lines.length; i++) {
    if (!lines[i].text || lines[i].text.length < 1) {
      return false;
    }
    var firstChar = lines[i].text.charAt(0);
    if (firstChar !== ' ' && firstChar !== '\t') {
      return false;
    }
  }
  return true;
}
/**
 * Update the diagnostic modal
 * @param doc The document object
 * @param modal The modal element
 * @param diagnostic The diagnostic object from the websocket
 */
export function appendDiagnostic(doc, modal, diagnostic) {
  var card = doc.createElement('div');
  card.className = `${DEV_SERVER_PREFIX}-server-diagnostic`;
  var masthead = doc.createElement('div');
  masthead.className = `${DEV_SERVER_PREFIX}-server-diagnostic-masthead`;
  masthead.title = escapeHtml(diagnostic.type) + ' error: ' + escapeHtml(diagnostic.code);
  card.appendChild(masthead);
  var title = doc.createElement('div');
  title.className = `${DEV_SERVER_PREFIX}-server-diagnostic-title`;
  title.textContent = titleCase(diagnostic.type) + ' ' + titleCase(diagnostic.level);
  masthead.appendChild(title);
  var message = doc.createElement('div');
  message.className = `${DEV_SERVER_PREFIX}-server-diagnostic-message`;
  message.textContent = diagnostic.messageText;
  masthead.appendChild(message);
  var file = doc.createElement('div');
  file.className = `${DEV_SERVER_PREFIX}-server-diagnostic-file`;
  card.appendChild(file);
  if (diagnostic.relFilePath) {
    var fileHeader = doc.createElement('div');
    fileHeader.className = `${DEV_SERVER_PREFIX}-server-diagnostic-file-header`;
    if (diagnostic.absFilePath) {
      fileHeader.title = escapeHtml(diagnostic.absFilePath);
    }
    var parts = diagnostic.relFilePath.split('/');
    var fileName = doc.createElement('span');
    fileName.className = `${DEV_SERVER_PREFIX}-server-diagnostic-file-name`;
    fileName.textContent = parts.pop();
    var filePath = doc.createElement('span');
    filePath.className = `${DEV_SERVER_PREFIX}-server-diagnostic-file-path`;
    filePath.textContent = parts.join('/') + '/';
    fileHeader.appendChild(filePath);
    fileHeader.appendChild(fileName);
    file.appendChild(fileHeader);
  }
  if (diagnostic.lines && diagnostic.lines.length > 0) {
    var blob = doc.createElement('div');
    blob.className = `${DEV_SERVER_PREFIX}-server-diagnostic-blob`;
    file.appendChild(blob);
    var table_1 = doc.createElement('table');
    table_1.className = `${DEV_SERVER_PREFIX}-server-diagnostic-table`;
    blob.appendChild(table_1);
    prepareLines(diagnostic.lines).forEach(function(l) {
      var tr = doc.createElement('tr');
      if (l.errorCharStart > -1) {
        tr.className = `${DEV_SERVER_PREFIX}-server-diagnostic-error-line`;
      }
      table_1.appendChild(tr);
      var tdNum = doc.createElement('td');
      tdNum.className = `${DEV_SERVER_PREFIX}-server-diagnostic-blob-num`;
      tdNum.setAttribute('data-line-number', l.lineNumber + '');
      tr.appendChild(tdNum);
      var tdCode = doc.createElement('td');
      tdCode.className = `${DEV_SERVER_PREFIX}-server-diagnostic-blob-code`;
      tdCode.innerHTML = highlightError(l.text, l.errorCharStart, l.errorLength);
      tr.appendChild(tdCode);
    });
  }
  modal.appendChild(card);
}

/**
 * Show app error
 * @param win The window object
 * @param doc The document object
 * @param buildResults The build results Object
 */
export function appError(doc, buildResults) {
  if (!Array.isArray(buildResults.diagnostics)) {
    return;
  }
  var diagnostics = buildResults.diagnostics.filter(function(diagnostic) {
    return diagnostic.level === 'error';
  });
  if (diagnostics.length === 0) {
    return;
  }
  var modal = getDevServerModal(doc);
  diagnostics.forEach(function(diagnostic) {
    logDiagnostic(diagnostic);
    appendDiagnostic(doc, modal, diagnostic);
  });
  updateBuildStatus(doc, 'error');
}

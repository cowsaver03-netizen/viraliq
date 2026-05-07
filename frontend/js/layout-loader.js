(function(){
  'use strict';

  function loadSync(url){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    try {
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        return xhr.responseText;
      }
    } catch (e) {}
    console.warn('[layout-loader] Failed to load include:', url);
    return '';
  }

  function applyIncludes(){
    var headerNodes = document.querySelectorAll('[data-include="header"]');
    var footerNodes = document.querySelectorAll('[data-include="footer"]');

    for (var i = 0; i < headerNodes.length; i++) {
      var node = headerNodes[i];
      var variant = (node.getAttribute('data-header-variant') || '').toLowerCase();
      var url = variant === 'home' ? 'includes/header-home.html' : 'includes/header-inner.html';
      node.innerHTML = loadSync(url);
    }

    for (var j = 0; j < footerNodes.length; j++) {
      footerNodes[j].innerHTML = loadSync('includes/footer.html');
    }
  }

  // Run immediately so legacy header scripts bind to injected elements.
  applyIncludes();
})();

/**
 * GitHub Pages SPA deep-link shim (runs from 404.html).
 *
 * Pages serves static files and has no rewrite rules, so a direct request to
 * /fahmida_protofolio/career returns 404.html instead of index.html. This
 * encodes the requested path into a query string and bounces to the app root;
 * src/spaRestore.js unpacks it before the router mounts.
 *
 *   /fahmida_protofolio/career  ->  /fahmida_protofolio/?/career
 */
(function () {
  var BASE = '/fahmida_protofolio/';
  var l = window.location;

  var path = l.pathname.indexOf(BASE) === 0 ? l.pathname.slice(BASE.length) : '';

  l.replace(
    l.origin +
      BASE +
      '?/' +
      path.replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
  );
})();

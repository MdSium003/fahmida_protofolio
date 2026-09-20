/**
 * Counterpart to public/spa-redirect.js.
 *
 * A deep link that GitHub Pages could not serve arrives here as
 * `/fahmida_protofolio/?/career`. Rewrite it back to the real path with
 * history.replaceState so React Router sees the route the visitor asked for,
 * and so the address bar never shows the `?/` encoding.
 *
 * Must run before the router mounts — main.jsx imports it first, ahead of App.
 */
const { search } = window.location;

if (search.startsWith('?/')) {
  const decoded = search
    .slice(2)
    .split('&')
    .map((part) => part.replace(/~and~/g, '&'))
    .join('?');

  window.history.replaceState(
    null,
    '',
    window.location.pathname.replace(/\/$/, '') + '/' + decoded + window.location.hash
  );
}

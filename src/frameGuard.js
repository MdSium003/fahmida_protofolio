/**
 * Clickjacking guard.
 *
 * GitHub Pages serves static files only and cannot send response headers, so
 * `X-Frame-Options` is unavailable and CSP's `frame-ancestors` is ignored when
 * the policy arrives via <meta>. This break-out script is the remaining option.
 *
 * If the document finds itself framed by a different origin, it navigates the
 * top-level window to itself. Accessing `top.location` cross-origin throws,
 * which is itself the signal that the framing is cross-origin.
 */
if (window.self !== window.top) {
  let sameOrigin = false;
  try {
    sameOrigin = window.top.location.origin === window.location.origin;
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin) {
    window.top.location = window.location.href;
  }
}

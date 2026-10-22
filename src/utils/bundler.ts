export function bundleCode(html: string, css: string, js: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    /* Reset & Base Canvas Styling */
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100%;
      background-color: #ffffff;
      color: #000000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    // Intercept client console logs for debugging inside the app
    (function() {
      const origLog = console.log;
      const origError = console.error;
      const origWarn = console.warn;

      console.log = function(...args) {
        origLog.apply(console, args);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', data: args.join(' ') }));
        }
      };

      console.error = function(...args) {
        origError.apply(console, args);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', data: args.join(' ') }));
        }
      };

      console.warn = function(...args) {
        origWarn.apply(console, args);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'warn', data: args.join(' ') }));
        }
      };

      window.onerror = function(msg, url, line) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', data: msg + ' (Line: ' + line + ')' }));
        }
      };
    })();

    try {
      ${js}
    } catch (e) {
      console.error(e.message);
    }
  </script>
</body>
</html>
`;
}


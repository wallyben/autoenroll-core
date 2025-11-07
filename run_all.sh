#!/usr/bin/env bash
set -euo pipefail
echo "==> Bootstrapping minimal servers on 3000, 4000, 5055"

# create a tiny HTTP server if missing
if [ ! -f server.js ]; then
  cat > server.js <<'JS'
const http = require('http');
function serve(port, name) {
  const s = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end(`${name} up on ${port}\n`);
  });
  s.listen(port, '0.0.0.0', () => console.log(`[OK] ${name} on ${port}`));
}
serve(3000,'Portal'); serve(4000,'API'); serve(5055,'NAERSA mock');
JS
fi

chmod +x server.js || true
node server.js

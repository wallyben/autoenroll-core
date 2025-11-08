#!/usr/bin/env bash
set -euo pipefail
echo "==> Bootstrapping minimal servers on 3000, 4000, 5055"
if [ ! -f server.js ]; then
  cat > server.js <<'JS'
const http=require('http');
function serve(p,n){
  http.createServer((_,res)=>{
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end(`${n} up on ${p}\n`);
  }).listen(p,'0.0.0.0',()=>console.log(`[OK] ${n} on ${p}`));
}
serve(3000,'Portal'); serve(4000,'API'); serve(5055,'NAERSA mock');
process.on('SIGINT',()=>process.exit(0));
JS
fi
node server.js

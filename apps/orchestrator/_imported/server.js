const http=require('http');
function serve(p,n){http.createServer((_,res)=>{res.writeHead(200,{'Content-Type':'text/plain'});res.end(`${n} up on ${p}\n`)}).listen(p,'0.0.0.0',()=>console.log(`[OK] ${n} on ${p}`))}
serve(3000,'Portal'); serve(4000,'API'); serve(5055,'NAERSA mock');

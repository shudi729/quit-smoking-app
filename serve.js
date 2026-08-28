const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".glb": "model/gltf-binary",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml"
};

const PORT = parseInt(process.argv[2], 10) || 8123;

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, {"Content-Type": "text/plain"}); res.end("404"); return; }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Content-Length": st.size,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache"
    });
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, "127.0.0.1", () => {
  console.log("serving " + ROOT + " at http://127.0.0.1:" + PORT);
});

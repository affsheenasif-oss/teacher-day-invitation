// Minimal zero-dependency local development server with SPA routing support
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ics': 'text/calendar; charset=utf-8',
  '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
  // Normalize URL and remove query strings/hashes
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  // If static file requested under /invite/ (e.g. /invite/style.css), serve from root
  if (pathname.startsWith('/invite/') && /\.(css|js|png|jpg|jpeg|svg|ico|ics|mp3)$/i.test(pathname)) {
    pathname = pathname.replace(/^\/invite/, '');
  }

  let filePath = path.join(PUBLIC_DIR, pathname);

  // If path is a directory, serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // If the file exists, serve it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // SPA fallback: any route (such as /invite/irfan-abid) serves index.html
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(indexPath).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`✨ Teacher's Day Invitation Server is running at: http://localhost:${PORT}`);
  console.log(`Try opening: http://localhost:${PORT}/invite/irfan-abid`);
});

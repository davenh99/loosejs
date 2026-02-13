const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname);
const port = 3000;

http
  .createServer((req, res) => {
    let file = path.join(
      root,
      req.url === "/" ? "/example/index.html" : req.url,
    );
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
      } else {
        const ext = path.extname(file).toLowerCase();
        const mimeTypes = {
          ".html": "text/html",
          ".js": "application/javascript",
          ".css": "text/css",
        };
        const mime = mimeTypes[ext] || "application/octet-stream";

        res.writeHead(200, { "Content-Type": mime });
        res.end(data);
      }
    });
  })
  .listen(port, () => {
    const url = `http://localhost:${port}/example/index.html`;
    console.log(`Server running on port: ${port}`);
    console.log("Opening in browser...");

    const { exec } = require("child_process");
    const startCmd =
      process.platform === "win32"
        ? "start"
        : process.platform === "darwin"
          ? "open"
          : "xdg-open";
    exec(`${startCmd} ${url}`, (err) => {
      if (err) console.error("failed to open browser:", err);
    });
  });

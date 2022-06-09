const fs = require('fs');
const path = require('path');
const http = require('http');
const formidable = require('formidable');

const indexPath = path.dirname(__filename);
const index = path.join(indexPath, 'index.html');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method.toLowerCase();

  if (url === '/' && method === 'get') {
    const indexFile = fs.readFileSync(index);
    res.writeHead(200, { 'content-type': 'text/html' });
    res.write(indexFile);
    res.end();
  } else if (url === '/completed' && method === 'post') {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.end('Error while parsing form');
      } else {
        fs.writeFileSync(
          `${indexPath}/resources/${fields.fName}`,
          JSON.stringify(fields)
        );
        const fileName = files.photo.originalFilename;
        const tempPath = files.photo.filepath;
        fs.renameSync(tempPath, `${indexPath}/resources/${fileName}`);
        res.end('Thanks for Submitting');
      }
    });
    // req.on('data', chunk => {
    //   console.log(chunk);
    // });
    // req.on('end', () => {
    //   res.end('Thanks for Submitting');
    // });
  }
});

server.listen(4000, 'localhost', () => {
  console.log('Server Is Running');
});

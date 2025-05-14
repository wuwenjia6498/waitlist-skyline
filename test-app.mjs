import http from 'http';

// 创建一个简单的HTTP服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>测试服务器</title>
      </head>
      <body>
        <h1>测试服务器正常工作!</h1>
        <p>当前时间: ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `);
});

// 监听3000端口
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`测试服务器正在运行: http://localhost:${PORT}`);
}); 
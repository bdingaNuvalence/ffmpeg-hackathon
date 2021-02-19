const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  if (!process.env.REACT_APP_EXCELSIOR_API_PROXY) {
    return;
  }
  app.use(
    '/excelsior-proxy',
    createProxyMiddleware({
      target: process.env.REACT_APP_EXCELSIOR_API_URL,
      changeOrigin: true,
      pathRewrite: {
        '^/excelsior-proxy': '/'
      },
      selfHandleResponse: true,
      onProxyRes: (proxyRes, req, res) => {
        const headerKeysAllow = ['link', 'content-type', 'content-length', 'content-encoding', 'connection', 'date'];
        const bodyChunks = [];
        proxyRes.on('data', (chunk) => {
          bodyChunks.push(chunk);
        });
        proxyRes.on('end', () => {
          const body = Buffer.concat(bodyChunks);
          // forwarding source status
          res.status(proxyRes.statusCode);

          // forwarding source headers
          headerKeysAllow.forEach((key) => {
            let newHeaderValue = proxyRes.headers[key];
            const compareStr = `<${process.env.REACT_APP_EXCELSIOR_API_URL}`;
            if (key === 'link' && typeof newHeaderValue === 'string' && newHeaderValue.toLowerCase().startsWith(compareStr.toLowerCase())) {
              newHeaderValue = `<${newHeaderValue.slice(compareStr.length, newHeaderValue.length)}`;
            }
            res.append(key, newHeaderValue);
          });

          res.send(body);
          res.end();
        });
      }
    })
  );
};

// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

require('dotenv').config({
    path: ['.env.local', '.env']
});

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { createProxyMiddleware } = require('http-proxy-middleware');

// Define the rewrite rule
const rewriteMiddleware = createProxyMiddleware({
    target: process.env.BACKEND_PROXY_URL, // Adjust to your backend URL
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/', // Rewrite path
    },
});

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        const { pathname } = parsedUrl;

        // Apply rewrite rule for /api requests
        if (pathname.startsWith('/api')) {
            return rewriteMiddleware(req, res);
        }

        handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});

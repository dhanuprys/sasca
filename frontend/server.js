// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

require('dotenv').config({
    path: ['.env.local', '.env']
});


const SERVICE_MODE = process.env.SERVICE_MODE

if (
    SERVICE_MODE !== 'ALL'
    && SERVICE_MODE !== 'FE'
) {
    console.error('Frontend inactive');
    while (true) { /* SUSPEND PROCESS */ }
}

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const BACKEND_PROXY_URL = process.env.BACKEND_PROXY_URL;

// Define the rewrite rule
const rewriteMiddleware = createProxyMiddleware({
    target: BACKEND_PROXY_URL, // Adjust to your backend URL
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/', // Rewrite path
    },
});

console.log('Starting proxy to ' + BACKEND_PROXY_URL);

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

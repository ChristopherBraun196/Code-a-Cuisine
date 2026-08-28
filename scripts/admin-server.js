const http = require('http');
const fs = require('fs');
const path = require('path');
const { db } = require('./firebase-admin-client');
const { CUISINES } = require('./recipe-templates');
const { seedCuisine, clearCuisine, seedAll, clearAll } = require('./seed-recipes');

const PORT = 5050;

async function getStatus() {
  const snapshot = await db.ref('recipes').get();
  const data = snapshot.val() || {};

  const counts = Object.fromEntries(CUISINES.map((cuisine) => [cuisine, 0]));
  for (const recipe of Object.values(data)) {
    if (recipe && counts[recipe.cuisine] !== undefined) {
      counts[recipe.cuisine]++;
    }
  }

  return { counts, total: Object.values(data).length };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  try {
    if (req.method === 'GET' && url.pathname === '/') {
      const html = fs.readFileSync(path.join(__dirname, 'admin.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/status') {
      const status = await getStatus();
      sendJson(res, 200, status);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/seed') {
      const { cuisine } = await readBody(req);
      const count = cuisine === 'all' ? await seedAll() : await seedCuisine(cuisine);
      sendJson(res, 200, { ok: true, count });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/clear') {
      const { cuisine } = await readBody(req);
      if (cuisine === 'all') {
        await clearAll();
      } else {
        await clearCuisine(cuisine);
      }
      sendJson(res, 200, { ok: true });
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Seed-Admin läuft auf http://localhost:${PORT}`);
});

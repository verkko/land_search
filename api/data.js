// api/data.js
export default async function handler(req, res) {
  // Enable CORS headers so your frontend can read it seamlessly
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const targetTable = req.query.table || 'SearchEC2';
  const rawUrl = `http://187.127.136.249:8000/rest/v1/${targetTable}?select=*&order=id.asc`;
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzgwMzk0NDk4LCJleHAiOjE5MzgwNzQ0OTh9.IcpCz0KGtKLeevKQ83SkaWMnPfJHIy_E66zU__7pn4w';

  try {
    // Server-to-server request (No browser blocks allowed here!)
    const response = await fetch(rawUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Backend database responded with status: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
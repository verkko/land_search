// api/data.js

export default async function handler(req, res) {

  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetTable = req.query.table || 'SearchEC2';

  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzgwMzk0NDk4LCJleHAiOjE5MzgwNzQ0OTh9.IcpCz0KGtKLeevKQ83SkaWMnPfJHIy_E66zU__7pn4w';

  try {

    const allData = [];
    const batchSize = 1000;

    let from = 0;
    let hasMore = true;

    while (hasMore) {

      const rawUrl =
        `http://187.127.136.249:8000/rest/v1/${targetTable}?select=*&order=id.asc`;

      const response = await fetch(rawUrl, {
        method: 'GET',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Range: `${from}-${from + batchSize - 1}`
        }
      });

      if (!response.ok) {
        throw new Error(
          `Backend database responded with status: ${response.status}`
        );
      }

      const data = await response.json();

      allData.push(...data);

      console.log(
        `Fetched ${data.length} rows. Total so far: ${allData.length}`
      );

      if (data.length < batchSize) {
        hasMore = false;
      } else {
        from += batchSize;
      }
    }

    return res.status(200).json(allData);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });

  }
}
import express from 'express';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PostgreSQL client configuration
const client = new pg.Client({
  user: "karelspostgre",
  host: "dpg-ctpnuvd2ng1s73dt8evg-a", 
  database: "asespro",
  password: "UTdFL9g2dnfwpzYJSs94VA9RvNFkdfUv",
  port: 5432,
});

// Connect to PostgreSQL
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Middleware
app.set('view engine', 'ejs');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Fetch images from the database
app.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM images');
    res.render('index', { images: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving images');
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


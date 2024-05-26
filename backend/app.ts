// backend/app.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Middleware olarak CORS kullanımı
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001'); // İstemci URL'sini buraya yazın
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import router from './routes/locationDetail.js';

const app = express();

const PORT = 3005;

app.use(express.json());

app.use('/api/sites/', router);

app.get('/', (req, res) => {
  res.send('client');
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});

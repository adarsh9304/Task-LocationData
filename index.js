
import express from 'express';
import { fetchCountries } from './controllers/fetchCountries.js';
import { fetchStates } from './controllers/fetchStates.js';
import { fetchCities } from './controllers/fetchCities.js';

const app = express();

const PORT = 3005 ;

app.use(express.json());


/*
http://localhost:3005/api/sites/country
http://localhost:3005/api/sites/country/states?country_id=[1,2,19]
http://localhost:3005/api/sites/country/states/cities?state_id=[803,818]&country_id=[19]

*/

app.get('/api/sites/country', fetchCountries);
app.get('/api/sites/country/states',fetchStates)
app.get('/api/sites/country/states/cities',fetchCities)

app.get('/', (req, res) => {
  res.send('client', client);
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});

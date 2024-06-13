import express from 'express'
import { fetchCountries } from '../controllers/fetchCountries.js';
import { fetchStates } from '../controllers/fetchStates.js';
import { fetchCities } from '../controllers/fetchCities.js';

const router=express.Router();

/*
http://localhost:3005/api/sites/country
http://localhost:3005/api/sites/country/states?country_id=[1,2,19]
http://localhost:3005/api/sites/country/states/cities?state_id=[803,818]&country_id=[19]

*/
router.get('/country', fetchCountries);
router.get('/country/states',fetchStates)
router.get('/country/states/cities',fetchCities)

export default router
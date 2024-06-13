import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/countryData.json');

export const fetchStates = async (req, res) => {
  try {
    const {country_id}=req.query;

    if (!country_id) {
        return res.status(400).json({ 
            error: 'country_id parameter is required' 
        });
      }

    const data = await fs.readFile(dataPath, 'utf-8');
    
    const allCountriesData = JSON.parse(data);
    
    if (!Array.isArray(allCountriesData)) {
      return res.status(500).json({
        data: 'Invalid data structure',
        message: 'Expected an array of countries',
      });
    }
   
    const matchCountry=allCountriesData.filter(((country)=>country_id.includes(country.id)))

    if (matchCountry.length === 0) {
      return res.status(404).json({
        data: [],
        message: "No matching countries found for the given country IDs",
      });
    }

    let states = [];

    matchCountry.forEach(country => {
        country.states.forEach(state => {
            states.push(state.name);
        });
    });
    
    if (states.length === 0) {
      return res.status(404).json({
        data: [],
        message: 'No states found in given counties',
      });
    }

    return res.status(200).json({
      data: states,
      message: 'Successfully got the data of states',
    });

  } catch (err) {
    return res.status(500).json({
      data: 'Internal server error',
      message: err.message,
    });
  }
};

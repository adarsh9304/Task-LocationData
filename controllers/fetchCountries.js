import { promises as fs } from "fs";
import path from "path";
import { __dirname } from "../config/filepath.js";

const countryDataPath = path.join(__dirname, "../data/countryData.json");

export const fetchCountries = async (req, res) => {
  try {
    const data = await fs.readFile(countryDataPath, 'utf-8');
    
    const allCountriesData = JSON.parse(data);
    
    if (!Array.isArray(allCountriesData)) {
      return res.status(500).json({
        data: 'Invalid data structure',
        message: 'Expected an array of countries',
      });
    }

    const countries = allCountriesData.map((country) => country.name);

    if (countries.length === 0) {
      return res.status(404).json({
        data: [],
        message: 'No countries found',
      });
    }

    return res.status(200).json({
      data: countries,
      message: 'Successfully got the data of countries',
    });

  } catch (err) {
    return res.status(500).json({
      data: 'Internal server error',
      message: err.message,
    });
  }
};

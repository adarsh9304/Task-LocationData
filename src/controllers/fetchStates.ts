import { promises as fs } from "fs";
import path from "path";
import { __dirname } from "../config/filepath.js";
import { Request,Response } from "express";
import { State,Country } from "../config/countryInterface.js";
import { parseArrayParam } from "../utils/parseArrayParam.js";

const countryDataPath = path.join(__dirname, "../../countryData.json");

 const fetchStates = async (req:Request, res:Response):Promise<Response> => {
  try {
    const {country_id}=req.query as {country_id?:string};

    if (!country_id) {
        return res.status(400).json({ 
            error: 'country_id parameter is required' 
        });
      }

      const parsedCountryId = parseArrayParam(country_id || " ");

    const data = await fs.readFile(countryDataPath, 'utf-8');
    
    const allCountriesData:Country[] = JSON.parse(data);
    
    if (!Array.isArray(allCountriesData)) {
      return res.status(500).json({
        data: 'Invalid data structure',
        message: 'Expected an array of countries',
      });
    }
  
    const matchCountry=allCountriesData.filter(((country)=>parsedCountryId.includes(country.id)))

    if (matchCountry.length === 0) {
      return res.status(404).json({
        data: [],
        message: "No matching countries found for the given country IDs",
      });
    }

    let states:string[] = [];

    if (Array.isArray(matchCountry)) {
      matchCountry.forEach((country:Country) => {
        if (Array.isArray(country.states)) {
          country.states.forEach((state:State) => {
            if (state && state.name) {
              states.push(state.name);
            }
          });
        }
      });
    }
    
    if (states.length === 0) {
      return res.status(404).json({
        data: [],
        message: 'No states found in given counties',
      });
    }

    return res.status(200).json({
      data:states ,
      message: 'Successfully got the data of states',
    });

  } catch (err) {
    return res.status(500).json({
      data: 'Internal server error',
      message: err.message,
    });
  }
};

export{
  fetchStates
}
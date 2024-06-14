import { promises as fs } from "fs";
import path from "path";
import { Request,Response } from "express";
import { __dirname } from "../config/filepath.js";
import {City, State,Country } from "../config/countryInterface.js";
import { parseArrayParam } from "../utils/parseArrayParam.js";


const countryDataPath = path.join(__dirname, "../../countryData.json");

const fetchCities = async (req:Request, res:Response):Promise<Response> => {
  try {

    const { country_id, state_id } = req.query as { country_id?: string, state_id?: string };

    const parsedCountryId = parseArrayParam(country_id || " ");
    const parsedStateId = parseArrayParam(state_id || "");

    if (!country_id || !state_id) {
      return res.status(400).json({
        data: [],
        message: "country_id and state_id are required",
      });
    }

    const data = await fs.readFile(countryDataPath , "utf-8");

    const allCountriesData :Country[] = JSON.parse(data);

    if (!Array.isArray(allCountriesData)) {
      return res.status(500).json({
        data: "Invalid data structure",
        message: "Expected an array of countries",
      });
    }

    const matchCountry:Country[] = allCountriesData.filter((country:Country) =>
      parsedCountryId.includes((country.id))
    );

    if (matchCountry.length === 0) {
      return res.status(404).json({
        data: [],
        message: "No matching countries found for the given country IDs",
      });
    }
    let cities:string[] = [];

    if (Array.isArray(matchCountry)) {
      matchCountry.forEach((country:Country) => {
        if (Array.isArray(country.states)) {
          country.states.forEach((state:State) => {
            if (parsedStateId.includes(state.id) && Array.isArray(state.cities)) {
              state.cities.forEach((city:City) => {
                if (city && city.name) {
                  cities.push(city.name);
                }
              });
            }
          });
        }
      });
    }

    if (cities.length === 0) {
      return res.status(404).json({
        data: [],
        message: "No states found in given counties",
      });
    }

    return res.status(200).json({
      data: cities,
      message: "Successfully got the data of states",
    });
  } catch (err) {
    return res.status(500).json({
      data: "Internal server error",
      message: err.message,
    });
  }
};
export {
  fetchCities
}
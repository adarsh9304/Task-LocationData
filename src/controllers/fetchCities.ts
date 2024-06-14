import { promises as fs } from "fs";
import path from "path";
import { Request,Response } from "express";
import { __dirname } from "../config/filepath";
/*
[
    {
        "id": 1,
        "name": "Afghanistan",
        "iso3": "AFG",
        "iso2": "AF",
        "numeric_code": "004",
        "phone_code": "93",
        "capital": "Kabul",
        "currency": "AFN",
        "currency_name": "Afghan afghani",
        "currency_symbol": "؋",
        "tld": ".af",
        "native": "افغانستان",
        "region": "Asia",
        "region_id": "3",
        "subregion": "Southern Asia",
        "subregion_id": "14",
        "nationality": "Afghan",
        "timezones": [
            {
                "zoneName": "Asia\/Kabul",
                "gmtOffset": 16200,
                "gmtOffsetName": "UTC+04:30",
                "abbreviation": "AFT",
                "tzName": "Afghanistan Time"
            }
        ],
        "translations": {
            "kr": "아프가니스탄",
            "pt-BR": "Afeganistão",
            "pt": "Afeganistão",
            "nl": "Afghanistan",
            "hr": "Afganistan",
            "fa": "افغانستان",
            "de": "Afghanistan",
            "es": "Afganistán",
            "fr": "Afghanistan",
            "ja": "アフガニスタン",
            "it": "Afghanistan",
            "cn": "阿富汗",
            "tr": "Afganistan"
        },
        "latitude": "33.00000000",
        "longitude": "65.00000000",
        "emoji": "🇦🇫",
        "emojiU": "U+1F1E6 U+1F1EB",
        "states": [
            {
                "id": 3901,
                "name": "Badakhshan",
                "state_code": "BDS",
                "latitude": "36.73477250",
                "longitude": "70.81199530",
                "type": null,
                "cities": [
                    {
                        "id": 52,
                        "name": "Ashkāsham",
                        "latitude": "36.68333000",
                        "longitude": "71.53333000"
                    },
                    {
                        "id": 68,
                        "name": "Fayzabad",
                        "latitude": "37.11664000",
                        "longitude": "70.58002000"
                    },

*/

const countryDataPath = path.join(__dirname, "../data/countryData.json");

interface city{
  id:number,
  namee:string,
  latitude:string,
  longitude:string
}
const fetchCities = async (req:Request, res:Response) => {
  try {
    const { country_id, state_id } = req.query as { country_id?: number[], state_id?: number[]};

    if (!country_id || !state_id) {
      return res.status(400).json({
        data: [],
        message: "country_id and state_id are required",
      });
    }

    const data = await fs.readFile(countryDataPath , "utf-8");

    const allCountriesData = JSON.parse(data);

    if (!Array.isArray(allCountriesData)) {
      return res.status(500).json({
        data: "Invalid data structure",
        message: "Expected an array of countries",
      });
    }

    const matchCountry = allCountriesData.filter((country) =>
      country_id.includes(country.id)
    );

    if (matchCountry.length === 0) {
      return res.status(404).json({
        data: [],
        message: "No matching countries found for the given country IDs",
      });
    }
    let cities:string[] = [];

    if (Array.isArray(matchCountry)) {
      matchCountry.forEach((country) => {
        if (Array.isArray(country.states)) {
          country.states.forEach((state:any) => {
            if (state_id.includes(state.id) && Array.isArray(state.cities)) {
              state.cities.forEach((city:any) => {
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
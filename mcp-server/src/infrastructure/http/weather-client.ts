import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const { GEOCODING_API, OPEN_METEO_API } = process.env;

export const getCoordinates = async (city: string) => {
    const { data } = await axios.get(`${GEOCODING_API}/search?name=${encodeURIComponent(city)}&count=1`);
    let rs = {
        latitude: null,
        longitude: null,
        name: null,
        country: null
    };

    if (data.results?.length) {
        const { latitude, longitude, name, country } = data.results[0];
        rs = {
            latitude: latitude,
            longitude: longitude,
            name: name,
            country: country
        };  
    }

    return rs;
}

export const getForecast = async (latitude: string, longitude: string) => {
    const { data } = await axios.get(`${OPEN_METEO_API}/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);

    let rs = {
        latitude: "",
        longitude: "",
        temperature: "",
        windSpeed: "",
        windDirection: "",
        weatherCode: ""
    };
    
    if (data.latitude != undefined) {
        rs = {
            latitude: latitude,
            longitude: longitude,
            temperature: data.current_weather.temperature + " " + data.current_weather_units.temperature,
            windSpeed: data.current_weather.windspeed + " " + data.current_weather_units.windspeed,
            windDirection: data.current_weather.winddirection + data.current_weather_units.winddirection,
            weatherCode: data.current_weather.weathercode + " " + data.current_weather_units.weathercode,
        };  
    }

    return rs;
}

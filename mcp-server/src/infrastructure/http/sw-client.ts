import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SW_API = process.env.SW_API;

export const getUsers = async (page: number = 1, limit: number = 100) => {
    console.log(`API called: ${SW_API}/people?page=${page}&limit=${limit}`);
    const rs = await axios.get(`${SW_API}/people?page=${page}&limit=${limit}`);
    
    return rs;
}
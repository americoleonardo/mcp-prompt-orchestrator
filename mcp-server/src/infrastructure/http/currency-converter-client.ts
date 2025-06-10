import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const { EXCHANGE_API, EXCHANGE_API_KEY } = process.env;

export const getCurrentInfo = async (source: string) => {
    console.log(`API called: ${EXCHANGE_API}/live?access_key=${EXCHANGE_API_KEY}&format=1&source=${source}`);
    const rs = await axios.get(`${EXCHANGE_API}/live?access_key=${EXCHANGE_API_KEY}&format=1&source=${source}`);
    
    return rs;
}
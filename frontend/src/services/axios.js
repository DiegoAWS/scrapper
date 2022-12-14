import axios from "axios";

const url = process.env.NODE_ENV==='production' ? '' : 'http://localhost:3001'
export const sendSearchRequest = async (data) => {
    const response = await axios.post(`${url}/start`,data)
    return response.data
}

export const closeApp = async () => {
    await axios.get(`${url}/close`)
}
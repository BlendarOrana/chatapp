import axios from "axios"


export const axiosIntstance = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true,
    
})
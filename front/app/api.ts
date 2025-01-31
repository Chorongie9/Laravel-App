import axios from "axios";

const api = axios.create({
    //http://localhost:8000/api
    //http://10.0.2.2:8000/api
    baseURL: "http://10.0.2.2:8000/api", 
    headers: {
        "Content-Type": "application/json",
    },
});

export default api; 
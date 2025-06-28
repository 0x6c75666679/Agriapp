import axios from "axios";

const ApiFormData = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers:{
        'Content-Type':'multipart/form-data'
    }
})

const Api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers:{
        'Content-Type':'application/json'
    }
})

export const loginUserAPI = (data) => {
    return Api.post('/api/user/login',data);
}
export const createUserAPI = (data) => {
   return Api.post('/api/user/register',data);
}

export const getallProduct = () => {
    return Api.get('/api/product/get-all');
}


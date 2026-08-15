import axios from 'axios'

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`

export const getProducts = async()=>{
    const { data } = await axios.get(
        `${API_URL}/products`
    );

    return data;
}

export const getProductById = async(id)=>{
    const { data } = await axios.get(
        `${API_URL}/products/${id}`
    )
    return data;
}
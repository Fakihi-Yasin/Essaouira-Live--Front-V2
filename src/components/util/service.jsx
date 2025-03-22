import axios from "axios";

const API_Base_Url = "http://localhost:3000";

export const requestseller = async(token)=>{
    const res = await axios.post(`${API_Base_Url}/users/api/request-seller`,{},{
        headers:{
            Authorization: `Bearer ${token}`,
        }
    });
    return res.data;
}


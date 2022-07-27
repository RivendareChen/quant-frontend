import axios from "axios";

export const postRequest = (name, reqData)=>{
    return new Promise((resolve, reject)=>{
        axios.post('http://localhost:3000/'+name,reqData)
        .then((res)=>{
            resolve(res.data);
        })
        .catch((err)=>{
            reject(err);
        });
    });
}
import axios from "axios";
import { useEffect, useState } from "react"

export const useFetchRecipient=(chat,user)=>{
    const [recipientUser,setRecipientUser]=useState(null);
    const [error,setError]=useState(null);
    const recipientId=chat?.members?.find((id)=>id!==user?.id);
    useEffect(()=>{
        const fetch=async()=>{
            if(recipientId){
            await axios.get(`http://localhost:4001/user/${recipientId}`)
            .then((res)=>{
                setRecipientUser(res.data);
            })
            .catch((err)=>{
                console.log(err)
                setError(err);
            })}
        }
        
        fetch();
    },[chat,user,recipientId])
    return {recipientUser,error}
}
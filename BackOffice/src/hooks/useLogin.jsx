import axios from "axios"
import { useAuthContext } from "./useAuthContext"
import { useState } from "react"


export const useLogin = ()=>{

    const {dispatch}= useAuthContext()
    const [userError, setUserError]=useState("")

    const signin= (values)=>{
        axios.post("http://localhost:8070/api/users/login",  values) 
        .then((res)=>{
            if(!res.data.auth){
                setUserError("compte invalide")
            }else{
                const user = res.data.data[0];
                    localStorage.setItem("token",res.data.token)
                    localStorage.setItem("userRole",user.role)
                    localStorage.setItem("user", JSON.stringify(user))
                    dispatch({type:"login", payload: {"role":res.data.data[0].role, "id":res.data.data[0].id}})
               
            }
         })
        .catch((err)=>{
            console.log("err",err);
        })
    }
    return {signin, userError}
}
import axios from "axios"
import { useAuthContext } from "./useAuthContext"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export const useLogin = ()=>{

    const {dispatch}= useAuthContext()
    const [userError, setUserError]=useState("")
    const navigate= useNavigate()

    const signin= (values)=>{
        setUserError("");
        axios.post("http://localhost:8070/api/users/login",  values) 
        .then((res)=>{
            // Check if user is active before proceeding
            if (!res.data.user.active === "suspended") {
                setUserError("Your account has been deactivated. For further information, please send an email to: employeeservice@gmail.com");
                // Clear any existing authentication data
                localStorage.removeItem("userRole")
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                return; // Exit the function early
            }
            console.log("res ", res)
            if(!res.data.token){
                setUserError("verify credentials")
            }else{
                console.log("res ", res)
                const user = res.data.user;
                    localStorage.setItem("token",res.data.token)
                    localStorage.setItem("userRole",user.role)
                    localStorage.setItem("user", JSON.stringify(user))
                    dispatch({type:"login", payload: {"role":user.role, "id":user.id}})
                    axios.post("http://localhost:8070/api/users/verfy-account", {email:res.data.user.email}).then((ress)=>{
                        navigate('/auth/2fa/', {state:{ values: ress.data.code}})
                    }).catch((errr)=>{
                        console.log({error: errr})
                    })
                    
               
            }
         })
        .catch((err)=>{
            console.log("err",err);
            setUserError("verify credentials")
        })
    }
    return {signin, userError}
}
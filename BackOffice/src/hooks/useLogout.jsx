import { useAuthContext } from "./useAuthContext"


export const useLogout = ()=>{

    const {dispatch}= useAuthContext()

    const logout= ()=>{
        localStorage.removeItem("userRole")
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        dispatch({type:"logout" })
    }
    return logout
}
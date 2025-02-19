import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext()

export const authReducer= (state, action)=>{
   switch(action.type){
    case "login": 
        return {user: action.payload.role, id:action.payload.id}
    case  "logout":
        return {user: null}
    default:
        return state
   }
}

export const AuthContextProvider = ({children})=>{
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })
    useEffect(()=>{
        const user = localStorage.getItem("user")
        const userRole= localStorage.getItem("userRole")
        if(user){
          dispatch({type: "login", payload: {"role":userRole, "id":user.id}})  
        }
    },[])


    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}
import { useContext } from "react";
import { NotificationContext } from "./NotificationContext";

export const useNotify=()=>{
    const context=useContext(NotificationContext)
    if(!context){
        throw new Error("useNotify must be use in NotificationProvider")
    }
    return context
}
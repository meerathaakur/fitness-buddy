import { useContext } from "react";
import { BuddyContext } from "./BuddiesContext";

export const useBuddy=()=>{
    const context=useContext(BuddyContext)
    if(!context){
        throw new Error("useBuddy must be use in BuddyProvider")
    }
    return context
}

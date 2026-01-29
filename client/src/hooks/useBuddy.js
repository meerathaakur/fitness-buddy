import { useContext } from "react";
import { BuddyContext } from "../contexts/BuddiesContext";

export const useBuddy=()=>{
    const context=useContext(BuddyContext)
    if(!context){
        throw new Error("useWorkout must be use in WorkoutProvider")
    }
    return context
}

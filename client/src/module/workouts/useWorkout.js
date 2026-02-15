import { useContext } from "react";
import { WorkoutContext } from "./WorkoutContext";

export const useWorkout=()=>{
    const context=useContext(WorkoutContext)
    if(!context){
        throw new Error("useWorkout must be use in WorkoutProvider")
    }
    return context
}
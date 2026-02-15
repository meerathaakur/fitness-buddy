import { createContext, useState } from "react"
import { 
    findBuddyAPI,
    responseToBuddyRequestAPI,
    sendBuddyRequestAPI
} from "../../api/all.api.js";


const BuddyContext = createContext(null);

const getStoredToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

export const BuddyProvider = ({ children }) => {
    const [token, setToken] = useState(getStoredToken());

    // Dummy Data for buddies
    const [buddies, setBuddies] = useState([
        {
            id: '1',
            name: 'Sarah Johnson',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
            location: 'New York, NY',
            fitnessLevel: 'intermediate',
            workoutPreferences: ['strength', 'cardio'],
            matchPercentage: 92,
            status: 'connected'
        },
        {
            id: '2',
            name: 'Mike Chen',
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
            location: 'Brooklyn, NY',
            fitnessLevel: 'advanced',
            workoutPreferences: ['strength', 'powerlifting'],
            matchPercentage: 85,
            status: 'pending'
        }
    ])

    const findBuddy=async(workoutType, fitnessLevel, maxDistance=20)=>{ // workoutType=cardio, fitnessLevel=advanced, maxDistance=20
        try {
            const response = await fetch(`${findBuddyAPI}?workoutType=${workoutType}&fitnessLevel=${fitnessLevel}&maxDistance=${maxDistance}`,{
                method:"GET",
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            if(!response.ok){
                return { success: response.ok }
            }
            const data=await response.json();
            console.log("findBuddy:::", data)
            // setBuddies(data)
            return data
        } catch (error) {
            return { success: false, error: error.message }
        }

    }

    const getBuddies=async()=>{
        try {
            const response =await fetch(findBuddyAPI,{
                method:"GET",
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            if(!response.ok){
                return { success: response.ok }
            }
            const data=await response.json();
            console.log("findBuddy:::", data)
            // setBuddies(data)
            return data
        } catch (error) {
            return { success: false, error: error.message }
            
        }

    }

    const sendBuddyRequest=async(recipientId)=>{
        try {
            const response = await fetch(sendBuddyRequestAPI,{
                method:"POST",
                headers:{
                    Authorization: `Bearer ${token}`
                },
                body: recipientId
            })
            if(!response.ok){
                return { success: response.ok }
            }
            const data=await response.json();
            console.log("findBuddy:::", data)
            return {message:"Request send successfully",data}; // {success:response.ok, data, message: "request send successfully"}
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const responseToBuddyRequest= async(requestId, action)=>{ // action = 'accept' or 'reject'
        try {
            const response = await fetch(`${responseToBuddyRequestAPI}/${requestId}`,{
                method:"PUT",
                headers:{
                    Authorization: `Bearer ${token}`
                },
                body: action
            })
            if(!response.ok){
                return { success: response.ok }
            }
            const data=await response.json();
            console.log("responseToBuddyRequest:::", data)
            return data;
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const value={
        buddies,
        findBuddy,
        getBuddies,
        sendBuddyRequest,
        responseToBuddyRequest,
    }

    return(
        <BuddyContext.Provider value={value}>
            {children}
        </BuddyContext.Provider>
    )
}
export {BuddyContext}
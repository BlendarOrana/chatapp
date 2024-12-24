import {create} from "zustand"
import { axiosIntstance } from "../lib/axios.js";
import toast from "react-hot-toast";


export const useAuthStore = create((set)=>({
    authUser:null,
    isSigninUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,
    onlineUsers:[],


    checkAuth: async()=>{
        try {
            const res = await axiosIntstance.get("/auth/check");

            set({authUser:res.data})
            
        } catch (error) {
            console.log("Error in checkAuth",error);
            set({authUser:null});
            
        } finally{
            set({isCheckingAuth:false});
        }
    },

    signup: async(data)=>{
        set({isSigninUp:true});
        try {
          const res =  await axiosIntstance.post("/auth/signup",data);
          toast.success("account created fully")
          set({authUser:res.data})
            
        } catch (error) {
            toast.error(error.response.data.message);
            
        } finally{
            set({isSigninUp:false})
        }
    },


 login: async(data)=>{
    set({isLoggingIn:true});


    try {
        const res = await axiosIntstance.post("auth/login",data);
        set({authUser: res.data});
        toast.success("Logged in successfully");
        
    } catch (error) {
        toast.error(error.response.data.message);
        
    } finally{
        set({isLoggingIn:false})
    }
 },


    logout: async()=>{


        try {
            await axiosIntstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    UpdateProfile: async(data)=>{

        set({isUpdatingProfile:true});
        try {  
            const res = await axiosIntstance.put("/auth/update-profile",data);
            set({authUser: res.data});
            toast.success("Profile updated successfully ")

        } catch (error) {
            console.log("error in update profile",error);
            toast.error(error.response.data.message)
        } finally{
            set({isUpdatingProfile:false});
        }
    }

}));
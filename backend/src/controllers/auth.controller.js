import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req,res)=>{
    const {fullName,email,password} = req.body
    try {
        if(password.length<6){
            return res.status(400).json({message:"password must be atleast 6 char"});

        }
        const user= await User.findOne({email})

        if (user) return res.status(400).json({message: "email already exists"});

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)


        const newUser = new User({
            fullName:fullName,
            email:email,
            password:hashedPassword
        })
        

        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save();


            res.status(201).json({_id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            });
        }

        else{
            res.status(400).json({message:"invalid user data"});
        }

    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({message: "interanl server error"});
    }
};

export const login = async (req,res)=>{
    const{email,password}= req.body

    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"invalid credencials"})
        }
       const isPasswordCorrect =  await bcrypt.compare(password, user.password)
       if(!isPasswordCorrect){
        return res.status(400).json({message:"password is incorrect"})
       }


       generateToken(user._id,res)



       res.status(200).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic,

       })
    } catch (error) {
        
        console.log("error in login controller", error.message);
        res.status(500).json({message: "internal server error"});
        
    }

};

export const logout = (req,res)=>{
    try {

        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out successfully"});
        
    } catch (error) {
        console.log("error in logout controller",error.message);
        res.status(500).json({message:"internal server error"});
        
    }

};


export const updateProfile = async (req,res)=>{

    try {
        const {profilePic} = req.body;
      const userId =  req.user._id;
if(!profilePic){
    return res.status(400).json({message : "profile pic required"});
}
     
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url}
        ,{new:true}
    );

    res.status(200).json(updatedUser)

    } catch (error) {
        console.error('Error in updating profile:', error);

        // Check for PayloadTooLargeError (status 413)
        if (error instanceof SyntaxError && error.status === 413) {
            return res.status(413).json({ message: 'File is too large or request body exceeds size limit' });
        }

        // Handle other errors (e.g., Cloudinary upload error, MongoDB error)
        return res.status(500).json({ message: 'An unexpected error occurred', error: error.message });

    }
    
}


export const checkAuth = (req,res)=>{

    try {
        res.status(200).json(req.user);
        
    } catch (error) {
        console.log("error in checkAuth controller",error.message);
        res.status(500).json({message:"internal server error"});
        
    }

}

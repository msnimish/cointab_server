import User from "../models/user.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

dotenv.config();



export const login = async(req,res) =>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        let curr = new Date();
        let totalAttempts = 5, banHours=24;
        let sendToken = () => {
            let token = jwt.sign({_id:user._id, email: user.email},process.env.JWT_SECRET);
            // console.log(token);
            user.attempts = 0;
            user.blockedTill = null;
            return res.status(200).send({token:`Bearer ${token}`, message: "Login Successful!", status:"success"});
        }
        if(!user){
            return res.status(200).send({message:"Invalid Email", status:"warning"});
        }else if(user.blockedTill){
            let blockedTill = new Date(user.blockedTill);
            let timeLeft = (blockedTill.getTime()-curr.getTime())/(1000*60*60);
            if(Math.floor(timeLeft)>0){
                return res.status(200).send({message:`Your ban ends after ${(timeLeft).toFixed(0)}hrs`, data:user, status:"warning"});
            }else if(Math.floor(timeLeft)===0 && timeLeft>0){
                return res.status(200).send({message:`Your ban ends after ${(timeLeft*60).toFixed(0)}minutes`, data:user, status:"warning"});
            }
            sendToken();
        }
        else{
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                user.attempts++;
                if(user.attempts>=totalAttempts){
                    user.attempts=0;
                    curr.setHours(curr.getHours()+banHours);       
                    user.blockedTill=curr;
                    await user.save();
                    return res.status(200).send({message:`User Blocked for ${banHours}hrs`, data:user, status: "error"});
                }
                await user.save();
                return res.status(200).send({message:`Incorrect Password! ${totalAttempts-user.attempts} attempts left`, data:user, status:"warning"});
            }
            sendToken();
        }
        
        
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "Something went wrong during Login", status:"error"});
    }
}

export const register = async (req,res) => {
    try{
        const {email,password} = req.body;
        console.log(req.body);
        let user = await User.find({email});
        if(user._id){
            return res.status(200).send({message: "User already exists! Please try to login", status:"info"})
        }
        const newUser = new User({
            email,
            password
        });
        
        const salt = await bcrypt.genSalt(10);
        console.log(password,salt);
        newUser.password = await bcrypt.hash(password,salt);
        await newUser.save();
        return res.status(200).send({message:"Registered Successfully", data:newUser, status:"success"});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "Something went wrong during Signup", status:"error"});
    }
}

export const getUser = async ( req,res )=>{
    try{
        let token = req.headers.authorization.split(' ')[1];
        let decode = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).send({user:decode});
    }
    catch(err){
        console.log(err);
        return res.status(500).send({message: "Something went wrong while fetching user details", status:"error"});
    }
}

export const getBannedUser = async ( req,res )=>{
    try{
        let users = await User.find({blockedTill:{$ne:null}}).sort({blockedTill:1}).limit(3);
    }
    catch(err){
        console.log(err);
        return res.status(500).send({message: "Something went wrong while fetching user details", status:"error"});
    }
}

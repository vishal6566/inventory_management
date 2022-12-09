const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")

const generateToken=(id)=>{
  //jwt.sign({what you want create token with},{another thing to add in the end},{how long after should this token will be expired})
  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"})
}

// register user
const registerUser = asyncHandler(
    async (req, res) => {

       const {name,email,password}= req.body

       //Validation
       if(!name ||!email || !password){
        res.status(400)
        throw new Error("Please fill in all required fields")
       }

       if(password.length<6){
        res.status(400)
        throw new Error("Password must be upto 6 characters")
       }

       //check if user email already exists
      const userExists= await User.findOne({email})

      if(userExists){
        res.status(400)
        throw new Error("Email is already been register")
      }

//encrypt password before saving to db // go in userModel.js to see implementation
// const salt=await bcrypt.genSalt(10)
// const hashedPassword=await bcrypt.hash(password,salt)



      //create a new user
      const user=await User.create({
        name,
        email,
        password,
      })

      
//generate token 
const token=generateToken(user._id);

//Send http-only cookie to client/frontend
//res.cookie("what will the name of the cookie you want to send to frontend",token,{order property: how we want to save this cookie})
res.cookie("token",token,{
  path:"/",
  httpOnly:true,
  expires:new Date(Date.now()+1000*86400),  //1day
  sameSite:"none",
  secure:true
})

      if(user){
        const{_id,name,email,photo,phone,bio}=user
        res.status(201).json({
            _id,name,email,photo,phone,bio,token
        })

      }else{
        res.status(400)
        throw new Error("Invalid user data")
      }



    })

//login user

const loginUser=asyncHandler(async (req,res)=>{
  const {email,password}=req.body

  //validate request
  if(!email || !password){
    res.status(400)
    throw new Error("Please enter email and password")
  }

  //check if user exists
  const user =await User.findOne({email})

  if(!user){
    res.status(400)
    throw new Error("User not found, please signup")
  }
  //user exists, check if password is correct

  const passwordIsCorrect=await bcrypt.compare(password,user.password)

  //generate token 
const token=generateToken(user._id);

//Send http-only cookie to client/frontend
//res.cookie("what will the name of the cookie you want to send to frontend",token,{order property: how we want to save this cookie})
res.cookie("token",token,{
  path:"/",
  httpOnly:true,
  expires:new Date(Date.now()+1000*86400),  //1day
  sameSite:"none",
  secure:true
})

  if(user && passwordIsCorrect){
    const{_id,name,email,photo,phone,bio}=user
    res.status(200).json({
        _id,name,email,photo,phone,bio,token
    })
  }else{
    res.status(400)
    throw new Error("Invalid email or password")
  }

})

//logout user
const logout = asyncHandler(async (req,res)=>{
  res.cookie("token","",{
    path:"/",
    httpOnly:true,
    expires:new Date(0),  //1day
    sameSite:"none",
    secure:true
  })
return res.status(200).json({message: "successfully logged out"})
})


// get user data

const getUser=asyncHandler(async (req,res)=>{
 const user= await  User.findById(req.user._id)

 if(user){
  const{_id,name,email,photo,phone,bio}=user
  res.status(200).json({
      _id,name,email,photo,phone,bio
  })
 }else{
  res.status(400)
  throw new Error ("User not found")
 }
})

//get login status
const loginStatus=asyncHandler(async (req,res)=>{
  const token=req.cookies.token
  if(!token){
    return res.json(false)
  }
  //Verify token
  const verified=jwt.verify(token,process.env.JWT_SECRET)

  if(verified){
    return res.json(true)
  }
  return res.json(false)
})


//updateUser

const updateUser=asyncHandler(async (req,res)=>{

  const user=await User.findById(req.user._id)

  if(user){
    const{name,email,photo,phone,bio}=user
    user.email=email
    user.name=req.body.name|| name
    user.phone=req.body.phone|| phone
    user.bio=req.body.bio|| bio
    user.photo=req.body.photo|| photo

    const updatedUser= await user.save()
res.status(200).json({
  _id:updatedUser._id,
  name:updatedUser.name,
  email:updatedUser.email,
  photo:updatedUser.photo,
  phone:updatedUser.phone,
  bio:updatedUser.bio
})
  } else{
    res.status(404)
    throw new Error ("User not fount")
  }

})



module.exports = { registerUser,loginUser,logout,getUser,loginStatus,updateUser }
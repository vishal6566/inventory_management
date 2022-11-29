const express=require("express")
const dotenv=require("dotenv").config()
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const cors=require("cors")


const app=express()

const PORT=process.env.PORT || 5000;

//connect to mongodb and start server

mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
        console.log(`server running on http://localhost:${PORT}`)
    })
})
.catch((err)=>{
    console.log(err)
})


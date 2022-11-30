const express=require("express")
const dotenv=require("dotenv").config()
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const cors=require("cors")
const userRoute=require("./routes/userRoute")
const errorHandler=require("./middleWares/errorMiddleware")
const cookieParser=require("cookie-parser")

const app=express()


//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())

//routes middleware
app.use("/api/users",userRoute)


//routes
app.get("/",(req,res)=>{
    res.send("homepage")
})

//error middleware
app.use(errorHandler)



//connect to mongodb and start server
const PORT=process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
        console.log(`server running on http://localhost:${PORT}`)
    })
})
.catch((err)=>{
    console.log(err)
})


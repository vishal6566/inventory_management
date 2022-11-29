const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter a name"]
    },
    email:{
        type:String,
        required:[true, "Please enter an email"],
        unique:true,
        trim:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Please enter a valid email"
        ]
    },
    password:{
        type:String,
        required:[true, "Please enter a password"],
        minLength:[6,"Password must be atleast 6 characters long"],
        maxLength:[23,"Password must be less than 23 characters "],
    },
    photo:{
        type:String,
        required:[true, "Please enter a photo"],
        default:"https://i.ibb.co/4pDNDk1/avatar.png"
    },
    phone:{
        type:String,
        default:"+91"
    },
    bio:{
        type:String,
        default:"bio",
        maxLength:[250,"Bio must be less than 250 characters "],
    }
},{
    timestamps:true
})

const User=mongoose.model("User",userSchema)

module.exports=User
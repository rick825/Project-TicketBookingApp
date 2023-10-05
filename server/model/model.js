const mongoose = require('mongoose');

const userSc = mongoose.Schema({
    name: {
        type : String,
        required:[true,'Please add a Name']
        },
    email: {
        type : String,
        unique: true ,  //email must be unique in the database
        required : [true,'Please add email']
    },
    password: {
        type :String,
        minlength:5,   //password should have atleast five characters
        required :[true,"Password is Required"]
    },
    cpassword: {
        type: String,
        minlength: 5,
        required :[true,"Password is Required"]
    }    
}) 


const tripSc = mongoose.Schema({
    author:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserDB'
     },
     ticketID:{
       type: Number,
       required:true
     },
     travelername: {
        type : String,
        required: true,
    },
     travelers: {
        type : Number,
        required: true,
     },
     airline: {
        type : String,
        required: true,
     },
     departurecity: {
        type : String,
        required: true,
     },
     arivalcity: {
        type : String,
        required: true,
     },
     departuredate: {
        type : String,
        required: true,
     },
     departuretime: {
        type : String,
        required: true,
     },
     traveltime:{
        type: String,
        required: true,
     },
     ticketPrice: {
        type : Number,
        required: true,
     },
     bookingPrice: {
        type : Number,
        required: true,
     },
     bookingtax: {
        type : Number,
        required: true,
     },
     BookingFinalPrice: {
        type : Number,
        required: true,
     },
})

const availableflights = mongoose.Schema({
    airline:{
        type: String,
        required: true,
    },
    traveltime:{
        type: String,
        required: true,
    },
    traveldate:{
      type: String,
      required: true,
    },
    from:{
        type: String,
        required: true
    },
    to:{
        type: String,
        required: true
    },
    ticketsleft:{
        type: Number,
        required: true,
    },
    price:{
      type: Number,
      required: true
    },
    availableTime:{
        type: [String],
        required: true,
    }
})


// const priceSchema = mongoose.Schema({
//     flight: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'availableFlights', 
//         required: true,
//     },
//     date: {
//         type: Date,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
// });

const UserDB = mongoose.model('userdb',userSc);
const TripDB = mongoose.model('tripdb', tripSc);
const availableFlights = mongoose.model('availableFlights',availableflights)
// const Price = mongoose.model('Price', priceSchema);

module.exports = {
    UserDB,TripDB,availableFlights
};

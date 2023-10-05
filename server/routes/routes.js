const express = require("express");
const route = express.Router();
const controller = require('../controller/controller');
const {UserDB,TripDB, availableFlights} = require('../model/model');


route.get('/',(req,res)=>{
    res.render('index');
})

route.get('/signup',(req,res)=>{
    console.log("Signup Page");
    res.render('signup');
})

route.get('/login',(req,res)=>{
    console.log("Login Page");
    res.render('login');
})



route.get('/admin',(req,res)=>{
    console.log("Admin");
    res.render('./admin/admin')
})

route.get('/available-flights',(req,res)=>{
    console.log("Available Flights");
    res.render('./admin/availableFlights');
})

route.get('/price-list',(req,res)=>{
    console.log('Price List');
    res.render('./admin/price');
})

//Booking Page/ Avaialble Flights
route.get('/availableflight',async (req,res)=>{
    console.log("Booking Option Page");
    try {
        const selectedbooking = req.session.selectedbooking;
        const author = await UserDB.findOne({_id:selectedbooking.author});
        console.log("Author-->",author);
        console.log("selectedbooking->>",selectedbooking);
        console.log("From->",selectedbooking.fromcity,"To->",selectedbooking.tocity,"on->",selectedbooking.date);
        const flight = await availableFlights.find({from:selectedbooking.fromcity,to:selectedbooking.tocity,traveldate:selectedbooking.date});
        console.log("Flights Available-->",flight);
        res.render('booking',{selectedbooking,flight,author}); 
    } catch (error) {
      console.log(error);
      res.send(error);   
    }
})

function ticketPriceGenerator(bd,td){
    console.log(`Ticket Price Generator`);
    
   let price = bd.price;
   let traveller = td.traveller;
   
   let ticketPrice = price * traveller;
   console.log("Ticket Price--> $",ticketPrice);

  return ticketPrice;
}

function taxGenerator(tp){
    console.log(`Tax Calculator`);
    let taxes= tp * 18 / 100;
    console.log("Tax:-->",taxes);

    return taxes;
}

function totalPriceGenerator(tp,tax){
    console.log(`Total Price Calculation`);
    let finalPrice = tp + tax ;
    console.log("Final Ticket Price:--> $",finalPrice);
    return finalPrice;
}


route.get('/bookconfpage',async (req,res)=>{
    try {
        console.log("Book Confirmation Page")
        const bookid=req.session.flightId;
        const selectedbooking = req.session.selectedbooking;
        const selectedtime = req.session.selectedtime;
        const author = await UserDB.findOne({_id:selectedbooking.author});
        console.log("selectedbooking-->",selectedbooking);
        console.log("booking Id->>",bookid);
        console.log("Selected Time: ",selectedtime);
        const bookingData= await availableFlights.findOne({_id:bookid});
        console.log("Booking data-->",bookingData);

           if(!bookingData){
                res.send("No Booking ID Found!!");
            }

        const ticketprice = ticketPriceGenerator(bookingData,selectedbooking); 
        const tax = taxGenerator(ticketprice)
        const Finalprice = totalPriceGenerator(ticketprice,tax);
        console.log("Grand Total-->",ticketprice);
        
        const bookinginfo = {
            travellername: author.name, 
            travellers: selectedbooking.traveller,
            airline: bookingData.airline,
            departurecity : bookingData.from,
            arivalcity: bookingData.to,
            departuredate : bookingData.traveldate,
            departuretime: selectedtime,
            traveltime: bookingData.traveltime,
            ticketPrice: bookingData.price,
            bookingPrice: ticketprice,
            bookingtax:  tax,
            BookingFinalPrice: Finalprice,
        }

        req.session.bookinginfo = bookinginfo;

          res.render('bookingConfirmation',{bookinginfo});  

    } catch (error) {
     console.log(error);   
    } 
})

// trips
route.get('/trips', async (req,res)=>{
    console.log("Trip Page");
    try {
        const userid = req.session.userID;
        const user = await UserDB.findOne({_id:userid});
        const trips = await TripDB.find({author:userid});

        if(!trips){
            throw new Error("User not found!");
        }else{
            console.log(user.name);
            console.log(trips);
            res.render('trips',{user,trips});
        }
    } catch (error) {
        res.status(500).send("Error Retrieving data")
    }
})

// home
route.get('/home', async (req,res)=>{
    try{
        console.log("Home Page");
        const userid = req.session.userID;
    
        const user = await UserDB.findOne({_id:userid});
       
        if(!user){
            throw new Error("User not found!");
        }else{
            console.log(user.name);
            res.render('home',{user});
        }
       
    }catch(e){
     res.status(500).send("Error Retrieving data")
    }
   
})

// profile
route.get('/profile',async (req,res)=>{
    console.log("Profile Page");
    try {
        const userid = req.session.userID;
        const user = await UserDB.findOne({_id:userid});
        const trips = await TripDB.find({author:userid});

        if(!user){
            throw new Error("User not found!");
        }else{
            console.log(user.name);
            console.log(trips);
            res.render('profile',{user,trips});
        }
    } catch (error) {
        res.status(500).send("Error Retrieving data")
    }
    
})

//logout
route.get('/logout',(req,res)=>{
    console.log("Logout Page");
    if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err);
          }
          console.log('✔Session Destroy Success✨');
          res.redirect('/');
        });
      } else {
        res.redirect('/');
      }
});


//API-POST
route.post('/api/signup', controller.create);
route.post('/api/login', controller.login);
route.post('/api/selectFlight',controller.selectFlight);
route.post('/api/availableFlights',controller.availableFlights);
route.post('/api/bookingconfirmation',controller.bookconf);
route.post('/api/booking',controller.booking);
route.post('/api/seeTicket',controller.seeTicket);
route.get('/api/users',controller.find);
route.get('/api/trips',controller.trips);



module.exports = route;
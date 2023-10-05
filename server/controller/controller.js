const { log } = require('console');
const {UserDB,TripDB, availableFlights} = require('../model/model');
const crypto = require('crypto');

//create
exports.create = (req,res)=>{
try{
  const user = new UserDB ({
    name : req.body.name,
    email :  req.body.email,
    password : req.body.password,
    cpassword : req.body.cpassword,
  });

  console.log('user-->👱‍♂️',user);

  if(req.body.password == req.body.cpassword){
      console.log("Password matched");
      console.log(`User created successfully`);
      user.save(user).then(data=>{
        console.log(`${JSON.stringify(data)}`);
        res.redirect(`/login`);
      })
      .catch(err=>{
        console.error(err)
        res.status(500).send({
            message: err.message || "some error occured while create"
        })
      })
    }else{
        return res.status(401).json({msg: 'Password not matched'});
    }

}catch(err){
    console.error("Error in creating User", err)
}

};



//login
const sessions = {};

exports.login = async (req,res)=>{
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user =  await UserDB.findOne({email:email});
    console.log("User Found->😀",user);

     if(user.password === password){
        
      //Session Generation
      const sessionId = crypto.randomBytes(16).toString('hex');
      // Getting user ID to session Array
      sessions[sessionId]= user._id;
      // Getting user ID into the session
      req.session.userID = user._id;
      //Getting user Email into the session
      req.session.email = user.email;
      //Setting cookie for the first time login
      var options={
        expires : new Date(Date.now() + 90*24*3600),
        httpOnly : true
        };
        res.cookie('_sid', sessionId ,options );
        res.status(200);
        res.redirect('/home');
        console.log({"success":true,"session_id":sessionId})
        } else
        return res.status(401).json({'msg': 'Invalid Credentials'})
    } catch (error) {
      res.status(400).send("Invalid Email")
  }
};


 // Function to generate a random ticket ID
 function generateRandomTicketId() {
  // Generate a random number between 1 and 1000000 (adjust the range as needed)
   const min = 1;
   const max = 1000000;
   const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
   console.log("Ticket Generated");
   return randomId;
   }

// Book Trip
exports.selectFlight = (req,res) =>{
  try{
  const userID = req.session.userID;

  const selectedbooking = {
    fromcity : req.body.fromcity,
    tocity : req.body.tocity,
    traveller : req.body.traveller,
    date : req.body.date,
    author : userID,
  }
   

  if(req.body.fromcity !== req.body.tocity )
  console.log('trip-->👱‍♂️',selectedbooking);
  else
  res.send("From City and To City are same😢");   
 
  req.session.selectedbooking = selectedbooking;
  console.log(`selectedbooking`,selectedbooking);
  res.redirect('/availableflight');
}catch(err){
  console.error(err)
}
}

//Available Flights
exports.availableFlights =  (req,res) =>{
  try{

    const availableTimeInput = req.body.availableTime;
    if (typeof availableTimeInput !== 'string') {
      throw new Error('availableTime must be a string');
    }
    // Split the comma-separated times into an array
    const availableTimeArray = req.body.availableTime.split(',').map(time => time.trim());

  const availableFlight = new availableFlights({
      airline: req.body.airline,
      traveltime: req.body.traveltime,
      traveldate: req.body.traveldate,
      from: req.body.from,
      to: req.body.to,
      ticketsleft: req.body.ticketsleft,
      price: req.body.price,
      availableTime: availableTimeArray,
  })

    availableFlight.save();
    console.log(availableFlight);
    res.json(availableFlight);
     }catch(err){
       console.log(err);
     }
}


exports.bookconf = async (req,res) =>{
  try {
    const flightID = req.body.flightId;
    const selectedtime = req.body.availtime;
    req.session.selectedtime = selectedtime;
    req.session.flightId = flightID;

    res.redirect('/bookconfpage');

  } catch (error) {
    console.error(error);
  }
}

exports.booking = async (req,res)=>{
  try{

    const userID = req.session.userID;
    const ticketId = generateRandomTicketId();
    const bookinginfo = req.session.bookinginfo;
    console.log("Booking Info--->",bookinginfo);
    console.log(`Generated Ticket ID: ${ticketId}`);

    const trip = new TripDB ({
      author: userID,
      ticketID: ticketId,
      travelername: bookinginfo.travellername,
      travelers: bookinginfo.travellers, 
      airline: bookinginfo.airline,
      departurecity: bookinginfo.departurecity,
      arivalcity: bookinginfo.arivalcity,
      departuredate: bookinginfo.departuredate,
      departuretime: bookinginfo.departuretime,
      traveltime: bookinginfo.traveltime,
      ticketPrice: bookinginfo.ticketPrice,
      bookingPrice: bookinginfo.bookingPrice,
      bookingtax: bookinginfo.bookingtax,
      BookingFinalPrice: bookinginfo.BookingFinalPrice,
    });
    
    req.session.trip = trip;
    trip.save();
    console.log(`trip-->`,trip);
    res.redirect('/trips');
  }catch(err){
    console.error(err)
  }
}


exports.seeTicket = async (req,res) =>{
  try {
    console.log("Trip ID-->",req.body.tripId);
    const trip = await TripDB.findOne({_id : req.body.tripId}); 

    if(!trip){
      throw new Error("Trip not Found😶")
    }else{
      console.log("Ticket Found-->😎",trip);
      res.render('ticket',{trip})
    }
  } catch (error) {
    console.log(error);
  }

}




//find user
exports.find = async (req,res) =>{
  try{
    const email = req.session.email;
    if(email){
    const user = await UserDB.findOne({email:email});
    console.log("User Found->😀",user);
    res.send(user);
    }else{
     UserDB.find()
      .then(user=>{
        res.send(user);
    }).catch(err=>{
        res.status(500).send({message: err.message || "Error while retrieving user info"});
    })
    }
  }catch(err){
    console.error(err)
  }
}

//find trip
exports.trips = async (req,res) =>{
  try{
    const userid = req.session.userID;
    if(userid){
    const trip = await TripDB.findOne({author:userid});
    console.log("Trip Found->😀",trip);
    res.send(trip);
    }else{
    TripDB.find()
      .then(trip=>{
        res.send(trip);
    }).catch(err=>{
        res.status(500).send({message: err.message || "Error while retrieving user info"});
    })
    }
  }catch(err){
    console.error(err)
  }
}


exports.searchTrip = async (res,req) =>{
  try{
    const trip = await TripDB.findOne({ticketID:req.params.id});
    console.log("Trip Found->😀",trip);
    res.send(trip);
  }catch(err){
    console.error(err)
  }
}

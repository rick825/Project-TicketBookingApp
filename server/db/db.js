const mongoose = require('mongoose');


const connectDB = async () =>{
    try{
        const con = await mongoose.connect(process.env.DB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology:true 
       })
       console.log(`Mongo is connected to ${con.connection.host}`);
       console.log("✨✔DB Connection Success✔✨");
      }
    catch(err){
        console.log("Error connecting to DB", err);
        process.exit;
    }

}


module.exports = connectDB;
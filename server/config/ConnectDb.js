import mongoose, { Mongoose } from 'mongoose'


const connectDb = async () =>{
      try{
         await mongoose.connect(process.env.MONGO_URL)
         console.log("MongoDb is Successfully Connected");
      }
      catch(error){
        console.error("MonngoDb connection field", error.message);
        process.exit(1)

      }
      } 


export default connectDb;
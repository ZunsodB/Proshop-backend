import mongoose from 'mongoose';

const connectDB = async ()=> {
    try{
        const conn = await mongoose.connect("mongodb+srv://s21c118b:MpEHjwt2agprsRSD@proshop-ecomm.jzggr.mongodb.net/Proshop");
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }catch(err){
        console.error(`Error: ${err.message}`); // Use console.error for errors
        // Do NOT call process.exit(1) in a serverless function.
        // Instead, you can re-throw the error if you want to handle it further up the chain,
        // or simply let it fall through so Vercel can log it as an unhandled error.
        throw err; // Re-throw the error so Vercel logs it and your app might gracefully fail
    }
}
export default connectDB;

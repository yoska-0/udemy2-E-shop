import mongoose from "mongoose";

const dbConection = () => {
  mongoose.connect(process.env.DB_CONECTION).then((connt) => {
    console.log(`Database connected with ${connt.connection.host}`);
  });
};

export default dbConection;

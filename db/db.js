import { connect } from "mongoose";

const connectDB = async () => {
  const connectionInstance = await connect(process.env.DB_URI);

  console.log(
    `\n MongoDb connected!!DB HOST :${connectionInstance.connection.host}`
  );
};

export { connectDB};

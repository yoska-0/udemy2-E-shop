import dotenv from "dotenv";
import morgan from "morgan";

// import from my project
import dbConection from "./config/database.js";
import app from "./app.js";

dotenv.config({ path: "./config.env" });

// conection with database
dbConection();
const PORT = process.env.PORT;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// unhandled rejection
process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection", err.name, err.message);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});

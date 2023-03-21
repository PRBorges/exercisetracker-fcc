// index.ts
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "mongoose";
import router from "./routes/users";
import path from "path";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

connect(process.env.MONGO_URI as string).then(() => {
  // Basic Configuration
  app.use(cors());
  app.use("/public", express.static(path.join(process.cwd(), "public")));
  app.use(bodyParser.urlencoded({ extended: false }));

  // Setting request handlers
  app.use("/api/users", router);

  app.get("/", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "views", "index.html"));
  });

  // Running the server
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});

import express from "express"
import { connctDB } from "./config/db.js";
import { ENV } from "./config/env.js";


const app= express();

connctDB();

app.listen(ENV.PORT ,()=> console.log("Server is up and running on PORT:",ENV.PORT));
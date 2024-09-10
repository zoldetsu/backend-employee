import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routerUser from "./routers/users.js";
import routerEmployeer from "./routers/employees.js";
const app = express();
app.use(cors());
dotenv.config();
async function main() {
  app.use(express.json());

  app.use("/api/user", routerUser);
  app.use("/api/employees", routerEmployeer);
  app.listen(process.env.PORT || 4400, () => {
    console.log("server ok");
  });
}
main();

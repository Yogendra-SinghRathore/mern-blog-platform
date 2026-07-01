import dotenv from "dotenv";
dotenv.config({
  path:"./.env"
});

import { app } from "./app.js";
import connectDB from "./db/db.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed", error);
  });

// 200 -> Success
// 201 -> Created
// 400 -> Bad Request
// 401 -> Unauthorized
// 403 -> Forbidden
// 404 -> Not Found
// 500 -> Internal Server Error

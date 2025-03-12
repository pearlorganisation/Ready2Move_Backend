import { app } from "./app.js";
import { connectToMongoDB } from "./src/config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;

connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB Connection Failed!! ${error}`);
    process.exit(1);
  });

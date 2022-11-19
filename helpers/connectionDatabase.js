import db from "../db/database.js";

export const checkConnection = async () => {
  try {
    await db.authenticate();
    console.log("🌿 Database connected");
  } catch (error) {
    console.error(`Database not connected ${error}`);
  }
};

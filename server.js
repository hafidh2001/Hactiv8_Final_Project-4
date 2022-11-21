// import library
import { port, node_env } from "./config.js";
import app from "./app.js";

// declare route
app.listen(port || 8000, () => {
  console.log(`🍃 node_env = ${node_env}`);
  console.log(`🍃 Server running at http://localhost:${port || 8000}/`);
});

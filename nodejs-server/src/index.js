import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import { app } from './app.js';
import axios from 'axios';

dotenv.config();

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// const nodeurl = "https://floatchat-sih-69r4.onrender.com";
// const fastapiurl = "https://floatchat-sih-1.onrender.com";
// const interval = 60000 * 8; // 8 minutes in milliseconds
// async function pingServer() {
//     const res = await axios.get(nodeurl);
//     const res2 = await axios.get(fastapiurl);
// }
// setInterval(pingServer, interval);
// pingServer(); 

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Database connection failed:', error);
  process.exit(1);
});

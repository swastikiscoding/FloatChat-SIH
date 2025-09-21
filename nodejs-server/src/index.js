import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import { app } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });

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

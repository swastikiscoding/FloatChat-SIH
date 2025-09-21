import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';
dotenv.config();
// Initialize Clerk with environment variables
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY environment variable is required');
}

// Export middleware functions
export const requireAuth = ClerkExpressRequireAuth();
export const withAuth = ClerkExpressWithAuth();

// Optional: Custom middleware to add user info to requests
export const addUserToRequest = (req, res, next) => {
  if (req.auth && req.auth.userId) {
    // Add user ID to request for easy access in controllers
    req.userId = req.auth.userId;
  }
  next();
};
import { JWTPayload } from "./utils/jwt.utils";

// Augment the express-serve-static-core module to add the 'user' property
declare module "express-serve-static-core" {
  interface Request {
    user?: JWTPayload;
  }
}

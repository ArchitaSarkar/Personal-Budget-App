import { UserDocument } from "../models/user.model";

declare global {// Extend the Express namespace to include the UserDocument type
  namespace Express {//declaration merging / augmentation
    interface User extends UserDocument {
      _id?: any;
    }
  }
}
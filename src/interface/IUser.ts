import { Document } from "mongoose";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    photo: string;
    role: "admin" | "user";
    gender: "male" | "female";
    dob: Date;
    createdAt: Date;  // Add createdAt to the IUser interface
    updatedAt: Date;  // Add updatedAt if it's required
    // virtual properties
    age: number;

}

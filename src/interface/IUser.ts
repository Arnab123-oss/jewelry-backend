import { Document, SchemaTimestampsConfig } from "mongoose";

export interface IUser extends Document,SchemaTimestampsConfig {
    _id: string;
    name: string;
    email: string;
    photo: string;
    role: "admin"|"user";
    gender: "male"|"female";
    dob:Date;
    // virtual properties
    age: number;
}

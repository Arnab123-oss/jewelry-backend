export interface UserRequestBody{
    _id: string;
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob:Date;
}

export interface ProductRequestBody{
    name: string;
    category: string;
    price:number;
    stock: number;
}


import mongoose from "mongoose";
import { OrderStatus } from "../metadata/enum.js";




const OrderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "Please provide shipping address"],
        },
        city: {
            type: String,
            required: [true, "Please provide city"],
        },
        state: {
            type: String,
            required: [true, "Please provide state"],
        },
        country: {
            type: String,
            required: [true, "Please provide country"],
        },
        pinCode: {
            type: Number,
            required: [true, "Please provide pinCode"],
        },
    },
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    shippingCharges: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: OrderStatus,
        default: OrderStatus.PROCESSING,
    },
    oredrItems: [
        {
            name: String,
            photo: String,
            price: Number,
            quantity: Number,
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        }

    ]

}
    , {
        timestamps: true,
    });


export const Order = mongoose.model("Order", OrderSchema);
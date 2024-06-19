import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter product name "],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      maxLength: [8, "price should not exceed 8 characater"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    productImage: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    category: {
      type: String,
      required: [true, "please enter  product category"],
    },
    stock: {
      type: Number,
      required: [true, "please enter product stock"],
      maxLength: [4, "stock cannot exceed 4 character"],
    },
    numOfReview: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: { type: String, required: true },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

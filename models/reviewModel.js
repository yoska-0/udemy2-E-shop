import mongoose from "mongoose";
import Product from "./prodactModel.js";

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "Please provide rating"],
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating must not be greater than 5.0"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true },
);

reviewSchema.pre(/^find/, function () {
  this.populate({ path: "user", select: "name" });
});

// static method to calculate average rating and quantity ratings
reviewSchema.statics.setAverageRatingAndQuantity = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        ratingsAverage: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].ratingsAverage,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

// to make changes on save and delete
reviewSchema.post("save", async function () {
  await this.constructor.setAverageRatingAndQuantity(this.product);
});

reviewSchema.post("findOneAndDelete", async (doc) => {
  if (doc) await doc.constructor.setAverageRatingAndQuantity(doc.product);
});

export default mongoose.model("Review", reviewSchema);

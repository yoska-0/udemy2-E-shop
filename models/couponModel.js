import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter coupon name"],
    unique: [true, "Coupon already exist"],
  },
  expiry: {
    type: Date,
    required: [true, "Please enter expiry date"],
  },
  discount: {
    type: Number,
    required: [true, "Please enter discount"],
  },
});

export default mongoose.model("Coupon", couponSchema);

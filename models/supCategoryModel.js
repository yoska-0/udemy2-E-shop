import mongoose from "mongoose";

const supCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Supcategory name"],
      unique: [true, "Supcategory already exits"],
      minlength: [2, "Supcategory name must be at least 2 characters"],
      maxlength: [15, "Supcategory name must be at most 15 characters"],
      trim: true,
    },
    slug: {
      type: String,
      lowerCase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Please select category"],
    },
  },
  { timestamps: true }
);

const SupCategory = mongoose.model("SupCategory", supCategorySchema);
export default SupCategory;

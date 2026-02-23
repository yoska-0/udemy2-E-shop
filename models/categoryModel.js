import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter category name"],
      unique: [true, "Category already exist"],
      minlength: [3, "Category name must be at least 3 characters"],
      maxlength: [15, "Category name must be at most 15 characters"],
    },
    slug: {
      type: String,
      lowerCase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

const setImageURL = (doc) => {
  if (doc.image) doc.image = `${process.env.BASE_URL}/category/${doc.image}`;
};

categorySchema.pre("init", (doc) => {
  setImageURL(doc);
});

categorySchema.pre("save", (doc) => {
  setImageURL(doc);
});

const Category = mongoose.model("Category", categorySchema);
export default Category;

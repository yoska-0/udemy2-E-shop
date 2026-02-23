import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter brand name"],
    unique: [true, "Brand already exist"],
    minlength: [3, "Brand name must be at least 3 characters"],
    maxlength: [15, "Brand name must be at most 15 characters"],
  },
  slug: {
    type: String,
    lowerCase: true,
  },
  image: {
    type: String,
  },
});

const setImageURL = (doc) => {
  if (doc.image) doc.image = `${process.env.BASE_URL}/brand/${doc.image}`;
};

brandSchema.pre("init", (doc) => {
  setImageURL(doc);
});

brandSchema.pre("save", (doc) => {
  setImageURL(doc);
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;

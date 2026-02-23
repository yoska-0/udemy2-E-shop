import mongoose from "mongoose";

const prodactSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter product title"],
      trim: true,
      minlength: [3, "Product title must be at least 3 characters"],
      maxlength: [100, "Product title must be at most 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      lowerCase: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
      mainLength: [10, "Product description must be at least 10 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Please enter product quantity"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      trim: true,
      max: [20000, "Product price must be at most 10 characters"],
    },
    priceAfterDiscount: Number,
    colors: [String],
    images: [String],
    imageCover: {
      type: String,
      required: [true, "Please enter product image cover"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Please select category"],
    },
    subcategories: {
      type: [mongoose.Schema.ObjectId],
      ref: "SupCategory",
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating must not be greater than 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    //to enable virtual
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

prodactSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

prodactSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
});

const setImageURL = (doc) => {
  if (doc.imageCover)
    doc.imageCover = `${process.env.BASE_URL}/product/${doc.imageCover}`;
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      imagesList.push(`${process.env.BASE_URL}/product/${image}`);
    });
    doc.images = imagesList;
  }
};

prodactSchema.pre("init", (doc) => {
  setImageURL(doc);
});

prodactSchema.pre("save", (doc) => {
  setImageURL(doc);
});

const Product = mongoose.model("Product", prodactSchema);
export default Product;

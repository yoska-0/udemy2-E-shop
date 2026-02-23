import { model } from "mongoose";

class ApiFeaturs {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const quaryStringObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields", "keyword"];
    excludeFields.forEach((el) => delete quaryStringObj[el]);

    //  advanced filter
    let quaryString = JSON.stringify(quaryStringObj);
    quaryString = quaryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    this.query = this.query.find(JSON.parse(quaryString));
    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-_v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      const query = {};
      if (modelName === "product") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }

      this.query = this.query.find(query);
    }
    return this;
  }
}

export default ApiFeaturs;

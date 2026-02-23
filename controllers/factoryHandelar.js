import asyncHandler from "express-async-handler";
import AppError from "../utils/AppError.js";
import ApiFeaturs from "../utils/apiFeaturs.js";

const delateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError("object not found", 404));
    }

    res.sendStatus(204);
  });

const getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let objectFilter = {};
    if (req.filtterObj) objectFilter = req.filtterObj;

    // build quary
    const apiFeaturs = new ApiFeaturs(Model.find(objectFilter), req.query)
      .paginate()
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // execute quary
    const documents = await apiFeaturs.query;

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  });

const getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    //build query
    let query = Model.findById(req.params.id);

    if (populateOptions) query = query.populate(populateOptions);

    // execute query
    const document = await query;

    if (!document) {
      return next(new AppError("Object not found", 404));
    }
    res.status(200).json({
      success: true,
      document,
    });
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) return next(new AppError("Object not found", 404));

    // trager "save" event
    document.save();

    res.status(200).json({
      success: true,
      message: "Object updated successfully",
      document,
    });
  });

const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      success: true,
      document,
    });
  });

export default { delateOne, getOne, updateOne, createOne, getAll };

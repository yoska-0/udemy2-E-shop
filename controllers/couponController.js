import factoryHandelar from "./factoryHandelar.js";
import Coupon from "../models/couponModel.js";

// to create new coupon
const createCoupon = factoryHandelar.createOne(Coupon);

// to get all coupons
const getAllCoupons = factoryHandelar.getAll(Coupon);

// to get one coupon
const getOneCoupon = factoryHandelar.getOne(Coupon);

// to update coupon
const updateCoupon = factoryHandelar.updateOne(Coupon);

// to delete coupon
const deleteCoupon = factoryHandelar.delateOne(Coupon);

export default {
  createCoupon,
  getAllCoupons,
  getOneCoupon,
  updateCoupon,
  deleteCoupon,
};

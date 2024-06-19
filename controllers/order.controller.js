import { Order } from "../models/order.model.js";
import { Product } from "../models/product.moodel.js";
import ErrorHandler from "../utils/error.handler.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

// create new order
const createNewOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get single order
const getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("order not found with this id", 404));
  }
  res.status(200).json({ success: true, order });
});

// ye wala unky users kay liy jinon nay login kia apny order daikhny kay liy
// get logged In User Order/ my orders

const myOredrs = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({ success: true, orders });
});

// get all orders --admin
const getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  //The totalAmount in the getAllOrders method is used to calculate the
  // cumulative total price of all the orders. Here’s why it's being used and how it functions:
  //This loop goes through each order, adding the totalPrice of each order to the totalAmount
  //the total amount and the list of orders are sent back in the response.
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update order status --admin
const updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id); // we found the order

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("you have already deleivered this order", 400)
    );
  }
  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  // what if order didnot delivered
  // order.orderItems.forEach(async (order) => {
  // await updateStock(order.product, order.quantity);
  //});
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliverAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, qunatity) {
  const product = await Product.findById(id);
  (product.stock -= qunatity),
    await product.save({ validateBeforeSave: false });
}

// delete order
const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("order  not found with this id", 404));
  }
  await order.remove();

  // await order.deleteOne();
  res.status(200).json({ success: true });
});

export {
  createNewOrder,
  getSingleOrder,
  myOredrs,
  getAllOrders,
  updateOrder,
  deleteOrder,
};

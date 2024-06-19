import { Router } from "express";
const router = Router();
import {
  isAuthenticatedUser,
  isAuthorizedRole,
} from "../middlewares/authentication.js";

import {
  createNewOrder,
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  myOredrs,
  updateOrder,
} from "../controllers/order.controller.js";

router.route("/order/new").post(isAuthenticatedUser, createNewOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOredrs);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, isAuthorizedRole("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, isAuthorizedRole("admin"), updateOrder)
  .delete(isAuthorizedRole("admin"), deleteOrder);

export default router;

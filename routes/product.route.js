import { Router } from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  deleteReviews,
  getAllProduct,
  getAllProductReviews,
  getProductDetails,
  updateProduct,
} from "../controllers/product.controller.js";

import {
  isAuthenticatedUser,
  isAuthorizedRole,
} from "../middlewares/authentication.js";

const router = Router();

router.route("/product").get(getAllProduct);

// admin routes
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, isAuthorizedRole("admin"), createProduct);
// we can write this way too beacuse of starting router thing is same
// router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, isAuthorizedRole("admin"), updateProduct);
router
  .route("/admin/product/:id")
  .delete(isAuthenticatedUser, isAuthorizedRole("admin"), deleteProduct);
router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser,createProductReview)


router.route("/reviews")
.get(getAllProductReviews)
.delete(isAuthenticatedUser,deleteReviews)
export default router;

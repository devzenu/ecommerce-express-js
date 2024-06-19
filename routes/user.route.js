import { Router } from "express";

import {
  deleteUser,
  forgetPassword,
  getAllUsers,
  getSingleUserDetails,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUserPassword,
  updateUserProfile,
  updateUserRole,
} from "../controllers/user.controller.js";

import {
  isAuthenticatedUser,
  isAuthorizedRole,
} from "../middlewares/authentication.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);
// authetication system complete

// user want to check his profile or want to chcek user details or want to upload new profile photo or want to change the password

// get user details

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updateUserPassword);

// update user profile

router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);

// admin route
router
  .route("/admin/users")
  .get(isAuthenticatedUser, isAuthorizedRole("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, isAuthorizedRole("admin"), getSingleUserDetails);

router
  .route("/admin/user/:id")
  .put(isAuthenticatedUser, isAuthorizedRole("admin"), updateUserRole)
  .delete(isAuthenticatedUser, isAuthorizedRole("admin"), deleteUser);

export default router;

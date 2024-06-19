import ErrorHandler from "../utils/error.handler.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/user.model.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// register user
const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "ths is a sample id",
      url: "profilePicUrl",
    },
  });

  sendToken(user, 201, res);
});

// login user
const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // checking if user has given a password and email both
  if (!email || !password) {
    return next(new ErrorHandler("please enter email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid email or password ", 401));
  }

  sendToken(user, 200, res);
});

// logout user

const logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "LOGED OUT SUCCESSFULLY " });
});

// forget password
const forgetPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  // if user not found then
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  // get Reset password Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // now we going to make a link for sending a mail // following link was actually like the local host but we write this way so that fronted dev change it according to their way
  // might be he goin to use https instead of http thats we write req.protocl and write req.get thing ...
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `your password reset toekn is :- \n\n  ${resetPasswordUrl} \n\n if you have not requested this email 
 then, please ignore it `;
  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce password recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully `,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// reset password

const resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
  //token is already been hashed in db model so we took hashed from there

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // by using hashed token we find the user

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  // ager user nahi mila to
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired ",
        400
      )
    );
  }
  // what if we found the user and reset password token was also correct then in that case we just the password token
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("password doesnot match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// user authetication completed

//BACKEND USER ROUTES APIs
// example if someOne wants to check his/ her profle or want to check their profile details /want to cange password or profile pic

// get user details(means kay admin want to check his details )
const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, user });
});

// update user Password

const updateUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password doesnot match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// update user profile

const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  console.log(req.body.name);
  console.log(req.body.email);
  console.log(newUserData);
  // we will add cloidinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true });
});

// now we are going to make admin routes

// let suppse some one is admin of website and he want to see or check how many users create
//their own ids on his website

// get all users
const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

// get single user(admin)
// admin want to chcek users details
const getSingleUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id: ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, user });
});

// what if we want to chnage the role of ..means that if we want to make a them admin
// or we want to chnage the role of admin to user or user to admin

// update user role  admin

const updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true });
});

// delete user -- admin

const deleteUser = catchAsyncError(async (req, res, next) => {
  // 1st we find user
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`user doesnot exist with id:${req.params.id}`, 400)
    );
  }
  //await user.remove();
  await User.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "user deleted successfully " });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateUserProfile,
  getAllUsers,
  getSingleUserDetails,
  updateUserRole,
  deleteUser,
};

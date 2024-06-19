// products ko whohi access ker skta ha jo authenticated ha and login ho
// kuxh sepcific kam wohi ker sakta ha jp login ho to isky liy hum 1 function bnain gy
import ErrorHandler from "../utils/error.handler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";



/*Purpose: Ensures the user is authenticated by checking for a valid token
 in the cookies.
Functionality: Extracts the token, verifies it, retrieves the user from 
the database, and attaches the user object to the request for further processing.
Usage: Protect routes to ensure they can only be accessed by authenticated users,
 often used in combination with role-based access control.*/
const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  // console.log(token)

  if (!token) {
    return next(new ErrorHandler("please login to access this resource ", 401));
  }
  // ager token ha to
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id); // id jo user schema mn jwt token mn use ki hoi wohi id yahn use ki ha

  next();
});


//The isAuthorizedRole middleware function ensures that only users with 
//specific roles can access certain routes. Here's how it works:
const isAuthorizedRole = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access the resource`,
          403
        )
      );
    }

    next();
  };
};

export { isAuthenticatedUser, isAuthorizedRole };

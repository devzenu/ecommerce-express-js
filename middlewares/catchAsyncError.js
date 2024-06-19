const catchAsyncError = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};

// Define the catchAsyncError function
/*const catchAsyncError = (theFunc) => {
    // Return a new function that takes req, res, and next as arguments
    return (req, res, next) => {
      // Call theFunc with req, res, and next, and wrap it in a Promise
      Promise.resolve(theFunc(req, res, next))
        // If theFunc throws an error, catch it and pass it to next middleware
        .catch(next);
    };
  }
  
  // Export it using named export\*/
export { catchAsyncError };

// we use this to handle try catch error q kay hum bar bar try catch lgaty thy to code kafi lengthy and messed up ho jata to 
// is mess say bachny kay liy hum ny above use kia 
// or hum isko middleware mn use kery gy 

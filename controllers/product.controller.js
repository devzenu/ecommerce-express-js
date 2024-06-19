import { Product } from "../models/product.moodel.js";
import ErrorHandler from "../utils/error.handler.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ApiFeatures from "../utils/apiFeatures.js";

//  create product --admin route
const createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// get all product
const getAllProduct = catchAsyncError(async (req, res, next) => {
  //let suppose i have decidided i have to make 5 pages to display products on screen
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apiFeature.query;
  console.log(products);
  res.status(200).json({ success: true, products, productCount });
});

// admin prdoduct
const updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  // if we found the product then do the following
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, product });
});

//delte product
const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  await Product.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "product deleted successfully" });
});

const getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  // if we find the product then wo move further
  res.status(200).json({ success: true, product });
});

// now we going to make the funtion in which user can review about the product

//create new review or update the review
// means kay ager phaly say review dia hva to jub new do gy to previous wala
// hi update ho ker new bun jay ga

const createProductReview = catchAsyncError(async (req, res, next) => {
  // here we going to make an object jo hum pass
  // kerain gy to review ki trah add hojayga

  const { productId, rating, comment } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()

    // review kay ander userId or tumhari id same ha to mtlb kay tumny phaly review ker rlha ha
    // ager ids same nahi dono ki to mtlb kay phaly review apny nahi kia
  );

  //ager paly review horkha ha to to tub btao ..if conditon ager nahi review to else part

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReview = product.reviews.lenth;
  }

  // this rating is that are seprate in the product model ..overall rating thing

  //4,5,5 ,2 =16/4 =4
  let avg = 0;
  product.ratings = product.reviews.forEach((rev) => {
    // avg= avg+rev.rating

    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({ success: true });
});
//get all reviews of product
const getAllProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  res.status(200).json({ success: true, reviews: product.reviews });
});

// delete reviews
const deleteReviews=catchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.query.productId);// this one >> product id 
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
// is mein sary wo reviews hongy jo hum nay delete mahi kerny 
  const reviews =product.reviews.filter(
  (rev)=>rev._id.toString()  !== req.query.id.toString()
)  // this id basic normal id 
let avg=  0
reviews.forEach((rev)=>{avg+=rev.rating})
const ratings = avg/reviews.length

const numOfReviews=reviews.length
await product.findByIdAndUpdate(req.query.productId,{
  reviews,
  ratings,
  numOfReviews
},{
  new:true,
  runValidators:true ,
  useFindAndModify:false  
})

  res.status(200).json({ success: true, })
})
export {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getAllProductReviews,
  deleteReviews
};

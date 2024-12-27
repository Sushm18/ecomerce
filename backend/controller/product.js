const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
// const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require('../multer');
const { listenerCount } = require("../model/user");


// --------------Create Product-------------
router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("REACEHD-1");
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        const files = req.files;
        console.log("REACEHD-2");

        const imageUrls = files.map((file) => `${file.filename}`);

        console.log('---------File Urls------------')
        console.log(req.files)
        console.log(imageUrls, files)
        console.log('------------------------------')

        const productData = req.body;
        productData.images = imageUrls;
        productData.shop = shop;
        const product = await Product.create(productData);


        console.log('---------Product------------')
        console.log(Product)
        console.log('------------------------------')

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


// -------------------Get all product of a Shop----------------------
router.get("/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {

    try {

      let products = await Product.find({ shopId: req.params.id });

      console.log('-------------Get All product-----------------')
      console.log(products)
      console.log('------------------------------')

      res.status(201).json({
        success: true,
        products,
      });
      console.log("product:************************************",products)

      
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


// --------------------------Delete product of a shop---------------------------
router.delete("/delete-shop-product/:id", catchAsyncErrors(async (req, res, next) => {
  try {


    const productId = req.params.id;
    const productData = await Product.findById(productId);

    product.images.forEach((imageUrl)=>{
      const filename = imageUrl;
      const filePath = `uploads/${filename}`

      fs.unlink(filePath, (err) => {
          if (err) {
              console.log(err);
              res.status(500).json({
                  message: "Error deleting file"
              });
          }
      }
    )

  }
  )

  
const product=await Product.findByIdAndDelete(productId);

    if (!product) {
      return next(new ErrorHandler("Product not Found with this id", 500));

    }
    res.status(201).json({
      success: true,
      message: "Product Deleted Successfully"
    })

  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
}))







// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
console.log(products)
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


// --------------------Review for a product-------------------

router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      console.log("review",review)

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);






module.exports = router
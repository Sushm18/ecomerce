
const express = require("express");
const path = require("path");
const { upload } = require('../multer');
const fs = require('fs')
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const sendMail = require("../utils/sendMail");
const sendShopToken = require("../utils/shopToken");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");

router.post('/create-shop', upload.single('file'), async (req, res, next) => {

  try {
    // console.log(req.files)
    const { email } = req.body;

    const sellerEmail = await Shop.findOne({ email });

    // console.log("------------Shop create---------------")
    // console.log(req.body)



    if (sellerEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;


      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Error deleting file"
          });
        }
      });
      return next(new ErrorHandler("Shop already exists", 400));
    }

    const filename = req.file ? req.file.filename : null;
    // const fileUrl = filename ? path.join('uploads', filename) : null;
    const fileUrl='/${filename}'
    // console.log('File Url:', fileUrl);
    // console.log("Address:", req.body.address)
    const seller = ({
      name: req.body.name,
      email: email,
      password: req.body.password,
      avatar: fileUrl,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    });
    // console.log('new-User', seller);
    // console.log('created successfully');
    const activationToken = createActivationToken(seller);
    const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;
    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your Shop",
        message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${seller.email} to activate your shop!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    // console.log("Error:", error.message)
    return next(new ErrorHandler(error.message, 400));
  }
});




const createActivationToken = (seller) => {

  // const payload={
  //   name: seller.name,
  //   email: seller.email,
  //   password: seller.password,
  //   avatar: seller.fileUrl,
  //   address:seller.address,
  //   phoneNumber:seller.phoneNumber,
  //   zipCode:seller.zipCode,
  // }

  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};


router.post("/activation", catchAsyncErrors(async (req, res, next) => {
  try {
    // console.log("JWT Secret Key:", process.env.JWT_SECRET_KEY);

    // console.log('----------------------------------------------')
    // console.log("Received Activation Request");
    const { activation_token } = req.body;

    // console.log('Received activation request:', req.body);
    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    // console.log('Decoded User:', newUser);


    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }

    const { name, email, password, avatar, zipCode,
      phoneNumber, address } = newUser;

    let user = await Shop.findOne({ email });
    // console.log("------newUser-----------------", newUser)
    if (user) {
      return next(new ErrorHandler("User already exists,Please Login to continue", 400));
    }


    user = await Shop.create({
      name,
      email,
      avatar,
      password,
      zipCode,
      phoneNumber,
      address
    });
    sendShopToken(user, 201, res);
  } catch (error) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      return next(new ErrorHandler("Token expired. Please request a new activation token.", 401));
    }
    console.log(error.message)
    return next(new ErrorHandler(error.message, 500));
    // return next(new ErrorHandler(error.message, 500));
  }

}));



// login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // console.log(email, password)


      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendShopToken(user, 201, res);
      // console.log(user)
    } catch (error) {

      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// load shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);
      // console.log("Load seller::", seller)
      if (!seller) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out from shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



// update shop profile picture
router.put(
  "/update-shop-avatar",
  isSeller, upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    console.log("-------------------");
    try {
      const existsUser = await Shop.findById(req.seller._id);

      const existAvatarPath = `uploads/${existsUser.avatar}`;
      console.log('-----------------------------------------')
      console.log("existAvatarPath::" + existAvatarPath)

      fs.unlinkSync(existAvatarPath);

     

      const fileUrl = path.join(req.file.filename);
    

      const user = await Shop.findByIdAndUpdate(req.seller.id, {
        avatar: fileUrl,

      })

      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.log("Avatar error::\n" + error)
      return next(new ErrorHandler(error.message, 500));
    }
  })
)




// update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;
      console.log(description)

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  // isAuthenticated,
  // isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      console.log(sellers)
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only seller
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;







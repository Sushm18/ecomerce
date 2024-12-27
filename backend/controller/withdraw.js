const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Withdraw = require("../model/withdraw");
const sendMail = require("../utils/sendMail");
const router = express.Router();

// create withdraw request --- only for seller
// router.post(
//   "/create-withdraw-request",
//   isSeller,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { amount } = req.body;

//       const data = {
//         seller: req.seller,
//         amount,
//       };

//       try {
//         await sendMail({
//           email: req.seller.email,
//           subject: "Withdraw Request",
//           message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3days to 7days to processing! `,
//         });
//         res.status(201).json({
//           success: true,
          
//         });
//       } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//       }

//       const withdraw = await Withdraw.create(data);

//       const shop = await Shop.findById(req.seller._id);

//       shop.availableBalance = shop.availableBalance - amount;

//       if(shop.availableBalance<0){
//         return next(new ErrorHandler("you can't withdraw this amount,withdraw less", 500)); 
//       }



//       await shop.save();

//       res.status(201).json({
//         success: true,
//         withdraw,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );
router.post(
  "/create-withdraw-request",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { amount } = req.body;

      // Ensure available balance is checked first
      const shop = await Shop.findById(req.seller._id);
      if (shop.availableBalance < amount) {
        return next(new ErrorHandler("You can't withdraw this amount. Withdraw less.", 500));
      }

      // Prepare the data for withdraw request
      const data = {
        seller: req.seller,
        amount,
      };

      // Send notification email
      try {
        await sendMail({
          email: req.seller.email,
          subject: "Withdraw Request",
          message: `Hello ${req.seller.name}, your withdraw request of ${amount}$ is processing. It will take 3 to 7 days for processing.`,
        });
      } catch (error) {
        return next(new ErrorHandler("Email sending failed: " + error.message, 500));
      }

      // Create withdraw request and update shop balance
      const withdraw = await Withdraw.create(data);
      shop.availableBalance -= amount;
      await shop.save();

      // Final response
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);





// get all withdraws --- admnin

router.get(
  "/get-all-withdraw-request",
  // isAuthenticated,
  // isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const withdraws = await Withdraw.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update withdraw request ---- admin
router.put(
  "/update-withdraw-request/:id",
  // isAuthenticated,
  // isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { sellerId } = req.body;

      const withdraw = await Withdraw.findByIdAndUpdate(
        req.params.id,
        {
          status: "succeed",
          updatedAt: Date.now(),
        },
        { new: true }
      );

      const seller = await Shop.findById(sellerId);

      const transection = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };

      seller.transections = [...seller.transections, transection];

      await seller.save();

      try {
        await sendMail({
          email: seller.email,
          subject: "Payment confirmation",
          message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way. Delivery time depends on your bank's rules it usually takes 3days to 7days.`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
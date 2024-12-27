const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const path = require("path");
const { upload } = require('../multer');
const fs = require('fs')

// create event
router.post(
    "/create-event",
    upload.array("images"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            console.log("-------------Event Create-----------")
            const shopId = req.body.shopId;
            console.log(shopId)
            const shop = await Shop.findById(shopId);
            // console.log("shop:",shop)
            if (!shop) {
                return next(new ErrorHandler("Shop Id is invalid!", 400));
            } else {

                const files = req.files;
                
                const imageUrls = files.map((file) => `${file.filename}`)
                console.log('---------------------------');
                 console.log(req.body);
                console.log('---------------------------');

                const eventData = req.body;
                eventData.images = imageUrls;


                eventData.shop = shop;
                // console.log("Event:",eventData);

                const event = await Event.create(eventData);
             
                // console.log("Event:",event)
                console.log("event created")
                res.status(201).json({
                    success: true,
                    event,
                });
             
            }
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// get all events
router.get("/get-all-events", async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(201).json({
            success: true,
            events,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});

// get all events of a shop
router.get(
    "/get-all-events/:id",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const events = await Event.find({ shopId: req.params.id });
  
        console.log(events)

        res.status(201).json({
          success: true,
          events,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );

// delete event of a shop
router.delete(
    "/delete-shop-event/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const productId = req.params.id;
            const eventData = await Event.findById(productId);

            if (!eventData) {
                return next(new ErrorHandler("Event not found with this id !", 500))
            }
            eventData.images.forEach((imageUrl)=>{
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
          
             
const event=await Event.findByIdAndDelete(productId);

if (!event) {
  return next(new ErrorHandler("Product not Found with this id", 500));

}
res.status(201).json({
  success: true,
  message: "Event Deleted Successfully"
})

        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// all events --- for admin
router.get(
    "/admin-all-events",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const events = await Event.find().sort({
                createdAt: -1,
            });
            res.status(201).json({
                success: true,
                events,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

module.exports = router;
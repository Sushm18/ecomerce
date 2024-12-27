const Messages = require("../model/messages");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const router = express.Router();
const { upload } = require('../multer');
// create new message
router.post(
  "/create-new-message",upload.array('images', 5),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messageData = req.body;
console.log(messageData);


      if(req.files){
        console.log("Message Dataa",req.files)
        const files=req.files;
        const imageUrls=files?.map((file)=>`${file.fileName}`);
        messageData.images=imageUrls
        console.log("imageUrls::",imageUrls)
        console.log(messageData.images)
        
      }



      messageData.conversationId = req.body.conversationId;
      // console.log( "messageData.conversationId" )
      messageData.sender = req.body.sender;
      messageData.text = req.body.text;

      const message = new Messages({
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images ? messageData.images : undefined,
      });

      await message.save();
      // console.log("message")

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      console.log(error.message)
      return next(new ErrorHandler(error.message), 500);
    }
  })
);



// get all messages with conversation id
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

module.exports = router;
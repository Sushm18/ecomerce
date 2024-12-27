

const express = require("express");
const path = require("path");
const { upload } = require('../multer');
const fs = require('fs')
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../model/user");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken")
const sendToken = require("../utils/jwtToken");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth")


router.post('/create-user', upload.single('file'), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log('file:', req.file);
    console.log(name, email, password);

    const userEmail = await User.findOne({ email });

    if (userEmail) {
      // if user exist then no need to upload file on server
      const filename = req.file.filename;
      const filePath = `/${filename}`

      fs.unlink(filePath, (err) => {
        console.log(".....unlinked image.....")
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Error deleting file"
          });
        }

      });
      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file ? req.file.filename : null;
    // const fileUrl = filename ? path.join('uploads', filename) : null;
    const fileUrl = filename ? `/${filename}` : null;
    console.log('File Url:', fileUrl);

    // const newUser = await User.create({
    //   name,
    //   email,
    //   password,
    //   avatar: fileUrl,
    // });
    const newUser = {
      name,
      email,
      password,
      avatar: fileUrl,
    };
    console.log('new-User', newUser);

    // send activation email 
    const activationToken = createActivationToken(newUser);
    const activationUrl = `http://localhost:5173/activation/${activationToken}`;
    console.log('Activation URL:\n\n', activationUrl);

    try {
      await sendMail({
        email: newUser.email,
        subject: "Activate your Account",
        message: `Hello ${newUser.name}, please click on the link to activate your account: ${activationUrl}`,
      });

      // Response when email is successfully sent
      res.status(201).json({
        success: true,
        message: `please check your email:-${newUser.email} to activate your account`
      })




    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }

    // res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.log(error)
    return next(new ErrorHandler(error.message, 400));
  }
});


const createActivationToken = (user) => {
  const payload = {
    name: user.name,
    email: user.email,
    password: user.password,
    avatar: user.avatar,
  };
  return jwt.sign(payload, process.env.ACTIVATION_SECRET, {
    expiresIn: '5m',
  });
};
/*
---------Show error-----------
The error you're encountering, Expected "payload" to be a plain object,
 happens because jsonwebtoken.sign() expects the first argument (payload) to be a plain JavaScript object. However, in your createActivationToken function, you are passing the entire user object, which may contain non-plain objects 
such as MongoDB documents that are not serializable as JWT payloads.
 
 const createActivationToken=(user)=>{
     return jwt.sign(user,process.env.ACTIVATION_SECRET,{
         expiresIn:'5m',
     })
 }
*/



// activate 
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
  try {
 
    const { activation_token } = req.body;

    // console.log('Received activation request:', req.body);
    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    // console.log('Decoded User:', newUser);


    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }

    const { name, email, password, avatar } = newUser;

    let user = await User.findOne({ email });
    // console.log("------newUser-----------------",newUser)
    if (user) {
      return next(new ErrorHandler("User already exists,Please Login to continue", 400));
    }


    user = await User.create({
      name,
      email,
      avatar,
      password,
    });
    sendToken(user, 201, res);
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





router.post("/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
// console.log("--------------login data---------------")
//       console.log(req.body)


      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


//   ----------- load user----------
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
console.log("------------user---------",user);
      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// ----------------------log out user-----------------
router.get('/logout', isAuthenticated, catchAsyncErrors(async (req, res, next) => {

  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })

    res.status(201).json({
      success: true,
      message: "Log Out Successfully!"
    });


  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }

}))


// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,upload.single('image'),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existsUser = await User.findById(req.user.id);


      const existAvatarPath = `uploads/${existsUser.avatar}`;
      console.log(existAvatarPath)

      fs.unlinkSync(existAvatarPath);

      const fileUrl = path.join(req.file.filename);

      const user = await User.findByIdAndUpdate(req.user.id, {
        avatar: fileUrl,

      })

      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.log(error.message)
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user infoormation with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// delete users
// all users --- for admin
router.get(
  "/admin-all-users",
  // isAuthenticated,
  // isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete users --- admin
router.delete(
  "/delete-user/:id",
  // isAuthenticated,
  // isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }

    

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);




module.exports = router;

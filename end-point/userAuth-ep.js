// const jwt = require("jsonwebtoken");
// const db = require("../startup/database");
// const asyncHandler = require("express-async-handler");
// // const {
// //   loginUserSchema,
// //   signupUserSchema,
// //   updatePhoneNumberSchema,
// //   signupCheckerSchema,
// //   updateFirstLastNameSchema
// // } = require("../validations/UserAuth-validation");
// const userAuthDao = require("../dao/userAuth-dao");
// const userProfileDao = require("../dao/userAuth-dao");
// const signupDao = require('../dao/userAuth-dao');

// exports.loginUser = async (req, res) => {
//   try {
//     console.log("hi..the sec key is", process.env.JWT_SECRET);
//     // await loginUserSchema.validateAsync(req.body);

//     const phonenumber = req.body.phonenumber;
//     console.log("hi phonenumber", phonenumber);

//     const users = await userAuthDao.loginUser(phonenumber);

//     if (!users || users.length === 0) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     const user = users[0]; // Access the first user in the array

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user.id, phoneNumber: user.phoneNumber },
//       process.env.JWT_SECRET || Tl,
//       {
//         expiresIn: "1h",
//       }
//     );

//     // Return success response
//     res.status(200).json({
//       status: "success",
//       message: "Login successful",
//       token,
//     });
//   } catch (err) {
//     console.error("hi.... Error:", err);
//     if (err.isJoi) {
//       // Validation error
//       return res.status(400).json({
//         status: "error",
//         message: err.details[0].message,
//       });
//     }
//     // Other errors
//     res
//       .status(500)
//       .json({ status: "error", message: "An error occurred during login." });
//   }
// };

// exports.SignupUser = asyncHandler(async (req, res) => {
//   try {
//     // Validate the request body using Joi schema
//     // await signupUserSchema.validateAsync(req.body);

//     const { firstName, lastName, phoneNumber, NICnumber } = req.body;

//     // Format phone number to ensure "+" is added at the start, if not present
//     const formattedPhoneNumber = `+${String(phoneNumber).replace(/^\+/, "")}`;

//     // Check if the phone number already exists in the database
//     const existingUser = await userAuthDao.checkUserByPhoneNumber(
//       formattedPhoneNumber
//     );

//     if (existingUser.length > 0) {
//       return res.status(400).json({
//         message:
//           "This mobile number exists in the database, please try another number!",
//       });
//     }

//     // Insert the new user into the database
//     const result = await userAuthDao.insertUser(
//       firstName,
//       lastName,
//       formattedPhoneNumber,
//       NICnumber
//     );

//     // Send success response if user is registered successfully
//     res.status(200).json({ message: "User registered successfully!", result });
//   } catch (err) {
//     console.error("Error in SignUp:", err);
//     if (err.isJoi) {
//       // Validation error
//       return res.status(400).json({ message: err.details[0].message });
//     }
//     // Other errors
//     res.status(500).json({ message: "Internal Server Error!" });
//   }
// });

// exports.getProfileDetails = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.user.id; // Extract userId from the token
//     console.log("hi..Fetching profile for userId:", userId);

//     // Retrieve user profile from the database using the DAO function
//     const user = await userProfileDao.getUserProfileById(userId);

//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     // Respond with user details
//     res.status(200).json({
//       status: "success",
//       user: user,
//     });
//   } catch (err) {
//     // Handle any errors that occur during the process
//     console.error("Error fetching profile details:", err);
//     res.status(500).json({
//       status: "error",
//       message: "An error occurred while fetching profile details.",
//     });
//   }
// });

// exports.updatePhoneNumber = asyncHandler(async (req, res) => {
//   const userId = req.user.id; // Extract userId from token
//   const { newPhoneNumber } = req.body; // New phone number from request body

//   // Validate the request body
//   // await updatePhoneNumberSchema.validateAsync(req.body);

//   // Call the DAO to update the phone number
//   const results = await userAuthDao.updateUserPhoneNumber(
//     userId,
//     newPhoneNumber
//   );

//   // Check if the update was successful
//   if (results.affectedRows === 0) {
//     return res.status(404).json({
//       status: "error",
//       message: "User not found",
//     });
//   }

//   // Respond with success message
//   return res.status(200).json({
//     status: "success",
//     message: "Phone number updated successfully",
//   });
// });


// exports.signupChecker = asyncHandler(async (req, res) => {
//   try {
//       // Validate the request body
//       // await signupCheckerSchema.validateAsync(req.body);

//       const { phoneNumber, NICnumber } = req.body;

//       // Call the DAO to check if the details exist in the database
//       const results = await signupDao.checkSignupDetails(phoneNumber, NICnumber);

//       let phoneNumberExists = false;
//       let NICnumberExists = false;

//       // Iterate over the results to determine existence of each field
//       results.forEach((user) => {
//           if (user.phoneNumber === `+${String(phoneNumber).replace(/^\+/, "")}`) {
//               phoneNumberExists = true;
//           }
//           if (user.NICnumber === NICnumber) {
//               NICnumberExists = true;
//           }
//       });

//       // Respond based on the existence of the data
//       if (phoneNumberExists && NICnumberExists) {
//           return res.status(200).json({ message: "This Phone Number and NIC already exist." });
//       } else if (phoneNumberExists) {
//           return res.status(200).json({ message: "This Phone Number already exists." });
//       } else if (NICnumberExists) {
//           return res.status(200).json({ message: "This NIC already exists." });
//       }

//       // If no matching records were found, return a success message
//       res.status(200).json({ message: "Both fields are available!" });

//   } catch (err) {
//       console.error("Error in signupChecker:", err);

//       if (err.isJoi) {
//           return res.status(400).json({
//               status: 'error',
//               message: err.details[0].message,
//           });
//       }

//       res.status(500).json({ message: "Internal Server Error!" });
//   }
// });


// exports.updateFirstLastName = asyncHandler(async (req, res) => {
//   try {
//       // Validate the request body
//       const { firstName, lastName } = await updateFirstLastNameSchema.validateAsync(req.body);
//       const userId = req.user.id;

//       // Update first and last name using DAO
//       const affectedRows = await userAuthDao.updateFirstLastName(userId, firstName, lastName);

//       // If no rows were affected, return user not found error
//       if (affectedRows === 0) {
//           return res.status(404).json({
//               status: 'error',
//               message: 'User not found'
//           });
//       }

//       // Successful update
//       return res.status(200).json({
//           status: 'success',
//           message: 'First and last name updated successfully'
//       });
//   } catch (err) {
//       console.error("Error updating first and last name:", err);

//       if (err.isJoi) {
//           return res.status(400).json({
//               status: 'error',
//               message: err.details[0].message,
//           });
//       }

//       res.status(500).json({ error: "Internal Server Error" });
//   }
// });

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const {
  loginUserSchema,
  signupUserSchema,
  updatePhoneNumberSchema,
  signupCheckerSchema,
  updateFirstLastNameSchema,
} = require("../validations/UserAuth-validation");
const userAuthDao = require("../dao/userAuth-dao");

// Login User
exports.loginUser = asyncHandler(async (req, res) => {
  try {
    // Validate request body with Joi
    await loginUserSchema.validateAsync(req.body);

    const { phonenumber } = req.body;

    // Fetch user from the database
    const users = await userAuthDao.loginUser(phonenumber);

    if (!users || users.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    const user = users[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: "1h" }
    );

    // Return success response
    res.status(200).json({
      status: "success",
      message: "Login successful.",
      token,
    });
  } catch (err) {
    console.error("Error during login:", err);

    // Handle Joi validation error
    if (err.isJoi) {
      return res.status(400).json({
        status: "error",
        message: err.details[0].message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "An error occurred during login.",
    });
  }
});

// Signup User
exports.SignupUser = asyncHandler(async (req, res) => {
  try {
    // Validate request body with Joi
    await signupUserSchema.validateAsync(req.body);

    const { firstName, lastName, phoneNumber, NICnumber } = req.body;
    const formattedPhoneNumber = `+${String(phoneNumber).replace(/^\+/, "")}`;

    // Check if phone number already exists
    const existingUser = await userAuthDao.checkUserByPhoneNumber(formattedPhoneNumber);

    if (existingUser.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "This mobile number exists in the database, please try another.",
      });
    }

    // Insert new user into the database
    const result = await userAuthDao.insertUser(firstName, lastName, formattedPhoneNumber, NICnumber);

    res.status(201).json({ status: "success", message: "User registered successfully!", result });
  } catch (err) {
    console.error("Error in SignupUser:", err);

    // Handle Joi validation error
    if (err.isJoi) {
      return res.status(400).json({ status: "error", message: err.details[0].message });
    }

    res.status(500).json({ status: "error", message: "Internal Server Error!" });
  }
});

// Get Profile Details
exports.getProfileDetails = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user profile from database
    const user = await userAuthDao.getUserProfileById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    console.error("Error fetching profile details:", err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching profile details.",
    });
  }
});

// Update Phone Number
exports.updatePhoneNumber = asyncHandler(async (req, res) => {
  try {
    // Validate request body with Joi
    await updatePhoneNumberSchema.validateAsync(req.body);

    const userId = req.user.id;
    const { newPhoneNumber } = req.body;
    const formattedPhoneNumber = `+${String(newPhoneNumber).replace(/^\+/, "")}`;

    // Update phone number in the database
    const results = await userAuthDao.updateUserPhoneNumber(userId, formattedPhoneNumber);

    if (results.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Phone number updated successfully.",
    });
  } catch (err) {
    console.error("Error updating phone number:", err);

    // Handle Joi validation error
    if (err.isJoi) {
      return res.status(400).json({ status: "error", message: err.details[0].message });
    }

    res.status(500).json({ status: "error", message: "Internal Server Error!" });
  }
});

// Signup Checker
exports.signupChecker = asyncHandler(async (req, res) => {
  try {
    // Validate request body with Joi
    await signupCheckerSchema.validateAsync(req.body);

    const { phoneNumber, NICnumber } = req.body;
    const formattedPhoneNumber = phoneNumber ? `+${String(phoneNumber).replace(/^\+/, "")}` : null;

    // Check if phone number or NIC exists in the database
    const results = await userAuthDao.checkSignupDetails(formattedPhoneNumber, NICnumber);
    let phoneNumberExists = false;
    let NICnumberExists = false;

    results.forEach((user) => {
      if (user.phoneNumber === formattedPhoneNumber) {
        phoneNumberExists = true;
      }
      if (user.NICnumber === NICnumber) {
        NICnumberExists = true;
      }
    });

    if (phoneNumberExists && NICnumberExists) {
      return res.status(409).json({ message: "This Phone Number and NIC already exist." });
    } else if (phoneNumberExists) {
      return res.status(409).json({ message: "This Phone Number already exists." });
    } else if (NICnumberExists) {
      return res.status(409).json({ message: "This NIC already exists." });
    }

    res.status(200).json({ message: "Both fields are available!" });
  } catch (err) {
    console.error("Error in signupChecker:", err);

    // Handle Joi validation error
    if (err.isJoi) {
      return res.status(400).json({ status: "error", message: err.details[0].message });
    }

    res.status(500).json({ status: "error", message: "Internal Server Error!" });
  }
});

// Update First and Last Name
exports.updateFirstLastName = asyncHandler(async (req, res) => {
  try {
    // Validate request body with Joi
    await updateFirstLastNameSchema.validateAsync(req.body);

    const { firstName, lastName } = req.body;
    const userId = req.user.id;

    // Update first and last name in the database
    const affectedRows = await userAuthDao.updateFirstLastName(userId, firstName, lastName);

    if (affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "First and last name updated successfully.",
    });
  } catch (err) {
    console.error("Error updating first and last name:", err);

    // Handle Joi validation error
    if (err.isJoi) {
      return res.status(400).json({ status: "error", message: err.details[0].message });
    }

    res.status(500).json({ status: "error", message: "Internal Server Error!" });
  }
});

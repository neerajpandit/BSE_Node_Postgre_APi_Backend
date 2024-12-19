import { query } from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { accessToken, refreshToken } from "../middlewares/authMiddleware.js";
import { deleteUserProfileService, getAllUserProfileService, getUserProfileByIdService, logoutUserProfileService, updateUserProfileService } from "../models/userprofileModel.js";
import { handleResponse } from "../middlewares/responseHandler.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import errorHandling from "../middlewares/errorHandler.js";
import { ApiError } from "../middlewares/ApiError.js";

// Standardized response function
// const handleResponse = (res, status, message, data = null) => {
//     res.status(status).json({
//       status,
//       message,
//       data,
//     });
//   };


export const sendOtpForAuth = async (req, res) => {
    const { phone_no } = req.body;
    
    try {
      // Check if phone number exists
      const user = await pool.query(
        "SELECT id, verify_phone FROM userprofiles WHERE phone_no = $1",
        [phone_no]
      );
      
  
      const phoneOtp ="1234";// generateOtp(); // Generate a random 6-digit OTP
  
      if (user.rows.length === 0) {
        console.log("register");
        
        // Register case
        await pool.query(
          "INSERT INTO userprofiles (phone_no, phone_otp) VALUES ($1, $2)",
          [phone_no, phoneOtp]
        );
  
        //await sendOtp(phone_no, phoneOtp); // Send OTP via SMS
        return res
          .status(200)
          .json({ message: `OTP sent for registration.${phoneOtp}`, type: "register" });
      } else {
        console.log("its login");
        
        // Login case
        await pool.query(
          "UPDATE userprofiles SET phone_otp = $1 WHERE phone_no = $2",
          [phoneOtp, phone_no]
        );
  
        //await sendOtp(phone_no, phoneOtp); // Send OTP via SMS
        return res
          .status(200)
          .json({ message: `OTP sent for login.${phoneOtp,phone_no}`, type: "login" });
      }
    } catch (error) {
      console.error("Error in sendOtpForAuth:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const verifyOtp = async(req,res)=>{
    const {phone_otp,phone_no} = req.body;
    try {
        const user= await pool.query("SELECT id,phone_otp,verify_phone FROM userprofiles WHERE phone_no=$1",[phone_no]);
        if(user.rows.length == 0){
            return res.status(404).json({ message: "Phone number not found." });
        }
        const { id, phone_otp: savedOtp, verify_phone } = user.rows[0];

        if (savedOtp !== phone_otp) {
        return res.status(400).json({ message: "Invalid OTP." });
        }
        

        // const accessToken = jwt.sign({ userId: id, phone_no }, process.env.JWT_SECRET, {
        //     expiresIn: "15m",
        //   });
        //   const refreshToken = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
        //     expiresIn: "7d",
        //   });
        // accessToken(id,phone_no);
        // refreshToken(id,phone_no);
        const accesstoken = await accessToken(id, phone_no); // Use await to resolve the Promise
        const refreshtoken = await refreshToken(id);
        // console.log("Generated Refresh Token:", refreshtoken);
         // Optionally save the refresh token in the database
        await pool.query("UPDATE userprofiles SET refresh_token = $1 WHERE id = $2", [
        refreshtoken,
        id,
      ]);
      await pool.query("UPDATE userprofiles SET verify_phone= TRUE, phone_otp=NULL WHERE id =$1",[id])
      // Set tokens as cookies
      res.cookie("accessToken", accesstoken, {
        httpOnly: true, // Secure and only accessible via HTTP
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        maxAge: 1*24*60 * 60 * 1000, // 15 minutes
      });
  
      res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.set({
        'accessToken': accesstoken,
        'refreshToken': refreshtoken,
      })
  
      // Send tokens in the response as well
      return res.status(200).json({
        message: "Authentication successful.",
        accesstoken,
        refreshtoken,
      });
    } catch (error) {
        console.error("Error in verifyOtp:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAllUserProfile = async(req,res,next)=>{
    try {
        const users = await getAllUserProfileService(req.params.id)
        handleResponse(res, 200, "Users fetched successfully", users);
        
    } catch (error) {
        next(err);
    }
}
 
export const getUserProfileByID =async(req,res,next)=>{
    try {
        const user = await getUserProfileByIdService(req.params.id)
        handleResponse(res,200,"User fetched successfully",user);
    } catch (error) {
        next(error)
    }
}

export const updateUserProfile =async(req,res,next)=>{
  const { phone_no, email, img_url, kycStatus } = req.body;
  console.log(req.userId);
  
  const updatedUser = await updateUserProfileService(req.userId,phone_no,email,img_url,kycStatus)
  if (!updatedUser) return handleResponse(res, 404, "User not found");
  handleResponse(res, 200, "User updated successfully", updatedUser);
}

export const logoutUserProfile = async (req, res, next) => {
  try {
    console.log("logout", req.userId);

    // Perform any required actions for logout, such as updating the user session in the database
    const user = await logoutUserProfileService(req.userId);
    // console.log(user);

    if (!user) return handleResponse(res, 404, "User Not Found");

    // Clear cookies
    const options = {
      httpOnly: true,
      secure: true, // Ensure this is used in production with HTTPS
      sameSite: "strict", // Helps mitigate CSRF
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    // Optionally clear authorization headers
    res.setHeader("Authorization", "");

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    next(error); // Pass the error to the global error handler
  }
};

export const deleteUserProfile = async(req,res,next)=>{
  try {
    const user = await deleteUserProfileService(req.params.id);
    handleResponse(res,200,"User Deleted Successfully",user)
  } catch (error) {
    next(error)
  }
}

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request: Refresh token is missing");
  }

  try {
    // Verify the incoming refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_SECRET
    );

    // Fetch the user from the database
    const result = await pool.query(
      "SELECT id, refresh_token FROM userprofiles WHERE id = $1",
      [decodedToken.userId]
    );

    if (result.rowCount === 0) {
      throw new ApiError(401, "Invalid refresh token: User not found");
    }

    const user = result.rows[0];

    // Compare the stored refresh token with the incoming token
    if (incomingRefreshToken !== user.refresh_token) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    // Generate new tokens
    // const { accessToken, refreshToken: newRefreshToken } =
    //   await generateAccessAndRefereshTokens(user.id);
      const newAccessToken = await accessToken(user.id, user.phone_no); // Use await to resolve the Promise
      const newRefreshToken = await refreshToken(user.id);

      
    // Update the new refresh token in the database
    await pool.query(
      "UPDATE userprofiles SET refresh_token = $1 WHERE id = $2",
      [newRefreshToken, user.id]
    );

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: true, // Ensure secure cookies in production
      sameSite: "Strict",
    };

    // Send response with new tokens
    return res.status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        handleResponse(res,
          200,
          {newAccessToken,newRefreshToken},
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


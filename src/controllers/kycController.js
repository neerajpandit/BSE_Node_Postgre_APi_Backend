import pool from "../config/db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { handleResponse } from "../middlewares/responseHandler.js";
import { createKycDetailsService } from "../models/kycModel.js";


export const createKycDetails = asyncHandler(async(req,res,next)=>{
    const userId = req.userId;
    if (!userId) {
        throw new ApiError(404, " Userid not found", error);
    }
    const {pan_exempt,pan_number,kyc_type,kyc_status} = req.body;
    if (!pan_number) {
       throw new ApiError(404, " pan_no not found", error);
    }

    const kycdetails = await createKycDetailsService(userId,pan_exempt,pan_number,kyc_type,kyc_status);
    if (!kycdetails) {
        throw new ApiError(404, "Error in kyc creation found", error);
    }
    handleResponse(res,200,"KycDetails Successfully",kycdetails)

})
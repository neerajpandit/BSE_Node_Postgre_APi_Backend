import pool from "../config/db.js";
import { ApiError } from "../middlewares/ApiError.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { handleResponse } from "../middlewares/responseHandler.js";
import { createAddressService } from "../models/addressModel.js";



export const createAddress = asyncHandler(async(req,res,next)=>{
    console.log("it AddAddress");
    const userId = req.userId;
    if(!userId){throw new ApiError(404, " Userid not found", error);
        
    }
    const {add1,add2,add3,city,state,pincode,country}=req.body;
    if(!add1 && !city && !state && !pincode && !country ){
        return handleResponse(res, 404, "Address Some Field Missing");
    }
    const address = await createAddressService(userId,add1,add2,add3,city,state,pincode,country);
    if(!address){
        throw new ApiError(404, " Address not found");
    }
    handleResponse(res, 200, "Nominee Addedd Successfully", address);
})
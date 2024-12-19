import pool from "../config/db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiError } from "../middlewares/ApiError.js";
import { handleResponse } from "../middlewares/responseHandler.js";
import {
  getAllNomineeService,
  getNomineeByIdService,
  nomineeCreateService,
  nomineeDeleteService,
  nomineeUpdateService,
} from "../models/nomineeModel.js";

export const addNominee = asyncHandler(async (req, res, next) => {
  //   try {
  const {
    nominee_name,
    nominee_relationship,
    nominee_applicable_percent,
    minor_flag,
    nominee_dob,
    nominee_guardian_name,
  } = req.body;

  // Check minor conditions
  if (minor_flag === "Y" && (!nominee_dob || !nominee_guardian_name)) {
    return res.status(400).json({
      message: "Nominee DOB and Guardian are mandatory if minor flag is Y",
    });
  }
  console.log("Its Nominee Controller", req.body);

  const nominee = await nomineeCreateService(
    req.userId,
    nominee_name,
    nominee_relationship,
    nominee_applicable_percent,
    minor_flag,
    nominee_dob,
    nominee_guardian_name
  );
  // console.log(nominee);

  if (!nominee) {
    throw new ApiError(404, "Bank Not found");
  }
  handleResponse(res, 200, "Nominee Addedd Successfully", nominee);
  //   } catch (error) {
  //     next()
  //     // throw new ApiError(404, "Error in Create Bank Details", error);
  //   }
});

export const getAllNominee = asyncHandler(async (req, res, next) => {
  const nominee = await getAllNomineeService(req.userId);
  if (!nominee) {
    throw new ApiError(404, "Nominee Not found");
  }
  handleResponse(res, 200, "Nominee Fetched Succefully", nominee);
});

export const getNomineeById = asyncHandler(async (req, res, next) => {
  const nominee = await getNomineeByIdService(req.userId, req.params.id);
  if (!nominee) {
    throw new ApiError(404, "Nominee Not found");
  }
  handleResponse(res, 200, "Nominee Fetched Succefully", nominee);
});

export const updateNomineeById = asyncHandler(async (req, res, next) => {
  const {
    nominee_name,
    nominee_relationship,
    nominee_applicable_percent,
    minor_flag,
    nominee_dob,
    nominee_guardian,
  } = req.body;

  // Check minor conditions
  if (minor_flag === "Y" && (!nominee_dob || !nominee_guardian)) {
    return res.status(400).json({
      message: "Nominee DOB and Guardian are mandatory if minor flag is Y",
    });
  }

  const updatenominee = await nomineeUpdateService(
    req.params.id,
    req.userId,
    nominee_name,
    nominee_relationship,
    nominee_applicable_percent,
    minor_flag,
    nominee_dob,
    nominee_guardian
  );
  if (!updatenominee) {
    throw new ApiError(404, "Nominee Not found Update");
  }
  handleResponse(res, 200, "Nominee Updated Succefully", updatenominee);
});

export const deleteNominee = asyncHandler(async (req, res, next) => {
  const deletenominee = await nomineeDeleteService(req.params.id, req.userId);
  if (!deletenominee) {
    throw new ApiError(404, "Nominee  Not found");
  }
  handleResponse(res, 200, "Nominee Delete Successfully", deletenominee);
});

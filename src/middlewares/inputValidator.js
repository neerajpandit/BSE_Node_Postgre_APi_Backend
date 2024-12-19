import Joi from "joi";

const phoneOtpScheme = Joi.object({
  // phone_no: Joi.string().min(10).required(),
  // phone_otp: Joi.string().min(4),
  phone_no: Joi.string().length(10).required().messages({
    'string.base': 'Phone number must be a string.',
    'string.min': 'Phone number must have at least 10 digits.',
    'any.required': 'Phone number is required.',
  }),

  phone_otp: Joi.string().length(4).messages({
    'string.base': 'OTP must be a string.',
    'string.min': 'OTP must have at least 4 characters.',
  }),
  
});


export const validatePhoneOtp = (req, res, next) => {
  const { error } = phoneOtpScheme.validate(req.body);
  if (error)
    return res.status(400).json({ 
      message: error.details[0].message,
    });
  next();
};


const nomineeSchema = Joi.object({
  nominee_name: Joi.string().min(3).max(40).required(),
  nominee_relationship: Joi.string().min(1).max(40).required(),
  nominee_applicable_percent: Joi.number().min(0).max(100).precision(2).required(),
  minor_flag: Joi.string().valid('Y', 'N').required()
});

export const validateNominee =(req,res,next)=>{
  const {error} = nomineeSchema.validate(req.body);
  if (error)
    return res.status(400).json({ 
    message: error.details[0].message,
  });
next();
}


const addressSchema= Joi.object({
  add1: Joi.string().min(3).max(40).required(),
  add2: Joi.string().min(3).max(40).allow(''),
  add3: Joi.string().min(3).max(40).allow(''),
  city: Joi.string().min(2).max(35).required(),
  state: Joi.string().length(2).required(),
  pincode: Joi.string().length(6).required(),
  country: Joi.string().min(2).max(35).required(),
});

export const validateAddress =(req,res,next)=>{
  const {error} = addressSchema.validate(req.body);
  if (error)
    return res.status(400).json({ 
    message: error.details[0].message,
  });
next();
}

const bankSchema=Joi.object({
    account_no: Joi.string().max(40).pattern(/^\d+$/).required().messages({
      'string.base': 'Account number must be a string of digits.',
      'string.max': 'Account number cannot exceed 40 digits.',
      'any.required': 'Account number is required.'
    }),

    account_type: Joi.string().valid('SB', 'CA', 'SB/CA').required().messages({
      'any.only': 'Account type must be either "SB" (Savings) or "CA" (Current).',
      'any.required': 'Account type is required.'
    }),

    micr_no: Joi.string().max(9).allow('', null).messages({
      'string.base': 'MICR number must be a string if provided.',
      'string.max': 'MICR number cannot exceed 9 characters.',
    }),

    ifsc_code: Joi.string().length(11).pattern(/^[A-Za-z]{4}\d{7}$/).required().messages({
      'string.length': 'IFSC code must be exactly 11 characters.',
      'string.pattern.base': 'IFSC code must follow the format: XXXX1234567.',
      'any.required': 'IFSC code is required.'
    }),

    default_bank_flag: Joi.string().valid('Y', 'N').required().messages({
      'any.only': 'Default bank flag must be "Y" or "N".',
      'any.required': 'Default bank flag is required.'
    })  
  });

export const validateBank =(req,res,next)=>{
  const {error} = bankSchema.validate(req.body);
  if (error)
    return res.status(400).json({ 
    message: error.details[0].message,
  });
next();
}


const panNumberSchema = Joi.object({
  pan_number: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .length(10)
    .required()
    .messages({
      'string.pattern.base': 'Invalid PAN format. It should follow the pattern: XXXXX9999X.',
      'string.length': 'PAN number must be exactly 10 characters long.',
      'string.empty': 'PAN number cannot be empty.',
      'any.required': 'PAN number is required.'
    }),
    kyc_type:Joi.string().valid('K', 'C', 'B','E').required()
});

export const validatePan =(req,res,next)=>{
  const {error} = panNumberSchema.validate(req.body);
  if (error)
    return res.status(400).json({ 
    message: error.details[0].message,
  });
next();
}


const uccProfileSchema = Joi.object({
  client_id: Joi.string().min(5).max(10).required().messages({
    'string.min': 'Client ID must be exactly 7 characters long.',
    'string.max': 'Client ID must be exactly 7 characters long.',
    'any.required': 'Client ID is required.',
  }),
  
  first_name: Joi.string().min(3).max(70).required().messages({
    'string.min': 'First name must be at least 3 characters long.',
    'string.max': 'First name must be at most 70 characters long.',
    'any.required': 'First name is required.',
  }),
  
  last_name: Joi.string().min(3).max(70).required().messages({
    'string.min': 'Last name must be at least 3 characters long.',
    'string.max': 'Last name must be at most 70 characters long.',
    'any.required': 'Last name is required.',
  }),
  
  tax_status: Joi.string().valid('01', '02', '03').required().messages({
    'any.only': 'Tax status must be one of the following: 01, 02, or 03.',
    'any.required': 'Tax status is required.',
  }),
  
  gender: Joi.string().valid('M', 'F').required().messages({
    'any.only': 'Gender must be either M (Male) or F (Female).',
    'any.required': 'Gender is required.',
  }),
  
  dob: Joi.string().pattern(/^(\d{2})\/(\d{2})\/(\d{4})$/).required().messages({
    'date.format': 'Date of birth must be in YYYY-MM-DD format.',
    'any.required': 'Date of birth is required.',
  }),
  
  occupation: Joi.string().valid('01', '02', '03', '04').required().messages({
    'any.only': 'Occupation must be one of the following: 01, 02, 03, or 04.',
    'any.required': 'Occupation is required.',
  }),
  
  holding_nature: Joi.string().valid('SI', 'JO', 'SO').required().messages({
    'any.only': 'Holding nature must be one of the following: SI, JO, or SO.',
    'any.required': 'Holding nature is required.',
  }),
  
  communication_mode: Joi.string().valid('E', 'P').required().messages({
    'any.only': 'Communication mode must be either E (Email) or P (Post).',
    'any.required': 'Communication mode is required.',
  }),
  
  nomination_opt: Joi.string().valid('Y', 'N').required().messages({
    'any.only': 'Nomination option must be either Y (Yes) or N (No).',
    'any.required': 'Nomination option is required.',
  })
});

export const validateuccProfile =(req,res,next)=>{
  const {error} = uccProfileSchema.validate(req.body);
  if (error)
    return res.status(400).json({ 
    message: error.details[0].message,
  });
next();
}
import pool from "../config/db.js";
import { ApiError } from "../middlewares/ApiError.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { handleResponse } from "../middlewares/responseHandler.js";
import { uccProfileCreateService } from "../models/uccprofileModel.js";
import { uccRegisterService } from "../models/uccregisterModel.js";
import axios from 'axios';


export const uccRegister = asyncHandler(async(req,res,next)=>{
    const userId = req.userId;
    const { RegistrationType } = req.body;
    const data= await uccRegisterService(userId);

    const UserId = process.env.UserId;
    const MemberCode =process.env.MemberCode;
    const Password = process.env.Password;
    //const Param1 = `data.ucccode|data.firstname||data.lastname|data.taxstatus|data.gender|01/01/1970|data.occupationcode|data.holdingnature|||||||||||||data.panexampt||||data.pannumber||||||||data.clienttype||||||||data.accounttype|data.accountnumber||data.ifsccode|data.defaultbankflag|||||||||||||||||||||FirstNameLastName|data.divpaymode|data.address1|||data.city|data.state|data.pincode|data.country|||||data.email|data.comunicationmode||||||||||||data.phonenumber|data.nomineename1|data.nomineerelationship1|data.nomineepercentage1|data.nomineeminorflag1|||||||||||||||K||||||||||||data.adhaarupdated||data.paperlessflag|||data.phoneflag|data.emailflag|data.nominationopt|data.nominationauthmode||||||||||||||||||`;
    const Param = `${data.ucccode}|${data.firstname}||${data.lastname}|${data.taxstatus}|${data.gender}|01/01/1970|${data.occupationcode}|${data.holdingnature}|||||||||||||${data.panexampt}||||${data.pannumber}||||||||${data.clienttype}||||||||${data.accounttype}|${data.accountnumber}||${data.ifsccode}|${data.defaultbankflag}|||||||||||||||||||||FirstNameLastName|${data.divpaymode}|${data.address1}|||${data.city}|${data.state}|${data.pincode}|${data.country}|||||${data.email}|${data.comunicationmode}||||||||||||${data.phonenumber}|${data.nomineename1}|${data.nomineerelationship1}|${data.nomineepercentage1}|${data.nomineeminorflag1}|||||||||||||||K||||||||||||${data.adhaarupdated}||${data.paperlessflag}|||${data.phoneflag}|${data.emailflag}|${data.nominationopt}|${data.nominationauthmode}||||||||||||||||||`;

    // Check if all required fields are present
    if (!UserId || !MemberCode || !Password || !RegistrationType || !Param) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        //Make the external API request
        const response = await axios.post(process.env.uccRegister_API_URL, {
            UserId,
            MemberCode,
            Password,
            RegnType: RegistrationType,
            Param,
            Filler1: '',
            Filler2: '',
        });

        // Save request and response in PostgreSQL
        const query = `
            INSERT INTO uccregister (user_id,admin_userid, adminmembercode, admin_password, regntype, param, response_status, response_remarks)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
        `;
        const values = [
            userId,
            UserId,
            MemberCode,
            Password,
            RegistrationType,
            Param,
            response.data.Status||'',
            response.data.Remarks||'',
        ];

        const result = await pool.query(query, values);

        // Respond back with the result
        res.json({
            status: 'success',
            message: 'Request processed successfully',
            response: response.data,
            db_id: result.rows[0].id,
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})




export const uccProfileCreate = asyncHandler(async(req,res,next)=>{
    const userId = req.userId;
    if (!userId) {
        throw new ApiError(404," User Not found")
    }
    const {client_id,first_name,last_name,tax_status,gender,dob,occupation,holding_nature,communication_mode,nomination_opt} = req.body;
    if (!client_id && !first_name && !last_name && !tax_status && !gender && !dob && !occupation && !holding_nature && !communication_mode && !nomination_opt) {
        throw new ApiError(404,"All Field are required")
    }
    const uccProfile = await uccProfileCreateService(userId,client_id,first_name,last_name,tax_status,gender,dob,occupation,holding_nature,communication_mode,nomination_opt)
    console.log(uccProfile);
    
    if (!uccProfile) {
        throw new ApiError(400,"Some Error to Create uccProfile")
    }
    handleResponse(res,200,"uccProfile Create Successfully",uccProfile)
})

export const allData = asyncHandler(async(req,res,next)=>{
    const userId = req.userId;

        const query = `
            SELECT 
                up.id AS UserID,
                up.phone_no AS PhoneNumber,
                up.email AS Email,
                ucc.client_id AS UCCCode,
                ucc.phone_declaration_flag AS phoneFlag,
                ucc.email_declaration_flag AS emailFlag,
                ucc.primary_holder_first_name AS FirstName,
                ucc.primary_holder_middle_name AS MiddleName,
                ucc.primary_holder_last_name AS LastName,
                ucc.tax_status AS TaxStatus,
                ucc.gender AS Gender,
                ucc.primary_holder_dob AS DOB,
                ucc.occupation AS OccupationCode,
                ucc.holding_nature AS HoldingNature,
                ucc.communication_mode AS ComunicationMode,
                ucc.nomination_opt AS NominationOpt,
                ucc.nomination_auth_mode AS NominationauthMode,
                ucc.client_type AS ClientType,
                bnk.account_type AS AccountType,
                bnk.account_no AS AccountNumber,
                bnk.ifsc_code AS IFSCCode,
                bnk.default_bank_flag AS DefaultBankFlag,
                bnk.divind_pay_mode AS DivPayMode,
                addr.address_1 AS Address1,
                addr.city AS City,
                addr.state AS State,
                addr.pincode AS Pincode,
                addr.country AS Country,
                nom.nominee_name AS NomineeName1,
                nom.nominee_relationship AS NomineeRelationship1,
                nom.nominee_applicable_percent AS NomineePercentage1,
                nom.minor_flag AS NomineeMinorFlag1,
                kyc.kyc_type AS KycType,
                kyc.pan_exempt AS PANExampt,
                kyc.pan_number AS PANNumber,
                kyc.aadhaar_updated AS adhaarupdated,
                kyc.paperless_flag AS paperlessFlag
            FROM 
                UserProfiles up
            LEFT JOIN 
                uccProfiles ucc ON up.id = ucc.user_id
            LEFT JOIN 
                BankDetails bnk ON up.id = bnk.user_id
            LEFT JOIN 
                Addresses addr ON up.id = addr.user_id
            LEFT JOIN 
                NomineeDetails nom ON up.id = nom.user_id
            LEFT JOIN 
                KYCDetails kyc ON up.id = kyc.user_id;

        `;
    
        try {
            const { rows } = await pool.query(query);
    
            const paramFields = rows.map(data => ({
                UCCCode: data.ucccode || "",
                FirstName: data.firstname || "",
                MiddleName: data.middlename || "",
                LastName: data.lastname || "",
                TaxStatus: data.taxstatus || "",
                Gender: data.gender || "",
                DOB: data.dob || "",
                OccupationCode: data.occupationcode || "",
                HoldingNature: data.holdingnature || "",
                AccountNumber: data.accountnumber || "",
                IFSCCode: data.ifsccode || "",
                DefaultBankFlag: data.defaultbankflag || "",
                Address1: data.address1 || "",
                City: data.city || "",
                State: data.state || "",
                Pincode: data.pincode || "",
                Country: data.country || "",
                PhoneNumber: data.phonenumber || "",
                Email: data.email || "",
                NomineeName1: data.nomineename1 || "",
                NomineeRelationship1: data.nomineerelationship1 || "",
                NomineePercentage1: data.nomineepercentage1 || "",
                NomineeMinorFlag1: data.nomineeminorflag1 || "",
                NomineeDOB1: data.nomineedob1 || "",
                PANNumber: data.pannumber || "",
                KYCStatus: data.kycstatus || "",
            }));
            // const param = paramFields.join("|");
            // console.log("hi",rows.rows[0]);
            // console.log("Hello",rows[0]);
            const param= await uccRegisterService(userId);
            console.log(param);
            // console.log(param.nomineename1);
            
            
            
            
    
            return paramFields;
        } catch (error) {
            console.error('Error fetching user data:', error.stack);
            throw error;
        }
    
})
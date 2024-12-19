import pool from "../config/db.js";
import { ApiError } from "../middlewares/ApiError.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { handleResponse } from "../middlewares/responseHandler.js";
import { createBankDetailsService, getBankDetailsService,deleteBankDetailsService } from "../models/bankdetailsModel.js";

export const createBankDetails = asyncHandler(async (req, res,next) => {
//   try {
    // console.log("Hi Its Bank Create");

    const userId = req.userId;
    // console.log(userId);
    const { account_no, account_type, micr_code, ifsc_code, default_bank_flag } =
      req.body;
    if (!account_no && !account_type && !ifsc_code && !default_bank_flag) {
      //throw new ApiError(400, "Bank all field required");
      return handleResponse(res, 404, "Bank Field Missing");
    }
    const newbank = await createBankDetailsService(
      userId,
      account_no,
      account_type,
      micr_code,
      ifsc_code,
      default_bank_flag
    );
    if (!newbank) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "Bank Data Addedd Successfully", newbank);
//   } catch (error) {
//     throw new ApiError(404, "Error in Create Bank Details", error);
//   }
});

export const getBankDetails = asyncHandler(async(req,res,next)=>{
    try {
        const userBankDetails = await getBankDetailsService(req.userId)
        if(!userBankDetails){
            throw new ApiError(404, " Bank Details not found", error);
        }
        handleResponse(res, 200, "Users fetched successfully", userBankDetails);
    } catch (error) {
        throw new ApiError(404, "Error in fetch Bank Details", error);
    }
})

export const deleteBankDetails = asyncHandler(async(req,res,next)=>{
    const deletebankdetails = await deleteBankDetailsService(req.params.id)
    if (!deletebankdetails) {
        throw new ApiError(404,"Bank Not found");
    }
    handleResponse(res,200,"Bank Details Deleted Successfully",deletebankdetails)
})

export const updateBankDetails = asyncHandler(async(req,res,next)=>{
    const { id } = req.params; // BankDetails ID to update
    const { account_no, account_type, micr_code, ifsc_code, default_bank_flag } = req.body; // Data to update

    try {
        // Update query with dynamic fields
        const query = `
            UPDATE BankDetails 
            SET 
                account_no = COALESCE($1, account_no),
                account_type = COALESCE($2, account_type),
                micr_code = COALESCE($3, micr_code),
                ifsc_code = COALESCE($4, ifsc_code),
                default_bank_flag = COALESCE($5, default_bank_flag),
                updated_at = NOW()
            WHERE id = $6 
            RETURNING *;
        `;

        const values = [account_no, account_type, micr_code, ifsc_code, default_bank, id];
        
        // Execute query
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Bank details not found." });
        }

        return res.status(200).json({
            message: "Bank details updated successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating bank details:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})









// const paramFields = [
//     data.UCCCode || "",                     // UCC Code
//     data.FirstName || "",                   // First Name
//     data.MiddleName || "",                  // Middle Name
//     data.LastName || "",                    // Last Name
//     data.TaxStatus || "",                   // Tax Status
//     data.Gender || "",                      // Gender
//     data.DOB || "",                         // Date of Birth
//     data.OccupationCode || "",              // Occupation Code
//     data.HoldingNature || "",               // Holding Nature
//     data.SecondHolderFirstName || "",       // Second Holder First Name
//     data.SecondHolderMiddleName || "",      // Second Holder Middle Name
//     data.SecondHolderLastName || "",        // Second Holder Last Name
//     data.SecondHolderDOB || "",             // Second Holder DOB
//     data.GuardianFirstName || "",           // Guardian First Name
//     data.GuardianMiddleName || "",          // Guardian Middle Name
//     data.GuardianLastName || "",            // Guardian Last Name
//     data.PANExemptFlag || "",               // PAN Exempt Flag
//     data.PANNumber || "",                   // PAN Number
//     data.SecondHolderPANExempt || "",       // Second Holder PAN Exempt
//     data.SecondHolderPAN || "",             // Second Holder PAN
//     data.ThirdHolderPANExempt || "",        // Third Holder PAN Exempt
//     data.ThirdHolderPAN || "",              // Third Holder PAN
//     data.GuardianPANExempt || "",           // Guardian PAN Exempt
//     data.GuardianPAN || "",                 // Guardian PAN
//     data.ClientType || "",                  // Client Type
//     data.AccountType || "",                 // Account Type
//     data.AccountNumber || "",               // Account Number
//     data.IFSCCode || "",                    // IFSC Code
//     data.DefaultBankFlag || "",             // Default Bank Flag
//     data.Address1 || "",                    // Address 1
//     data.Address2 || "",                    // Address 2
//     data.Address3 || "",                    // Address 3
//     data.City || "",                        // City
//     data.State || "",                       // State
//     data.Pincode || "",                     // Pincode
//     data.Country || "",                     // Country
//     data.PhoneNumber || "",                 // Phone Number
//     data.Email || "",                       // Email
//     data.CommunicationMode || "",           // Communication Mode
//     data.MobileNumber || "",                // Mobile Number
//     data.NomineeName1 || "",                // Nominee Name 1
//     data.NomineeRelationship1 || "",        // Nominee Relationship 1
//     data.NomineePercentage1 || "",          // Nominee Percentage 1
//     data.NomineeMinorFlag1 || "",           // Nominee Minor Flag 1
//     data.NomineeDOB1 || "",                 // Nominee DOB 1
//     data.NomineeGuardian1 || "",            // Nominee Guardian 1
//     data.NomineePAN1 || "",                 // Nominee PAN 1
//     data.NomineeGuardianPAN1 || "",         // Nominee Guardian PAN 1
//     data.NomineeName2 || "",                // Nominee Name 2
//     data.NomineeRelationship2 || "",        // Nominee Relationship 2
//     data.NomineePercentage2 || "",          // Nominee Percentage 2
//     data.NomineeMinorFlag2 || "",           // Nominee Minor Flag 2
//     data.NomineeDOB2 || "",                 // Nominee DOB 2
//     data.NomineeGuardian2 || "",            // Nominee Guardian 2
//     data.NomineePAN2 || "",                 // Nominee PAN 2
//     data.NomineeGuardianPAN2 || "",         // Nominee Guardian PAN 2
//     data.NomineeName3 || "",                // Nominee Name 3
//     data.NomineeRelationship3 || "",        // Nominee Relationship 3
//     data.NomineePercentage3 || "",          // Nominee Percentage 3
//     data.NomineeMinorFlag3 || "",           // Nominee Minor Flag 3
//     data.NomineeDOB3 || "",                 // Nominee DOB 3
//     data.NomineeGuardian3 || "",            // Nominee Guardian 3
//     data.NomineePAN3 || "",                 // Nominee PAN 3
//     data.NomineeGuardianPAN3 || "",         // Nominee Guardian PAN 3
//     data.SecondHolderEmail || "",           // Second Holder Email
//     data.SecondHolderMobileNo || "",        // Second Holder Mobile Number
//     data.ThirdHolderEmail || "",            // Third Holder Email
//     data.ThirdHolderMobileNo || "",         // Third Holder Mobile Number
//     data.GuardianRelationship || "",        // Guardian Relationship
//     data.KYCFlag || "",                     // KYC Flag
//     data.KYCStatus || "",                   // KYC Status
//     data.InvestorCategory || "",            // Investor Category
//     data.MaritalStatus || "",               // Marital Status
//     data.FatcaFlag || "",                   // FATCA Flag
//     data.USPerson || "",                    // US Person
//     data.PoliticallyExposed || "",          // Politically Exposed
//     data.Citizenship || "",                 // Citizenship
//     data.Nationality || "",                 // Nationality
//     data.Residence || "",                   // Residence
//     data.IncomeSlab || "",                  // Income Slab
//     data.MinorFlag || "",                   // Minor Flag
//     data.Occupation || "",                  // Occupation
//     data.SourceOfWealth || "",              // Source of Wealth
//     data.CountryOfBirth || "",              // Country of Birth
//     data.PlaceOfBirth || "",                // Place of Birth
//     data.Education || "",                   // Education
//     data.IsIndian || "",                    // Is Indian
//     data.PreferredLanguage || "",           // Preferred Language
//     data.FinancialAdvisorCode || "",        // Financial Advisor Code
//     data.BrokerCode || "",                  // Broker Code
//     data.AgentARN || "",                    // Agent ARN
//     data.NomineeOptOutFlag || "",           // Nominee Opt-Out Flag
//     data.BankName || "",                    // Bank Name
//     data.BranchName || "",                  // Branch Name
//     data.SecondHolderCitizenship || "",     // Second Holder Citizenship
//     data.ThirdHolderCitizenship || "",      // Third Holder Citizenship
//     data.GuardianCitizenship || "",         // Guardian Citizenship
//     data.CorrespondenceAddress || "",       // Correspondence Address
//     data.PermanentAddress || "",            // Permanent Address
//     data.Filler1 || "",                     // Optional Filler 1
//     data.Filler2 || "",                     // Optional Filler 2
//     data.Filler3 || "",                     // Optional Filler 3
//     // Remaining fields
//     data.Filler4 || "",                     // Optional Filler 4
//     data.Filler5 || "",                     // Optional Filler 5
//     data.Filler6 || "",                     // Optional Filler 6
//     data.Filler7 || "",                     // Optional Filler 7
//     data.Filler8 || "",                     // Optional Filler 8
//     data.Filler9 || "",                     // Optional Filler 9
//     data.Filler10 || "",                    // Optional Filler 10
//     data.Filler11 || "",                    // Optional Filler 11
//     data.Filler12 || "",                    // Optional Filler 12
//     data.Filler13 || "",                    // Optional Filler 13
//     data.Filler14 || "",                    // Optional Filler 14
//     data.Filler15 || ""                     // Optional Filler 15
//   ];
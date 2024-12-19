import pool from "../config/db.js";

export const uccRegisterService = async(userId)=>{
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
                KYCDetails kyc ON up.id = kyc.user_id
            WHERE
                up.id= $1;

        `;
    const result = await pool.query(query,[userId])
    // console.log("MOdel",result.rows[0]);
    
    return result.rows[0];
}
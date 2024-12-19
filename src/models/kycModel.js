import pool from "../config/db.js";

export const createKycDetailsService = async(userId,pan_exempt,pan_number,kyc_type,kyc_status)=>{
    const result =await pool.query( `
        INSERT INTO kycdetails (user_id,pan_exempt,pan_number,kyc_type,kyc_status,created_at, updated_at)
        VALUES ($1, COALESCE($2, 'N'), $3, $4,$5, NOW(), NOW())RETURNING *`,
        [userId,pan_exempt,pan_number,kyc_type,kyc_status])
    return result.rows[0];
}
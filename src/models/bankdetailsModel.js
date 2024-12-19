import pool from "../config/db.js";

export const createBankDetailsService = async(userId,account_no,account_type,micr_code,ifsc_code,default_bank_flag)=>{
    const result = await pool.query(
        `INSERT INTO BankDetails (user_id, account_no, account_type, micr_code, ifsc_code, default_bank_flag, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
        [userId, account_no, account_type, micr_code, ifsc_code, default_bank_flag]
    );
    return result.rows[0];
}

export const getBankDetailsService = async(id)=>{
    const result = await pool.query(
        `SELECT * FROM bankdetails WHERE user_id=$1`,[id]
    );
    return result.rows;
}

export const deleteBankDetailsService = async(id)=>{
    const result = await pool.query(
        `DELETE from bankdetails WHERE id=$1 RETURNING *`,[id]
    )
    return result.rows[0];
}
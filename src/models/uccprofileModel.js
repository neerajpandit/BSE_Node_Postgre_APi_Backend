import pool from "../config/db.js";

export const uccProfileCreateService = async(userId,client_id,first_name,last_name,tax_status,gender,dob,occupation,holding_nature,communication_mode,nomination_opt)=>{
    const result = await pool.query(
        `
        INSERT INTO uccprofiles (user_id,client_id,primary_holder_first_name,primary_holder_last_name,tax_status,gender,primary_holder_dob,occupation,holding_nature,communication_mode,nomination_opt,created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())RETURNING *;
        `,
    [userId,client_id,first_name,last_name,tax_status,gender,dob,occupation,holding_nature,communication_mode,nomination_opt])
    return result.rows[0];
}
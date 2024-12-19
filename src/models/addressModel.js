import pool from "../config/db.js";

export const createAddressService = async(userId,add1,add2,add3,city,state,pincode,country)=>{
    const result =await pool.query(
        `INSERT INTO addresses (user_id,address_1,address_2,address_3,city,state,pincode,country,created_at, updated_at)
        VALUES ($1,$2,COALESCE($3, NULL), COALESCE($4, NULL), $5, $6, $7, $8, NOW(), NOW()) RETURNING * `,
        [userId,add1,add2,add3,city,state,pincode,country]
    );
    return result.rows[0];
}
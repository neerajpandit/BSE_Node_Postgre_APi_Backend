import pool from "../config/db.js";

export const getAllUserProfileService = async () => {
  const result = await pool.query("SELECT * FROM userprofiles");
  return result.rows;
};

export const getUserProfileByIdService = async (id) => {
//   console.log(id);

  const result = await pool.query("SELECT * FROM userprofiles WHERE id=$1", [
    id,
  ]);
  // console.log(result.rows);
  // console.log(result.rows[0]);
  return result.rows[0];
};

export const updateUserProfileService = async(id,phone_no,email,img_url,kycStatus)=>{
  // const result =await pool.query("UPDATE userprofiles SET first_name = COALESCE($1, first_name),last_name = COALESCE($2, last_name),phone_no = COALESCE($3, phone_no),email = COALESCE($4, email),img_url = COALESCE($5, img_url),kycStatus = COALESCE($6, kycStatus),updated_at = NOW()WHERE id = $7RETURNING id, first_name, last_name, phone_no, email, img_url, kycStatus, updated_at;")}
  const updateQuery = `
  UPDATE userprofiles
  SET
      phone_no = COALESCE($1, phone_no),
      email = COALESCE($2, email),
      img_url = COALESCE($3, img_url),
      kycStatus = COALESCE($4, kycStatus),
      updated_at = NOW()
  WHERE id = $5
  RETURNING id, phone_no, email, img_url, kycStatus, updated_at;
  `;

// Execute the update query
  const result = await pool.query(updateQuery, [
    phone_no,
    email,
    img_url,
    kycStatus,
    id
  ]);
  // console.log(result);
  
  return result.rows[0];
}

export const logoutUserProfileService = async(id)=>{
  try {
    const result = await pool.query("UPDATE userprofiles SET refresh_token=$1 WHERE id=$2 RETURNING *",
      [null,id,]
    );
    if(result.rows.length ===0){
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error in LogoutUserProfileService:",error.message);
    throw new Error("Database Error while logging out user"); 
  }

}

export const deleteUserProfileService = async (id) => {
  const result = await pool.query(
    "DELETE FROM userprofiles WHERE id=$1 RETURNING *",
    [id]
  );
  return result.rows[0];
};


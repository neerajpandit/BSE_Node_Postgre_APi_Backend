import pool from "../config/db.js";

export const nomineeCreateService = async (
  userId,
  nominee_name,
  nominee_relationship,
  nominee_applicable_percent,
  minor_flag,
  nominee_dob,
  nominee_guardian_name
) => {
  const query = `INSERT INTO NomineeDetails (user_id,nominee_name, nominee_relationship, nominee_applicable_percent, minor_flag, nominee_dob, nominee_guardian_name, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            RETURNING *;`;
    const values=[
            userId,
            nominee_name,
            nominee_relationship,
            nominee_applicable_percent,
            minor_flag,
            minor_flag === 'Y' ? nominee_dob : null,
            minor_flag === 'Y' ? nominee_guardian_name : null,
    ]


  const result = await pool.query(query,values);
//   console.log("Nominee Service");
//   console.log(result.rows);
  
  return result.rows[0];
};


export const getAllNomineeService = async(id)=>{
    const result = await pool.query(`SELECT * FROM nomineedetails WHERE user_id=$1`,[id])
    // console.log( result.rows);
    return result.rows;
}

export const getNomineeByIdService = async(userId,id)=>{
 const result = await pool.query(`SELECT * FROM nomineedetails WHERE user_id=$1 AND id=$2`,[userId,id])
 return result.rows[0];
}

export const nomineeUpdateService = async (
    nomineeId,  // The unique ID of the nominee to be updated
    userId,
    nominee_name,
    nominee_relationship,
    nominee_applicable_percent,
    minor_flag,
    nominee_dob,
    nominee_guardian_name
  ) => {
    // Build the queryValues array based on the input
    const queryValues = [
      nominee_name,
      nominee_relationship,
      nominee_applicable_percent,
      minor_flag,
      minor_flag === 'Y' ? nominee_dob : null,
      minor_flag === 'Y' ? nominee_guardian_name : null,
      nomineeId,
      userId  // ID of the nominee to be updated
    ];
  
    // Construct the dynamic query
    const query = `
      UPDATE NomineeDetails
      SET nominee_name = $1,
          nominee_relationship = $2,
          nominee_applicable_percent = $3,
          minor_flag = $4,
          nominee_dob = $5,
          nominee_guardian_name = $6,
          updated_at = NOW()
      WHERE id = $7 AND user_id = $8
      RETURNING *;
    `;
  
    try {
      const result = await pool.query(query, queryValues);
      console.log("Nominee updated successfully");
      console.log(result.rows);
  
      return result.rows[0];
    } catch (error) {
      console.error("Error in nomineeUpdateService:", error);
      throw new Error("Failed to update nominee");
    }
  };
  
export const nomineeDeleteService = async (nomineeId, userId) => {
    const query = `
      DELETE FROM NomineeDetails
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
  
    try {
      const result = await pool.query(query, [nomineeId, userId]);
  
      if (result.rowCount === 0) {
        throw new Error("Nominee not found or unauthorized access.");
      }
  
      console.log("Nominee deleted successfully");
      return result.rows[0];
    } catch (error) {
      console.error("Error in nomineeDeleteService:", error);
      throw new Error("Failed to delete nominee");
    }
};
  
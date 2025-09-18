import pool from "../db/postgres.js";
export const getProfile = async (req, res) => {
  try {
    const { date } = req.params;
    const query = `SELECT DISTINCT ON (profile_id)
    profile_id,
    latitude,
    longitude,
    datetime,
    pressure,
    temperature,
    salinity,
    project_name,
    platform_type
FROM argo_profiles
WHERE DATE(datetime) = $1
ORDER BY profile_id, pressure ASC;
    `;
    const { rows } = await pool.query(query, [date]);
    res.status(200).json({message: "Profile data fetched successfully", data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

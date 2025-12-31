import { Request, Response } from "express";
import pool from "../db";
import {  convertDateToPostgresFormat} from "../utils/dateUtils";


export const saveResponse = async (req: Request, res: Response) => {
  const client = await pool.connect(); // Start a transaction with a dedicated client
  try {
    const { firstName, lastName, NHI, dateOfBirth, submissionTime, responses } = req.body.data;

    const formattedDOB = convertDateToPostgresFormat(dateOfBirth);

    await client.query('BEGIN');

    let existingResponse;
    if (NHI) {
      existingResponse = await client.query(
        "SELECT * FROM responses WHERE nhi = $1 FOR UPDATE", 
        [NHI]
      );
    } else {
      existingResponse = await client.query(
        "SELECT * FROM responses WHERE first_name = $1 AND last_name = $2 AND dateofbirth = $3 FOR UPDATE", 
        [firstName, lastName, formattedDOB]
      );
    }

    if (existingResponse.rows.length > 0) {
      const updatedResponse = await client.query(
        `UPDATE responses 
         SET first_name = $1, last_name = $2, dateofbirth = $3, submission_time = $4, response = $5 
         WHERE ${NHI ? 'nhi = $6' : 'first_name = $6 AND last_name = $7 AND dateofbirth = $8'} 
         RETURNING *`,
        NHI ? 
        [firstName, lastName, formattedDOB, submissionTime, JSON.stringify(responses), NHI] :
        [firstName, lastName, formattedDOB, submissionTime, JSON.stringify(responses), firstName, lastName, formattedDOB]
      );

      await client.query('COMMIT'); 
      res.json(updatedResponse.rows[0]);
    } else {
      const newResponse = await client.query(
        "INSERT INTO responses (first_name, last_name, nhi, dateofbirth, submission_time, response) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        [firstName, lastName, NHI || "", formattedDOB, submissionTime, JSON.stringify(responses)]
      );

      await client.query('COMMIT'); 
      res.json(newResponse.rows[0]);
    }
  } catch (err: any) {
    await client.query('ROLLBACK'); 
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

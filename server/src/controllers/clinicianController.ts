import { Request, Response } from "express";
import pool from "../db";
import { queryDateToPostgresFormat } from "../utils/dateUtils";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwtUtils";

export const getAllResponses = async (req: Request, res: Response) => {
    try {
        const notActionedResponses = await pool.query("SELECT * FROM responses WHERE actioned = false");
        res.json(notActionedResponses.rows);
    } catch (error) {
        console.error("Error fetching responses: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllActionedResponses = async (req: Request, res: Response) => {
    try {
        const actionedResponses = await pool.query("SELECT * FROM responses WHERE actioned = true");
        res.json(actionedResponses.rows);
    } catch (error) {
        console.error("Error fetching actioned responses: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateResponseToActioned = async (req: Request, res: Response) => {
    const { nhi, first_name, last_name, actioned } = req.query;
    let { dateofbirth } = req.query;

    if (actioned === undefined) {
        return res.status(400).json({ error: "The 'actioned' status must be provided." });
    }

    let query = '';
    let queryParams: any[] = [];

    if (nhi) {
        query = 'UPDATE responses SET actioned = $2 WHERE nhi = $1 RETURNING *';
        queryParams = [nhi, actioned === 'true'];
    } else if (first_name && last_name && dateofbirth) {
        dateofbirth = queryDateToPostgresFormat(dateofbirth as string);

        query = `
            UPDATE responses SET actioned = $4 
            WHERE first_name = $1 AND last_name = $2 AND dateofbirth = $3 RETURNING *
        `;
        queryParams = [first_name, last_name, dateofbirth, actioned === 'true'];
    } else {
        return res.status(400).json({ error: "Either 'nhi' or all 'first_name', 'last_name', and 'dateofbirth' must be provided." });
    }

    try {
        const updatedResponse = await pool.query(query, queryParams);
        if (updatedResponse.rows.length === 0) {
            return res.status(404).json({ error: "Response not found." });
        }
        res.json(updatedResponse.rows);
    } catch (error) {
        console.error("Error updating response to actioned: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const searchResponses = async (req: Request, res: Response) => {
    const { search, actioned, dob } = req.query;

    if (typeof actioned === 'undefined') {
        return res.status(400).json({ error: "Actioned is required." });
    }

    try {
        let query: string;
        let queryParams: any[] = [actioned === 'true'];

        const trimmedSearch = typeof search === 'string' ? search.trim() : '';
        const isActioned = actioned === 'true';
        const formattedDob = dob ? dob : '';  

        if (!trimmedSearch && !dob) {
            query = 'SELECT * FROM responses WHERE actioned = $1 ORDER BY submission_time DESC;';
            queryParams = [isActioned];
        } 

        else if (!trimmedSearch && dob) {
            query = `
                SELECT * FROM responses 
                WHERE actioned = $1 
                AND dateofbirth = $2::date  -- Change to date type comparison
                ORDER BY submission_time DESC;
            `;
            queryParams = [isActioned, formattedDob];
        }
        
        else {
            const terms = trimmedSearch.split(' ').map((term: string) => `%${term}%`);
            const startsWithTerms = trimmedSearch.split(' ').map((term: string) => `${term}%`);
            const firstNameTerm = startsWithTerms[0];
            const lastNameTerm = startsWithTerms[1] || firstNameTerm;

            let dobCondition = dob ? `AND dateofbirth = $6::date` : ''; 

            query = `
                SELECT *, 
                    (CASE 
                        WHEN first_name ILIKE $1 AND last_name ILIKE $2 THEN 4
                        WHEN first_name ILIKE $1 OR last_name ILIKE $2 THEN 3
                        WHEN first_name ILIKE $3 OR last_name ILIKE $3 THEN 2
                        WHEN nhi ILIKE $3 THEN 1
                        ELSE 0
                    END) AS relevance
                FROM responses 
                WHERE 
                    actioned = $5 AND
                    (nhi ILIKE ANY($4::text[]) 
                    OR first_name ILIKE ANY($4::text[]) 
                    OR last_name ILIKE ANY($4::text[]))
                    ${dobCondition}
                ORDER BY relevance DESC, submission_time DESC;
            `;

            queryParams = dob ? [firstNameTerm, lastNameTerm, terms[0], terms, isActioned, formattedDob] 
                              : [firstNameTerm, lastNameTerm, terms[0], terms, isActioned];
        }

        const searchResults = await pool.query(query, queryParams);

        const formattedResults = searchResults.rows.map((row: any) => ({
            ...row,
            dateofbirth: row.dateofbirth,
            submission_time: row.submission_time,
        }));

        res.json(formattedResults);
    } catch (error) {
        console.error("Error searching patients: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




export const getPatientResponseByNHI = async (req: Request, res: Response) => {
    const { nhi } = req.params;

    try {
        const response = await pool.query(
            "SELECT * FROM responses WHERE nhi = $1",
            [nhi]
        );

        if (response.rows.length > 0) {
            const patientResponse = response.rows[0];
            res.json(patientResponse);
        } else {
            res.status(404).json({ error: "Patient not found" });
        }
    } catch (error) {
        console.error("Error fetching patient responses: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getPatientResponseWithoutNHI = async (req: Request, res: Response) => {
    const { firstName, lastName, DOB } = req.query;

    try {
        if (!firstName || !lastName || !DOB) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const formattedDOB = queryDateToPostgresFormat(DOB as string);

        const response = await pool.query(
            "SELECT * FROM responses WHERE first_name = $1 AND last_name = $2 AND dateofbirth = $3",
            [firstName, lastName, formattedDOB]
        );

        if (response.rows.length > 0) {
            const patientResponse = response.rows[0];
            res.json(patientResponse);
        } else {
            res.status(404).json({ error: "Patient not found" });
        }

    } catch (error) {
        console.error("Error fetching patient responses: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deletePatientResponse = async (req: Request, res: Response) => {
    const { nhi } = req.params;

    try {
        const deleteResponse = await pool.query(
            "DELETE FROM responses WHERE nhi = $1 RETURNING *",
            [nhi]
        );

        if (deleteResponse.rows.length > 0) {
            res.json({ message: "Response deleted" });
        } else {
            res.status(404).json({ error: "Patient not found" });
        }
    } catch (error) {
        console.error("Error deleting patient response: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const loginClinician = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const clinicianCheck = await pool.query("SELECT * FROM clinicians WHERE email = $1", [email]);

        if (clinicianCheck.rows.length === 0) {
            return res.status(401).json({ error: "Clinician not found." });
        }
        
        const clinician = clinicianCheck.rows[0];
        const isPasswordMatch = await bcrypt.compare(password, clinician.password);
        
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }
        
        const token = generateToken(clinician.clinician_id);
        
        res.status(200).json({
            message: "Clinician logged in successfully",
            token,
            clinicianName: clinician.name,
            isAdmin: clinician.is_admin 
        });
        
    } catch (error) {
        console.error("Error logging in clinician: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getPatientResponseByDateOfBirth = async (req: Request, res: Response) => {
    const { dateOfBirth } = req.params;
    const { actioned } = req.query;
    try {
        const response = await pool.query(
            `SELECT * FROM public.responses WHERE dateofbirth = $1 AND actioned = $2`,
            [dateOfBirth, actioned === 'true']
        );

        if (response.rows.length > 0) {
            res.json(response.rows);
        } else {
            res.status(404).json({ error: "Patient not found" });
        }
    } catch (error) {
        console.error("Error fetching patient data by date of birth: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

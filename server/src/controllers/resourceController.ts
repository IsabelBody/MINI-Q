import { Request, Response } from "express";
import pool from "../db";

export const getPrivacyStatement = async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT content FROM resources WHERE type = 'privacy-statement'");
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Privacy statement not found" });
        }
        res.json({ content: result.rows[0].content });
    } catch (error) {
        console.error("Error fetching privacy statement:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updatePrivacyStatement = async (req: Request, res: Response) => {
    const { content } = req.body;

    try {
        const result = await pool.query(
            "UPDATE resources SET content = $1 WHERE type = 'privacy-statement' RETURNING *",
            [content]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Privacy statement not found" });
        }

        res.json({ message: "Privacy statement updated successfully", resource: result.rows[0] });
    } catch (error) {
        console.error("Error updating privacy statement:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';

export const registerClinician = async (req: Request, res: Response) => {
    const { name, email, password, token } = req.body;

    if (!name || !email || !password || !token) {
        return res.status(400).json({ error: 'Name, email, password, and token are required' });
    }

    try {
        // Fetch the most recent valid invitation using expires_at
                    // If clinician status needs to change, re-invite them and check the box.  
        const invitationResult = await pool.query(
            `
            SELECT * FROM invitations 
            WHERE token = $1 AND used = FALSE AND expires_at > NOW() 
            ORDER BY expires_at DESC 
            LIMIT 1
            `,
            [token]
        );

        if (invitationResult.rowCount === 0) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const invitation = invitationResult.rows[0]; // Get info from invitation
        const isAdmin = invitation.is_admin; 

        // Check if clinician already exists
        const clinicianExists = await pool.query(
            'SELECT * FROM clinicians WHERE email = $1',
            [email]
        );

        const hashedPassword = await bcrypt.hash(password, 10);

        if (clinicianExists?.rowCount ?? 0 > 0) {
            // Update password and admin status for existing clinician
            await pool.query(
                'UPDATE clinicians SET password = $1, is_admin = $2 WHERE email = $3',
                [hashedPassword, isAdmin, email]
            );
            res.status(200).json({ message: 'Password and admin status updated for existing clinician.' });
        } else {
            await pool.query( 
                'INSERT INTO clinicians (name, email, password, is_admin) VALUES ($1, $2, $3, $4)',
                [name, email, hashedPassword, isAdmin]
            );
            res.status(200).json({ message: 'Registration successful.' });
        }

        // Mark the invitation as used
        await pool.query(
            'UPDATE invitations SET used = TRUE WHERE token = $1',
            [token]
        );
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

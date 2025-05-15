// app/api/test-db/route.js

import connectToDatabase from "../../../../lib/mongoose";
import bcrypt from 'bcryptjs';
// import connectToDatabase from "../../../lib/mongodb";

export async function GET() {
    try {
        await connectToDatabase();

        const hashedPassword = await bcrypt.hash('password', 10);

        return new Response(
            JSON.stringify({ message: "Successfully connected to the database!", pass: hashedPassword }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Database connection failed", error: error.message }),
            { status: 500 }
        );
    }
}

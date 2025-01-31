import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/lib/models/user.model";
import { sendEmail } from "@/helpers/mailer";
import { createUser, populateSelfCreatedUser } from "@/lib/actions/user.actions";
require('jsonwebtoken');
export async function POST(request: NextRequest) {
    try {
        connectToDB();

        // Parse the request body as JSON
        const body = await request.json();

        // Destructure the body to extract user data
        const {username, email, password } = body;

        // Check if user already exists
        const existingUser = await User.findOne({ email }).select("-password");

        if (!existingUser.selfCreated) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        let savedUser = null;

        if (existingUser.selfCreated) {
            savedUser = await populateSelfCreatedUser({ username, email, password: hashedPassword })
        } else {
            savedUser = await createUser({ username, email, password: hashedPassword})
        }

        //Send verefy token

        if(savedUser) {
            await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})
            
            // Respond with success message
            return NextResponse.json({
                message: "User created successfully",
                success: true,
                savedUser
            });
        } else {
            return NextResponse.json({ error: "Saved user not found"}, { status: 500 });
        }

    } catch (error: any) {
        // Handle errors
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

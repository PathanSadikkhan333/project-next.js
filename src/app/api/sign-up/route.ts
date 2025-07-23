
// Force Node.js runtime (NOT Edge)
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    // Check if verified user exists by username
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: 'User already exists with this email',
          },
          { status: 400 }
        );
      }

      // Update unverified user
      existingUserByEmail.password = await bcrypt.hash(password, 10);
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour
      await existingUserByEmail.save();
    } else {
      // Create new user
      const newUser = new UserModel({
        username,
        email,
        password: await bcrypt.hash(password, 10),
        verifyCode,
        verifyCodeExpiry: new Date(Date.now() + 3600000), // 1 hour
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message || 'Failed to send verification email.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in /api/sign-up:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Server error during registration',
      },
      { status: 500 }
    );
  }
}
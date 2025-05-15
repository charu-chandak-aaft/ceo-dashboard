import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '../../../../../lib/models/User';
import connectToDatabase from '../../../../../lib/mongoose';
import generateToken from '../../../../../lib/utils/generateToken';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'invalid password or email' }, { status: 401 });
    }

    // Create JWT
    const token = generateToken(user);

    return NextResponse.json({
      message: 'Login successful',
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        firstLogin: user.firstLogin,
        mobile: user.mobile,
        designation: user.designation,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


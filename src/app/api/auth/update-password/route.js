import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongoose';
import bcrypt from 'bcryptjs';
import User from '../../../../../lib/models/User';
// import User from "@/lib/models/User";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, newPassword } = await req.json();
    const user = await User.findOne({ email });
    // console.log('user upate', user)

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const salt =  await bcrypt.genSalt(10);
    // now we set user password to hashed password
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.firstLogin = false;
    await user.save();
    const userData =  {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
    return NextResponse.json({ message: 'Password updated successfully',success: true,userData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating password' }, { status: 500 });
  }
}

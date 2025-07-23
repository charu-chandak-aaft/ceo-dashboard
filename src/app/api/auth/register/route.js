
// import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import User from '../../../../../lib/models/User';
// // import User from "@/lib/models/User";
// import connectToDatabase from '../../../../../lib/mongoose';

// const passwordHash = async (new_password) => {

//   const salt =  await bcrypt.genSalt(10);
//   // now we set user password to hashed password
//   const new_hash_password = await bcrypt.hash(new_password, salt);

//   return hashpass;

// }
// export async function POST(req) {
//   try {
//     const { name, email, password, role, designation, mobile } = await req.json();
//     console.log('name, email, password, role, designation, mobile', name, email, password, role, designation, mobile)
//     // const hashedPassword = await bcrypt.hash('password', 10);
//     const salt =  await bcrypt.genSalt(10);
//     // now we set user password to hashed password
//     const hashedPassword = await bcrypt.hash(password, salt);

//     await connectToDatabase();
//     // await User.deleteMany();
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ error: 'User already exists' }, { status: 400 });
//     }

//     const newUser = await User.create({ name, email, password: hashedPassword, role, designation, mobile });

//     return NextResponse.json({ message: 'User registered successfully', userId: newUser._id , designation: newUser.designation, mobile: newUser.mobile });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

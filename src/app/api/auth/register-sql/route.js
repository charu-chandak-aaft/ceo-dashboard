import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    console.log('Database URL:', process.env.DATABASE_URL);
    await prisma.$connect(); 
    const body = await req.json();
    const { name, email, password, role, designation, mobile } = body;

    console.log('🔹 Registering:', { name, email, role, designation, mobile });

    // Basic validation
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
      });
    }

    // Check if user already exists (using findFirst for safety)
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    console.log('🔍 Existing user check:', existingUser);

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        designation,
        mobile,
      },
    });

    console.log('✅ User created with ID:', newUser.id);

    return new Response(
      JSON.stringify({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          designation: newUser.designation,
          mobile: newUser.mobile,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ Registration error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect(); 
  }
}

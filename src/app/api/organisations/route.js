import { NextResponse } from 'next/server';
import Organisation from '../../../../lib/models/Organisation';
import connectToDatabase from '../../../../lib/mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    const organisations = await Organisation.find().select('_id name');
    return NextResponse.json(organisations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch organisations' }, { status: 500 });
  }
}

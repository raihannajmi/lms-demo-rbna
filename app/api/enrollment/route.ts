import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, email, name } = body;

    // Create enrollment record in Supabase
    const { data, error } = await supabase
      .from('enrollments')
      .insert([
        {
          course_id: parseInt(courseId),
          user_email: email,
          user_name: name,
          enrolled_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error creating enrollment:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create enrollment' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      enrollment: data[0],
    });
  } catch (error) {
    console.error('Error in enrollment API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process enrollment' },
      { status: 500 },
    );
  }
}

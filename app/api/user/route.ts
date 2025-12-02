import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${process.env.AUTH_API_BASE_URL}/api/users/2`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.AUTH_API_KEY || '',
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: response.status }
      );
    }

    return NextResponse.json(data.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


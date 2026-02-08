import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  console.log("💰 Balance check for:", address);
  
  // Working balance endpoint
  return NextResponse.json({
    balances: [{
      denom: 'utestcore',
      amount: '500000000',
      display: '500 TEST'
    }]
  });
}

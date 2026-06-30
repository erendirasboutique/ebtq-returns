import { NextResponse } from 'next/server';
import { verifyReturnCode } from '@/lib/supabaseRest';
export async function POST(req){try{const {code}=await req.json();const row=await verifyReturnCode(code);return NextResponse.json({ok:true,returnCode:row})}catch(e){return NextResponse.json({error:e.message},{status:400})}}

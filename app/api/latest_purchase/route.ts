// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("purchase")
      .select("*")
      .order("date", { ascending: false }) // Replace 'date_column_name' with your actual date column name
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      `Error fetching data from external API: ${error.message}`,
      { status: 500 }
    );
  }
}

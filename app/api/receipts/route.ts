// @ts-nocheck

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const errors: any[] = [];
  const successes: any[] = [];

  try {
    const purchases = await request.json();

    for (const receipt of purchases) {
      const { date, categories } = receipt;
      const { data: purchaseData, error: purchaseError } = await supabase
        .from("purchase")
        .upsert([{ date: parseDateString(date) }])
        .select("id");

      if (purchaseError) {
        console.error(purchaseError.details);
        errors.push({ receipt, error: purchaseError.details });
        continue;
      }

      if (purchaseData?.length) {
        for (const category of Object.keys(categories)) {
          const purchase_items = categories[category].map(
            (purchase_item: any) => ({
              purchase_id: purchaseData[0].id,
              code: parseInt(purchase_item.code),
              price: parseFloat(purchase_item.price),
              amount: parseFloat(purchase_item.amount),
              description: purchase_item.description,
              category: category,
            })
          );

          const { error: purchaseItemError } = await supabase
            .from("purchase_item")
            .upsert(purchase_items);

          if (purchaseItemError) {
            console.error(
              `Error creating purchase item: ${purchaseItemError.details}`
            );
            errors.push({
              receipt,
              category,
              error: purchaseItemError.details,
            });
          } else {
            successes.push({ receipt, category });
          }
        }
      }
    }

    let statusCode: number;
    let statusMessage: string;

    if (errors.length === purchases.length) {
      statusCode = 409; // All failed
      statusMessage = "failure";
    } else if (errors.length > 0) {
      statusCode = 207; // Partial success
      statusMessage = "partial_success";
    } else {
      statusCode = 200; // All succeeded
      statusMessage = "success";
    }

    return NextResponse.json(
      {
        status: statusMessage,
        successes,
        errors,
      },
      { status: statusCode }
    );
  } catch (e) {
    return new NextResponse(`Error processing the request: ${e}`, {
      status: 500,
    });
  }
}

function parseDateString(dateString) {
  // Extract date and time parts
  const datePart = dateString.slice(0, 8);
  const timePart = dateString.slice(9);

  // Convert to individual components
  const day = datePart.slice(0, 2);
  const month = datePart.slice(2, 4);
  const year = datePart.slice(4, 8);
  const hours = timePart.slice(0, 2);
  const minutes = timePart.slice(2, 4);
  const seconds = timePart.slice(4, 6);

  // Create a date object
  const formattedDate = new Date(
    `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`
  );

  // Ensure the date is valid
  if (isNaN(formattedDate)) {
    throw new Error(`Invalid date format: ${dateString}`);
  }

  return formattedDate.toISOString(); // Convert to ISO 8601 format
}

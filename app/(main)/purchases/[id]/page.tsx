import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getPurchaseItems } from "@/supabase/queries";
import PurchaseClient from "./PurchaseClient";
import Link from "next/link";
import { RiArrowLeftSLine } from "@remixicon/react";

type Props = {
  params: { id: number };
};

export default async function PurchasePage({ params }: Props) {
  const { id } = params;
  const supabase = createClient();
  const [purchaseItems] = await Promise.all([getPurchaseItems(supabase, id)]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <div className="flex flex-row gap-3">
        <Link href="/purchases">
          <RiArrowLeftSLine />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
          Purchases
        </h1>
      </div>
      {purchaseItems ? (
        <PurchaseClient items={purchaseItems} />
      ) : (
        <p>No items found</p>
      )}
    </>
  );
}

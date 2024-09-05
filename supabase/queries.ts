import { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export const getPurchases = cache(async (supabase: SupabaseClient) => {
  const { data } = await supabase
    .from("purchase")
    .select("id, date")
    .order("date", { ascending: false });
  return data;
});

export const getPurchaseItems = cache(
  async (supabase: SupabaseClient, id: number) => {
    const { data, error } = await supabase
      .from("purchase_item")
      .select("*")
      .eq("purchase_id", id);

    if (error) {
      console.error("Error fetching purchase items:", error);
      return null;
    }

    return data;
  }
);

export const getPurchaseSummary = cache(
  async (supabase: SupabaseClient, startDate: string, endDate: string) => {
    const { data, error } = await supabase.rpc("get_purchase_overview", {
      start_date: startDate,
      end_date: endDate,
    });

    if (error) {
      console.error("Error fetching purchase overview:", error);
      return null;
    }

    return data;
  }
);
export const getTotalAmountSpent = cache(
  async (supabase: SupabaseClient, startDate: string, endDate: string) => {
    const { data, error } = await supabase.rpc("get_total_amount_spent", {
      start_date: startDate,
      end_date: endDate,
    });

    if (error) {
      console.error("Error fetching purchase overview:", error);
      return null;
    }
    const total = data[0].total_spent ? data[0].total_spent : 0;

    return total;
  }
);

export const getCategoryBreakdown = cache(
  async (supabase: SupabaseClient, startDate: string, endDate: string) => {
    const { data, error } = await supabase.rpc("get_category_breakdown", {
      start_date: startDate,
      end_date: endDate,
    });

    if (error) {
      console.error("Error fetching purchase overview:", error);
      return null;
    }
    const category = data ? data : [];

    return category;
  }
);

export const getSpendingByDay = cache(
  async (supabase: SupabaseClient, startDate: string, endDate: string) => {
    const { data, error } = await supabase.rpc("get_spending_by_day_of_week", {
      start_date: startDate,
      end_date: endDate,
    });

    if (error) {
      console.error("Error fetching purchase overview:", error);
      return null;
    }

    return data;
  }
);

export const createPurchase = async (
  supabase: SupabaseClient,
  purchase: any
) => {
  const { data, error } = await supabase
    .from("purchase")
    .upsert([purchase])
    .select("id");

  if (error) {
    console.error("Error creating purchase:", error);
  }

  return { data, error };
};

export const createPurchaseItems = async (
  supabase: SupabaseClient,
  purchaseItems: any
) => {
  const { data, error } = await supabase
    .from("purchase_item")
    .upsert(purchaseItems);

  if (error) {
    console.error("Error creating purchase:", error);
  }

  return { data, error };
};

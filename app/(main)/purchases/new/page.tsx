"use client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { createPurchase, createPurchaseItems } from "@/supabase/queries";
import { RiDeleteBin3Fill } from "@remixicon/react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function NewPurchasePage() {
  const initialItems = {
    id: `new-${Date.now()}`,
    description: "",
    price: "",
    amount: 0,
  };
  const [purchaseItems, setPurchaseItems] = useState([initialItems]);
  const [store, setStore] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const addItem = () => {
    setPurchaseItems([
      ...purchaseItems,
      { id: `new-${Date.now()}`, description: "", price: "", amount: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    setPurchaseItems(purchaseItems.filter((song) => song.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setPurchaseItems(
      purchaseItems.map((song) =>
        song.id === id ? { ...song, [field]: value } : song
      )
    );
  };

  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStore(e.target.value);
  };

  const savePurchase = async () => {
    const formatString = (str: string) =>
      str.toLowerCase().trim().replace(/\s+/g, "");

    const supabase = createClient();
    const { data, error } = await createPurchase(supabase, {
      store,
    });

    if (error) {
      setErrorMessage(error.details);
    }

    if (data) {
      const [purchase] = data;
      const items = purchaseItems.map((item) => {
        const code = `${formatString(store)}-${formatString(item.description)}`;
        return {
          purchase_id: purchase.id,
          description: item.description,
          price: item.price,
          amount: item.amount,
          code,
          category: store,
        };
      });

      const { error } = await createPurchaseItems(supabase, items);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setStore("");
        setPurchaseItems([initialItems]);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Mo&apos; expenses mo&apos; problems
      </h1>
      {errorMessage && <p>{errorMessage}</p>}
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Where did you buy it?
      </h1>
      <Input
        placeholder="Mercadolibre, Dia, Farmacity..."
        value={store}
        onChange={(e) => handleStoreChange(e)}
      />
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        What did you buy?
      </h1>
      <Button onClick={addItem}>Add Item</Button>
      <div className="min-h-80">
        {purchaseItems.map((item) => (
          <>
            <div key={item.id} className="flex-row space-y-3">
              <div className="mt-6">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, "description", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Price"
                  value={item.price}
                  type="number"
                  onChange={(e) => updateItem(item.id, "price", e.target.value)}
                  className="flex-grow"
                />
                <Input
                  placeholder="Amount"
                  value={item.amount}
                  type="number"
                  onChange={(e) =>
                    updateItem(item.id, "amount", e.target.value)
                  }
                  className="flex-grow"
                />
                <Button
                  className="p-2 flex-shrink-0 w-10 h-10"
                  onClick={() => removeItem(item.id)}
                >
                  <RiDeleteBin3Fill />
                </Button>
              </div>
            </div>
          </>
        ))}
      </div>
      <div className="flex mt-10">
        <Button
          onClick={savePurchase}
          disabled={
            purchaseItems.length === 0 ||
            purchaseItems.some(
              (item) =>
                !item.description || !item.price || !item.amount || !store
            )
          }
          className="w-full"
        >
          Save
        </Button>
      </div>
    </div>
  );
}

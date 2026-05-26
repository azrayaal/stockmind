"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, TransactionFormData } from "@/types";

const transactionSchema = z.object({
  productId: z.string().min(1, "Pilih produk"),
  quantity: z.number().min(1, "Jumlah minimal 1"),
  note: z.string().optional(),
});

interface TransactionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => void;
  products: Product[];
  type: "in" | "out";
}

export function TransactionFormModal({
  open,
  onOpenChange,
  onSubmit,
  products,
  type,
}: TransactionFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { productId: "", quantity: 1, note: "" },
  });

  const productId = watch("productId");
  const selectedProduct = products.find((p) => p.id === productId);

  const handleFormSubmit = (data: TransactionFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "in" ? "Catat Barang Masuk" : "Catat Barang Keluar"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Produk</Label>
            <Select
              value={productId}
              onValueChange={(v) => setValue("productId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih produk" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} (Stok: {p.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productId && (
              <p className="text-xs text-rose-500">{errors.productId.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Jumlah</Label>
            <Input id="quantity" type="number" min={1} {...register("quantity", { valueAsNumber: true })} />
            {errors.quantity && (
              <p className="text-xs text-rose-500">{errors.quantity.message}</p>
            )}
          </div>
          {selectedProduct && (
            <div className="rounded-lg bg-zinc-50 p-3 text-sm dark:bg-zinc-900">
              <p className="text-zinc-500">Estimasi Total</p>
              <p className="text-lg font-semibold">
                Rp{" "}
                {(
                  selectedProduct.price * (watch("quantity") || 0)
                ).toLocaleString("id-ID")}
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="note">Catatan (opsional)</Label>
            <Input id="note" {...register("note")} placeholder="Contoh: Restock mingguan" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" variant={type === "in" ? "success" : "default"}>
              {type === "in" ? "Catat Masuk" : "Catat Keluar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import type { Product, ProductCategory, ProductFormData } from "@/types";

const categories: ProductCategory[] = [
  "Makanan",
  "Minuman",
  "Sembako",
  "Snack",
  "Perawatan",
  "Lainnya",
];

const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  sku: z.string().min(3, "SKU minimal 3 karakter"),
  category: z.enum([
    "Makanan",
    "Minuman",
    "Sembako",
    "Snack",
    "Perawatan",
    "Lainnya",
  ]),
  stock: z.number().min(0, "Stok tidak boleh negatif"),
  minStock: z.number().min(0, "Stok minimum tidak boleh negatif"),
  price: z.number().min(1, "Harga harus lebih dari 0"),
});

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormData) => void;
  product?: Product | null;
}

export function ProductFormModal({
  open,
  onOpenChange,
  onSubmit,
  product,
}: ProductFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ?? {
      name: "",
      sku: "",
      category: "Makanan",
      stock: 0,
      minStock: 10,
      price: 0,
    },
  });

  const category = watch("category");

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Produk" : "Tambah Produk Baru"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk</Label>
            <Input id="name" {...register("name")} placeholder="Contoh: Indomie Goreng" />
            {errors.name && (
              <p className="text-xs text-rose-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" {...register("sku")} placeholder="Contoh: IND-GOR-001" />
            {errors.sku && (
              <p className="text-xs text-rose-500">{errors.sku.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              value={category}
              onValueChange={(v) => setValue("category", v as ProductCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stok</Label>
              <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} />
              {errors.stock && (
                <p className="text-xs text-rose-500">{errors.stock.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Stok Minimum</Label>
              <Input id="minStock" type="number" {...register("minStock", { valueAsNumber: true })} />
              {errors.minStock && (
                <p className="text-xs text-rose-500">{errors.minStock.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Harga (Rp)</Label>
            <Input id="price" type="number" {...register("price", { valueAsNumber: true })} />
            {errors.price && (
              <p className="text-xs text-rose-500">{errors.price.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">{product ? "Simpan" : "Tambah"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

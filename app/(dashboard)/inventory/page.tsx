"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormModal } from "@/components/inventory/product-form-modal";
import { useInventoryStore } from "@/store";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product, ProductCategory, ProductFormData } from "@/types";

const categoryStyles: Record<ProductCategory, string> = {
  Makanan: "bg-orange-100 text-orange-700",
  Minuman: "bg-blue-100 text-blue-700",
  Sembako: "bg-amber-100 text-amber-700",
  Snack: "bg-pink-100 text-pink-700",
  Perawatan: "bg-violet-100 text-violet-700",
  Lainnya: "bg-slate-100 text-slate-600",
};

export default function InventoryPage() {
  const {
    products,
    searchQuery,
    categoryFilter,
    setSearchQuery,
    setCategoryFilter,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useInventoryStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Inventori</h2>
          <p className="text-sm text-slate-400">
            Kelola {products.length} produk di toko Anda
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Cari nama atau SKU..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="Makanan">Makanan</SelectItem>
            <SelectItem value="Minuman">Minuman</SelectItem>
            <SelectItem value="Sembako">Sembako</SelectItem>
            <SelectItem value="Snack">Snack</SelectItem>
            <SelectItem value="Perawatan">Perawatan</SelectItem>
            <SelectItem value="Lainnya">Lainnya</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-slate-200" />
            <p className="mt-4 text-sm font-medium text-slate-700">Tidak ada produk ditemukan</p>
            <p className="text-xs text-slate-400">
              Coba ubah filter atau tambah produk baru
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-slate-50/80">
                <TableHead>Produk</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Stok</TableHead>
                <TableHead className="text-right">Min. Stok</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => {
                const isLowStock = product.stock <= product.minStock;
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-semibold text-slate-900">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <code className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        {product.sku}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          categoryStyles[product.category]
                        )}
                      >
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {isLowStock ? (
                        <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-600">
                          {product.stock}
                        </span>
                      ) : (
                        <span className="font-medium text-slate-900">{product.stock}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-slate-400">
                      {product.minStock}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-900">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <ProductFormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
        product={editingProduct}
      />
    </div>
  );
}

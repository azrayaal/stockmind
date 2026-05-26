"use client";

import { useState } from "react";
import { Plus, ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionFormModal } from "@/components/inventory/transaction-form-modal";
import { useInventoryStore } from "@/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { TransactionFormData } from "@/types";

export default function OutgoingPage() {
  const { products, transactions, addTransaction } = useInventoryStore();
  const [modalOpen, setModalOpen] = useState(false);

  const outgoingTransactions = transactions.filter((t) => t.type === "out");

  const handleSubmit = (data: TransactionFormData) => {
    addTransaction(data, "out");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Barang Keluar</h2>
          <p className="text-sm text-zinc-500">
            Catat penjualan dan pengeluaran stok
          </p>
        </div>
        <Button className="gap-2" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Catat Barang Keluar
        </Button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {outgoingTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ArrowUpFromLine className="h-12 w-12 text-zinc-300" />
            <p className="mt-4 text-sm font-medium">Belum ada transaksi keluar</p>
            <p className="text-xs text-zinc-500">
              Klik tombol di atas untuk mencatat barang keluar
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Harga/Unit</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outgoingTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-sm text-zinc-500">
                    {formatDateTime(tx.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium">{tx.productName}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="destructive">-{tx.quantity}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-zinc-500">
                    {formatCurrency(tx.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(tx.total)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-zinc-500">
                    {tx.note ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <TransactionFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        products={products}
        type="out"
      />
    </div>
  );
}

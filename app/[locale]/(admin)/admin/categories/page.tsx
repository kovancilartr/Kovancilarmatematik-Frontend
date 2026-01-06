"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Loader2,
  Plus,
  Layers,
  Search,
  Edit2,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useGetAllCategories,
  useDeleteCategory,
} from "@/hooks/api/use-categories";
import { useEffect, useState, useMemo } from "react";
import { UpsertCategoryModal } from "@/components/modal/UpsertCategoryModal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminCategoriesPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useGetAllCategories();

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  useEffect(() => {
    if (isError && error) {
      toast.error(`Kategoriler yüklenemedi: ${error.message}`);
    }
  }, [isError, error]);

  const filteredData = useMemo(
    () =>
      categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
      ),
    [categories, search]
  );

  const columns: ColumnDef<Category>[] = useMemo(
    () => [
      {
        accessorKey: "order",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="font-black text-xs uppercase tracking-widest p-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            SIRA
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-black text-xs">
            {row.getValue("order")}
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="font-black text-xs uppercase tracking-widest p-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            KATEGORİ ADI
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-bold text-base tracking-tight">
              {row.getValue("name")}
            </span>
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const category = row.original;

          return (
            <div className="flex justify-end gap-2">
              <UpsertCategoryModal category={category}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </UpsertCategoryModal>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2rem] border-border/40">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black tracking-tight">
                      Emin misiniz?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base font-medium">
                      <span className="font-bold text-foreground">
                        {category.name}
                      </span>{" "}
                      kategorisi ve altındaki tüm içerikler silinecektir. Bu
                      işlem geri alınamaz.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-6 gap-3">
                    <AlertDialogCancel className="rounded-2xl font-bold h-12">
                      İptal Et
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="rounded-2xl font-bold h-12 bg-destructive hover:bg-destructive/90"
                      onClick={() =>
                        deleteCategory(category.id, {
                          onSuccess: () =>
                            toast.success("Kategori başarıyla silindi!"),
                          onError: (error) =>
                            toast.error(`Hata: ${error.message}`),
                        })
                      }
                      disabled={isDeleting}
                    >
                      {isDeleting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Kategoriyi Sil
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
      },
    ],
    [deleteCategory, isDeleting]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <Badge
            variant="outline"
            className="rounded-full border-primary/20 text-primary bg-primary/5 px-3 py-0.5 font-bold uppercase tracking-widest text-[10px] mb-2"
          >
            İçerik Yönetimi
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight flex items-center gap-3">
            Kategoriler
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Eğitim kataloğundaki ana başlıkları ve sıralamayı buradan yönetin.
          </p>
        </div>
        <UpsertCategoryModal>
          <Button className="rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-primary/20 text-base">
            <Plus className="w-5 h-5" /> Yeni Kategori Ekle
          </Button>
        </UpsertCategoryModal>
      </div>

      <Card className="border-border/40 rounded-[2.5rem] bg-card overflow-hidden shadow-sm">
        <CardHeader className="px-8 pt-8 pb-4">
          <div className="relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Kategorilerde ara..."
              className="h-12 pl-11 rounded-xl bg-muted/30 border-border/50 focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30 border-y border-border/40">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="hover:bg-transparent px-8"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="h-14 px-8">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="group hover:bg-muted/20 border-b border-border/40 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-6 px-8">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-40 text-center"
                      >
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Layers className="w-10 h-10 opacity-20" />
                          <span className="font-bold">
                            Kategori bulunamadı.
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

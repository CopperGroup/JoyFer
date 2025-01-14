'use client'

import React, { useEffect, useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Product {
  id: string;
  vendor: string;
  name: string;
  isAvailable: boolean;
  price: number;
  priceToShow: number;
  category: string;
}

const ITEMS_PER_PAGE = 10;

const ProductsTable = ({ stringifiedProducts }: { stringifiedProducts: string }) => {
  const products: Product[] = useMemo(() => JSON.parse(stringifiedProducts), [stringifiedProducts]);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const router = useRouter();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = product[searchField as keyof Product];
      if (typeof searchValue === 'boolean') {
        return inputValue.toLowerCase() === searchValue.toString();
      }
      return searchValue.toString().toLowerCase().includes(inputValue.toLowerCase());
    });
  }, [products, searchField, inputValue]);

  const paginatedProducts = useMemo(() => {
    const start = (pageNumber - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, pageNumber]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setPageNumber(1);
  }, [searchField, inputValue]);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UAH',
  });

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === paginatedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map(product => product.id)));
    }
  };

  const handleBulkAction = () => {
    console.log("Bulk action on selected products:", Array.from(selectedProducts));
    // Implement your bulk action logic here
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 w-full sm:w-auto">
          <Input
            className="w-full"
            placeholder={`Search by ${searchField}...`}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
        </div>
        <Select onValueChange={(value) => setSearchField(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Search by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="id">ID</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="isAvailable">Is Available</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-center">
        <Button onClick={handleBulkAction} disabled={selectedProducts.size === 0}>
          Bulk Action ({selectedProducts.size})
        </Button>
        <div className="text-sm text-muted-foreground">
          Showing {((pageNumber - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(pageNumber * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedProducts.size === paginatedProducts.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Постачальник</TableHead>
              <TableHead>Назва</TableHead>
              <TableHead>Доступний</TableHead>
              <TableHead className="text-right">Ціна без знижки</TableHead>
              <TableHead className="text-right">Ціна із знижкою</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id} className="cursor-pointer hover:bg-slate-50 transition-all" onClick={() => router.push(`/admin/createProduct/list/${product.id}`)}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onCheckedChange={() => toggleProductSelection(product.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.vendor}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.isAvailable ? 'Так' : 'Ні'}</TableCell>
                <TableCell className="text-right font-medium">{formatter.format(product.price)}</TableCell>
                <TableCell className={`text-right font-medium ${product.priceToShow < product.price ? 'text-red-600' : ''}`}>
                  {formatter.format(product.priceToShow)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody> 
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Page {pageNumber} of {totalPages}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                // disabled={pageNumber === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  onClick={() => setPageNumber(i + 1)}
                  isActive={pageNumber === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            )).slice(0, 3)}
            {totalPages > 3 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))}
                // disabled={pageNumber === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default ProductsTable


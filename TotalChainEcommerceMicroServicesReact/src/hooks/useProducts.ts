import { useState, useEffect, useCallback, useMemo } from "react";
import type { IProduct } from "../interfaces/ecommerce.interfaces";
import { productsService } from "../services/products.service";

export const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchProducts = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Error loading products");
      console.error(err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(false);
    const interval = setInterval(() => {
      fetchProducts(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const toggleSort = useCallback(() => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.code.toLowerCase().includes(term) ||
          (p.referenceName && p.referenceName.toLowerCase().includes(term))
      );
    }

    result.sort((a, b) => {
      const val = a.name.localeCompare(b.name);
      return sortDirection === "asc" ? val : -val;
    });

    return result;
  }, [products, searchTerm, sortDirection]);

  const addProduct = async (product: Partial<IProduct>) => {
    try { await productsService.add(product); await fetchProducts(); }
    catch (err) { console.error(err); throw err; }
  };

  const updateProduct = async (product: IProduct) => {
    try { await productsService.update(product); await fetchProducts(); }
    catch (err) { console.error(err); throw err; }
  };

  const deleteProduct = async (id: string) => {
    try { await productsService.delete(id); await fetchProducts(); }
    catch (err) { console.error(err); throw err; }
  };

  return {
    products, filteredProducts, loading, error,
    searchTerm, setSearchTerm, sortDirection, toggleSort,
    addProduct, updateProduct, deleteProduct, refresh: fetchProducts,
  };
};

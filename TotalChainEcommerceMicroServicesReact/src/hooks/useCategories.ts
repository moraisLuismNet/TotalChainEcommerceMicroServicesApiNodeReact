import { useState, useEffect, useCallback } from "react";
import type { ICategory } from "../interfaces/ecommerce.interfaces";
import { categoriesService } from "../services/categories.service";

export const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err) {
      setError("Error loading categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const createCategory = async (category: Partial<ICategory>) => {
    try {
      await categoriesService.create(category);
      await fetchCategories();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateCategory = async (category: ICategory) => {
    try {
      await categoriesService.update(category);
      await fetchCategories();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoriesService.delete(id);
      await fetchCategories();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return { categories, loading, error, createCategory, updateCategory, deleteCategory, refresh: fetchCategories };
};

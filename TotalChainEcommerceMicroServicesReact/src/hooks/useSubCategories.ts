import { useState, useEffect, useCallback } from "react";
import type { ISubCategory } from "../interfaces/ecommerce.interfaces";
import { subcategoriesService } from "../services/subcategories.service";

export const useSubCategories = () => {
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await subcategoriesService.getAll();
      setSubCategories(data);
    } catch (err) {
      setError("Error loading subcategories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubCategories(); }, [fetchSubCategories]);

  const createSubCategory = async (subCategory: Partial<ISubCategory>) => {
    try {
      await subcategoriesService.add(subCategory);
      await fetchSubCategories();
    } catch (err) { console.error(err); throw err; }
  };

  const updateSubCategory = async (subCategory: ISubCategory) => {
    try {
      await subcategoriesService.update(subCategory);
      await fetchSubCategories();
    } catch (err) { console.error(err); throw err; }
  };

  const deleteSubCategory = async (id: string) => {
    try {
      await subcategoriesService.delete(id);
      await fetchSubCategories();
    } catch (err) { console.error(err); throw err; }
  };

  return {
    subCategories, loading, error,
    createSubCategory, updateSubCategory, deleteSubCategory, refresh: fetchSubCategories,
  };
};

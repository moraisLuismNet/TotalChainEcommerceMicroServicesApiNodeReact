import { useState, useEffect, useCallback } from "react";
import type { IReference } from "../interfaces/ecommerce.interfaces";
import { referencesService } from "../services/references.service";

export const useReferences = () => {
  const [references, setReferences] = useState<IReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await referencesService.getAll();
      setReferences(data);
    } catch (err) {
      setError("Error loading references");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReferences(); }, [fetchReferences]);

  const createReference = async (ref: Partial<IReference>) => {
    try { await referencesService.create(ref); await fetchReferences(); }
    catch (err) { console.error(err); throw err; }
  };

  const updateReference = async (ref: IReference) => {
    try { await referencesService.update(ref); await fetchReferences(); }
    catch (err) { console.error(err); throw err; }
  };

  const deleteReference = async (id: string) => {
    try { await referencesService.delete(id); await fetchReferences(); }
    catch (err) { console.error(err); throw err; }
  };

  return { references, loading, error, createReference, updateReference, deleteReference, refresh: fetchReferences };
};

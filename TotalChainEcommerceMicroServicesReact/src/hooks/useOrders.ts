import { useState, useEffect, useCallback, useMemo } from "react";
import type { IOrder } from "../interfaces/ecommerce.interfaces";
import { ordersService } from "../services/orders.service";

export const useOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchOrders = useCallback(async (email?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = email ? await ordersService.getByUserEmail(email) : await ordersService.getAll();
      setOrders(data);
    } catch (err) {
      setError("Error loading orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const toggleSort = useCallback(() => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.userEmail.toLowerCase().includes(term) ||
          o.paymentMethod?.toLowerCase().includes(term) ||
          o.idOrder.toString().includes(term)
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [orders, searchTerm, sortDirection]);

  return { orders, filteredOrders, loading, error, searchTerm, setSearchTerm, sortDirection, toggleSort, refresh: fetchOrders };
};

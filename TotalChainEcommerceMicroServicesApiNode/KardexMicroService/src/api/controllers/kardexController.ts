import { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";
import KardexService from "../../services/kardexService";
import axios from "axios";

const productsApi = process.env.MICROSERVICES_PRODUCTS_API || "http://localhost:5002";

async function getProductStock(productId: string, token: string): Promise<number> {
  try {
    const res = await axios.get(`${productsApi}/api/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data?.data?.stock ?? 0;
  } catch (err: any) {
    console.error("getProductStock error:", err.message, err.response?.status, err.response?.data);
    return 0;
  }
}

export class KardexController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const kardexes = await KardexService.getAllKardex();
      ResponseHelper.success(res, "Kardex entries retrieved", kardexes);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const kardex = await KardexService.getKardexById(id);
      if (!kardex) { ResponseHelper.notFound(res); return; }
      ResponseHelper.success(res, "Kardex entry retrieved", kardex);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message);
    }
  }
  async getByProductId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = req.params.productId;
      const kardexes = await KardexService.getKardexByProductId(productId);
      ResponseHelper.success(res, "Kardex entries retrieved", kardexes);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message);
    }
  }
  async createEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userEmail = req.userEmail || "system";
      const dto: any = { ...req.body, MovementType: "Entry" };
      if (dto.StockBefore === undefined || dto.StockAfter === undefined) {
        const currentStock = await getProductStock(dto.ProductId, req.headers.authorization?.split(" ")[1] || "");
        dto.StockBefore = currentStock;
        dto.StockAfter = currentStock + (dto.Quantity || 0);
      }
      const kardex = await KardexService.createKardex(dto, userEmail);
      // When ProductsMS calls us (via recordMovement), stock is already updated there
      if (req.headers['x-kardex-source'] !== 'products-ms') {
        try {
          await axios.post(`${productsApi}/api/stocks/add`, { productId: dto.ProductId, quantity: dto.Quantity }, {
            headers: { Authorization: `Bearer ${process.env.JWT_KEY || ''}` },
          });
        } catch (stockErr: any) {
          console.error("Failed to update stock in ProductsMS:", stockErr.message);
        }
      }
      ResponseHelper.created(res, "Kardex entry created", kardex);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message, 400);
    }
  }
  async createExit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userEmail = req.userEmail || "system";
      const dto: any = { ...req.body, MovementType: "Exit" };
      if (dto.StockBefore === undefined || dto.StockAfter === undefined) {
        const currentStock = await getProductStock(dto.ProductId, req.headers.authorization?.split(" ")[1] || "");
        dto.StockBefore = currentStock;
        dto.StockAfter = Math.max(0, currentStock - (dto.Quantity || 0));
      }
      const kardex = await KardexService.createKardex(dto, userEmail);
      // When ProductsMS calls us (via recordMovement), stock is already updated there
      if (req.headers['x-kardex-source'] !== 'products-ms') {
        try {
          await axios.post(`${productsApi}/api/stocks/remove`, { productId: dto.ProductId, quantity: dto.Quantity }, {
            headers: { Authorization: `Bearer ${process.env.JWT_KEY || ''}` },
          });
        } catch (stockErr: any) {
          console.error("Failed to update stock in ProductsMS:", stockErr.message);
        }
      }
      ResponseHelper.created(res, "Kardex exit created", kardex);
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message, 400);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const result = await KardexService.deleteKardex(id);
      if (!result) { ResponseHelper.notFound(res); return; }
      ResponseHelper.success(res, "Kardex entry deleted");
    } catch (err: any) {
      ResponseHelper.error(res, err.message, err.message);
    }
  }
}
export default new KardexController();

import { CreateKardexDTO } from "../core/dtos/Kardex/CreateKardexDTO";
import { KardexRepository } from "../database/repositories/KardexRepository";
import Kardex from "../database/models/Kardex";
import HttpAuditLogService from "./httpClients/HttpAuditLogService";
export class KardexService {
  private kardexRepo: KardexRepository;
  constructor() { this.kardexRepo = new KardexRepository(); }
  async createKardex(dto: CreateKardexDTO, userEmail: string = "system"): Promise<Kardex> {
    const kardex = await this.kardexRepo.create(dto);
    HttpAuditLogService.sendLog("CREATE_KARDEX", "Kardex", kardex.Id, `Kardex entry for product ${dto.ProductId} - ${dto.MovementType}`, userEmail).catch(() => {});
    return kardex;
  }
  async getKardexById(id: number): Promise<Kardex | null> {
    return this.kardexRepo.findById(id);
  }
  async getAllKardex(): Promise<Kardex[]> {
    return this.kardexRepo.findAll();
  }
  async getKardexByProductId(productId: string): Promise<Kardex[]> {
    return this.kardexRepo.findByProductId(productId);
  }
  async deleteKardex(id: number): Promise<boolean> {
    const result = await this.kardexRepo.delete(id);
    if (result) {
      await HttpAuditLogService.sendLog("DELETE_KARDEX", "Kardex", id, `Kardex entry ${id} deleted`, "system");
    }
    return result;
  }
}
export default new KardexService();

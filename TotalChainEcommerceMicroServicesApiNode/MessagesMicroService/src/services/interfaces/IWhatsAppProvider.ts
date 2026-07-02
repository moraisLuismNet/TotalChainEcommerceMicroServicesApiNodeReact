export interface IWhatsAppProvider {
  sendMessage(phoneNumber: string, message: string): Promise<boolean>;
}

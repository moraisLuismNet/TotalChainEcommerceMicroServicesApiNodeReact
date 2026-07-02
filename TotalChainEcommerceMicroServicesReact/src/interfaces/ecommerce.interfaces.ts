export interface ICategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  subCategoryCount?: number;
}

export interface ISubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  isActive: boolean;
  referenceCount?: number;
}

export interface IReference {
  id: string;
  name: string;
  description: string;
  subCategoryId: string;
  subCategoryName?: string;
  isActive: boolean;
  productCount?: number;
}

export interface IProduct {
  id: string;
  code: string;
  name: string;
  description: string;
  imageProduct: string | null;
  referenceId: string;
  referenceName?: string;
  unitPrice: number;
  costPrice: number;
  minStock: number;
  stock: number;
  isActive: boolean;
  inCart?: boolean;
  amount?: number;
}

export interface ICartDetail {
  idCartDetail?: number;
  productId: string;
  productName?: string;
  productCode?: string;
  imageProduct?: string;
  amount: number;
  unitPrice: number;
  price?: number;
  cartId: number;
  total?: number;
}

export interface ICartDetailItem {
  idCartDetail: number;
  cartId: number;
  productId: string;
  amount: number;
  price: number;
  total: number;
  productName?: string;
  productCode?: string;
  imageProduct?: string | null;
}

export interface ICart {
  idCart: number;
  userEmail: string;
  totalPrice: number;
  enabled?: boolean;
  cartDetails?: ICartDetailItem[];
}

export interface IOrder {
  idOrder: number;
  orderDate: string;
  paymentMethod: string;
  total: number;
  userEmail: string;
  cartId: number;
  status?: string;
  details: IOrderDetail[];
}

export interface IOrderDetail {
  idOrderDetail: number;
  orderId: number;
  productId: string;
  productName?: string;
  amount: number;
  price: number;
  total: number;
}

export interface IUser {
  email: string;
  name?: string;
  role: string;
  address?: string | null;
  phoneNumber?: string | null;
}

export interface CartDetailItem {
  idCartDetail: number;
  cartId: number;
  productId: string;
  imageProduct: string;
  productName: string;
  referenceName: string;
  amount: number;
  price: number;
  total: number;
}

export interface IAuditLog {
  id: number;
  entityName: string;
  entityId: string;
  action: string;
  oldValues?: string;
  newValues?: string;
  changedBy: string;
  changedAt: string;
}

export interface IKardexMovement {
  id: number;
  productId: string;
  productName?: string;
  productCode?: string;
  date: string;
  movementType: string;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
}

export interface IMessage {
  notificationQueueId: number;
  phoneNumber: string;
  message: string;
  orderId: number;
  status: string;
  retryCount: number;
  errorMessage?: string;
  createdAt: string;
  sentAt?: string;
  scheduledAt: string;
}

export interface IMailMessage {
  idEmailQueue: number;
  toEmail: string;
  subject: string;
  body: string;
  emailType: string;
  scheduledSendTime: string;
  sentAt?: string;
  errorMessage?: string;
  createdAt: string;
  orderId?: number;
  metadata?: string;
}

export interface IShipment {
  id: number;
  orderId: number;
  trackingNumber: string;
  status: string;
  originAddress: string;
  destinationAddress: string;
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  currentLatitude?: number;
  currentLongitude?: number;
  createdAt: string;
  outForDeliveryAt?: string;
  inTransitAt?: string;
  deliveredAt?: string;
  userEmail: string;
}

export interface IApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

import { sequelize } from "../../core/config/database";
import { Cart } from "./Cart";
import { CartDetail, setupCartDetailAssociations } from "./CartDetail";
import { Order } from "./Order";
import { OrderDetail, setupOrderDetailAssociations } from "./OrderDetail";

setupCartDetailAssociations();
setupOrderDetailAssociations();

export { sequelize, Cart, CartDetail, Order, OrderDetail };

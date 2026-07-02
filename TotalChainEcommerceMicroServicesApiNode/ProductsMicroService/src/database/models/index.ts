import { sequelize } from "../../core/config/database";
import { Category } from "./Category";
import { SubCategory, setupSubCategoryAssociations } from "./SubCategory";
import { Reference, setupReferenceAssociations } from "./Reference";
import { Product, setupProductAssociations } from "./Product";
import { Stock, setupStockAssociations } from "./Stock";

setupSubCategoryAssociations();
setupReferenceAssociations();
setupProductAssociations();
setupStockAssociations();

Product.hasMany(Stock, { foreignKey: 'ProductId', as: 'Stocks' });

export { sequelize, Category, SubCategory, Reference, Product, Stock };

'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    await queryInterface.bulkInsert('Categories', [
      { Id: 'cat1', Name: 'FIRST CATEGORY', Description: 'Electronic devices and accessories', IsActive: true, CreatedAt: now, UpdatedAt: now },
      { Id: 'cat2', Name: 'SECOND CATEGORY', Description: 'Apparel and fashion items', IsActive: true, CreatedAt: now, UpdatedAt: now },
    ]);
    await queryInterface.bulkInsert('SubCategories', [
      { Id: 'sub1', Name: 'FIRST SUBCATEGORY', Description: 'Mobile phones', CategoryId: 'cat1', IsActive: true, CreatedAt: now, UpdatedAt: now },
      { Id: 'sub2', Name: 'SECOND SUBCATEGORY', Description: 'Portable computers', CategoryId: 'cat1', IsActive: true, CreatedAt: now, UpdatedAt: now },
      { Id: 'sub3', Name: 'THIRD SUBCATEGORY', Description: 'Clothing for men', CategoryId: 'cat2', IsActive: true, CreatedAt: now, UpdatedAt: now },
    ]);
    await queryInterface.bulkInsert('References', [
      { Id: 'ref1', Name: 'FIRST REFERENCE', Description: 'Apple smartphones', SubCategoryId: 'sub1', IsActive: true, CreatedAt: now, UpdatedAt: now },
      { Id: 'ref2', Name: 'SECOND REFERENCE', Description: 'Samsung smartphones', SubCategoryId: 'sub1', IsActive: true, CreatedAt: now, UpdatedAt: now },
      { Id: 'ref3', Name: 'THIRD REFERENCE', Description: 'Lenovo laptops', SubCategoryId: 'sub2', IsActive: true, CreatedAt: now, UpdatedAt: now },
    ]);
    await queryInterface.bulkInsert('Products', [
      { Id: 'prod1', Code: 'IPH15P', Name: 'FIRST PRODUCT', Description: 'Apple iPhone 15 Pro 256GB', ReferenceId: 'ref1', UnitPrice: 1099.99, CostPrice: 899.99, MinStock: 5, IsActive: true, ImageProduct: 'https://imgur.com/httwRAh.png', CreatedAt: now, UpdatedAt: now },
      { Id: 'prod2', Code: 'SGS24', Name: 'SECOND PRODUCT', Description: 'Samsung Galaxy S24 128GB', ReferenceId: 'ref2', UnitPrice: 799.99, CostPrice: 649.99, MinStock: 5, IsActive: true, ImageProduct: 'https://imgur.com/VOdqZx6.png', CreatedAt: now, UpdatedAt: now },
      { Id: 'prod3', Code: 'LT14G', Name: 'THIRD PRODUCT', Description: 'Lenovo ThinkPad X1 Carbon Gen 11', ReferenceId: 'ref3', UnitPrice: 1599.99, CostPrice: 1299.99, MinStock: 3, IsActive: true, ImageProduct: 'https://imgur.com/143j93g.png', CreatedAt: now, UpdatedAt: now },
    ]);
    await queryInterface.bulkInsert('Stocks', [
      { Id: 'stk1', ProductId: 'prod1', Quantity: 10, Warehouse: 'Main', CreatedBy: 'seed' },
      { Id: 'stk2', ProductId: 'prod2', Quantity: 20, Warehouse: 'Main', CreatedBy: 'seed' },
      { Id: 'stk3', ProductId: 'prod3', Quantity: 25, Warehouse: 'Main', CreatedBy: 'seed' },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Stocks', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('References', null, {});
    await queryInterface.bulkDelete('SubCategories', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
  }
};

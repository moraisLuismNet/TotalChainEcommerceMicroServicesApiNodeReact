'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('SubCategories', {
      fields: ['CategoryId'],
      type: 'foreign key',
      name: 'fk_subcategories_category',
      references: { table: 'Categories', field: 'Id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('References', {
      fields: ['SubCategoryId'],
      type: 'foreign key',
      name: 'fk_references_subcategory',
      references: { table: 'SubCategories', field: 'Id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('Products', {
      fields: ['ReferenceId'],
      type: 'foreign key',
      name: 'fk_products_reference',
      references: { table: 'References', field: 'Id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('Stocks', {
      fields: ['ProductId'],
      type: 'foreign key',
      name: 'fk_stocks_product',
      references: { table: 'Products', field: 'Id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('SubCategories', 'fk_subcategories_category');
    await queryInterface.removeConstraint('References', 'fk_references_subcategory');
    await queryInterface.removeConstraint('Products', 'fk_products_reference');
    await queryInterface.removeConstraint('Stocks', 'fk_stocks_product');
  }
};

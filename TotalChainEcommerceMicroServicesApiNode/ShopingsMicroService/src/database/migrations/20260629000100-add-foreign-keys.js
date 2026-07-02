'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('CartDetails', {
      fields: ['CartId'],
      type: 'foreign key',
      name: 'fk_cartdetails_cart',
      references: { table: 'Carts', field: 'IdCart' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('OrderDetails', {
      fields: ['OrderId'],
      type: 'foreign key',
      name: 'fk_orderdetails_order',
      references: { table: 'Orders', field: 'IdOrder' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('CartDetails', 'fk_cartdetails_cart');
    await queryInterface.removeConstraint('OrderDetails', 'fk_orderdetails_order');
  }
};

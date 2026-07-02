'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    await queryInterface.bulkInsert('Carts', [{
      IdCart: 1,
      UserEmail: 'luis@mail.com',
      TotalPrice: 0,
      Enabled: true,
      CreatedAt: now,
      UpdatedAt: now,
    }]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Carts', { IdCart: 1 });
  }
};

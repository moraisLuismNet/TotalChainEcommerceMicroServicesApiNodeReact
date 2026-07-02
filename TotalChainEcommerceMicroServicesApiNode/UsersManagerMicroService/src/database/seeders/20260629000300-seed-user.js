'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('123456', salt);
    await queryInterface.bulkInsert('Users', [{
      Email: 'luis@mail.com',
      Name: 'Admin',
      Password: hash,
      Salt: salt,
      Role: 'Admin',
      CartId: 1,
      Address: 'Admin Address',
      PhoneNumber: '650841201',
    }]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { Email: 'luis@mail.com' });
  }
};

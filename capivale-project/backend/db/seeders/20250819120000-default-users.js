'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add a more significant delay to ensure table is ready
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay

    const hashedPasswordAdmin = await bcrypt.hash('password123', 10);
    const hashedPasswordMerchant = await bcrypt.hash('password123', 10);
    const hashedPasswordCitizen = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        id: Sequelize.literal('gen_random_uuid()'), // Use UUID generation
        name: 'Admin User',
        email: 'admin@example.com',
        cpf: '111.111.111-11',
        password: hashedPasswordAdmin,
        role: 'admin',
        status: 'active',
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Merchant User',
        email: 'merchant@example.com',
        cpf: '222.222.222-22',
        password: hashedPasswordMerchant,
        role: 'merchant',
        status: 'active',
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Citizen User',
        email: 'testuser@example.com',
        cpf: '333.333.333-33',
        password: hashedPasswordCitizen,
        role: 'citizen',
        status: 'active',
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

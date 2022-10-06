'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Users', [{
      firstName: 'Valid Phone',
      lastName: 'Numer',
      phone: '+447000000070',
      email: 'valid.phone.number@example.com',
      // This is the SHA256 hash for value of `password`
      password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }, {
      firstName: 'Valid Phone',
      lastName: 'Number SIM changed',
      phone: '+447000000008',
      email: 'valid.phone.number.sim.changed@example.com',
      // This is the SHA256 hash for value of `password`
      password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }, {
      firstName: 'Invalid Phone',
      lastName: 'Number',
      phone: '+447000000001',
      email: 'invalid.phone.number@example.com',
      // This is the SHA256 hash for value of `password`
      password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users', null, {});
  }
};

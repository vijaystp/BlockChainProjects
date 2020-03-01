'use strict';

const registrarcontract = require('./registrar-contract.js');
const userscontract = require('./users-contract.js');
module.exports.registrarcontract = registrarcontract;
module.exports.userscontract = userscontract;
module.exports.contracts = [registrarcontract, userscontract];

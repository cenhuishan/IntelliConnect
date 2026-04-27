const { request } = require('../utils/request');

const bindProduct = (data) => request({ url: '/api/v2/userProductBind', method: 'POST', data });
const unbindProduct = (data) => request({ url: '/api/v2/userProductUnbind', method: 'POST', data });

module.exports = { bindProduct, unbindProduct };

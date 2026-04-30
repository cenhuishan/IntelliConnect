const { uploadFile } = require('../utils/request');

const uploadBigFile = (filePath, formData) => uploadFile({ url: '/upload/bigfile', filePath, name: 'file', formData });

module.exports = { uploadBigFile };

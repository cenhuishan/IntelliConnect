const { getToken, getBaseUrl } = require('./storage');

function request({ url, method = 'GET', data, params, header = {} }) {
  return new Promise((resolve, reject) => {
    const baseUrl = getBaseUrl();
    const token = getToken();
    let fullUrl = baseUrl + url;

    if (params) {
      const queryStr = Object.keys(params)
        .filter(k => params[k] !== undefined && params[k] !== null)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&');
      if (queryStr) fullUrl += '?' + queryStr;
    }

    const headers = {
      'Content-Type': 'application/json',
      ...header
    };
    if (token) {
      headers['Authorization'] = token;
    }

    wx.request({
      url: fullUrl,
      method,
      data,
      header: headers,
      success(res) {
        const { data: resData } = res;
        if (resData && resData.errorCode === 2001) {
          wx.removeStorageSync('access-token');
          wx.reLaunch({ url: '/pages/login/index' });
          reject(resData);
          return;
        }
        resolve(resData);
      },
      fail(err) {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

function uploadFile({ url, filePath, name, formData = {}, header = {} }) {
  return new Promise((resolve, reject) => {
    const baseUrl = getBaseUrl();
    const token = getToken();
    const headers = { ...header };
    if (token) headers['Authorization'] = token;

    wx.uploadFile({
      url: baseUrl + url,
      filePath,
      name,
      formData,
      header: headers,
      success(res) {
        try {
          const data = JSON.parse(res.data);
          if (data && data.errorCode === 2001) {
            wx.removeStorageSync('access-token');
            wx.reLaunch({ url: '/pages/login/index' });
            reject(data);
            return;
          }
          resolve(data);
        } catch (e) {
          resolve(res.data);
        }
      },
      fail(err) {
        wx.showToast({ title: '上传失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

module.exports = { request, uploadFile };

const TOKEN_KEY = 'access-token';
const BASE_URL_KEY = 'baseUrl';

function getToken() {
  return wx.getStorageSync(TOKEN_KEY) || '';
}

function setToken(token) {
  wx.setStorageSync(TOKEN_KEY, token);
  const app = getApp();
  if (app) app.globalData.token = token;
}

function clearToken() {
  wx.removeStorageSync(TOKEN_KEY);
  const app = getApp();
  if (app) app.globalData.token = '';
}

function getBaseUrl() {
  return wx.getStorageSync(BASE_URL_KEY) || 'http://47.116.141.183:8080';
}

function setBaseUrl(url) {
  wx.setStorageSync(BASE_URL_KEY, url);
  const app = getApp();
  if (app) app.globalData.baseUrl = url;
}

module.exports = { getToken, setToken, clearToken, getBaseUrl, setBaseUrl };

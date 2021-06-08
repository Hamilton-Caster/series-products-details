import axios from 'axios/index'
import { ProductTypes } from './components/enums'

const getHeaders = function (svc, antiForgery) {
  let headers = {}
  headers["ModuleId"] = svc.moduleId
  headers["TabId"] = getTabId()
  if (antiForgery) {
    headers["RequestVerificationToken"] = antiForgery
  }
  return headers
}

const getServiceRoot = function (path) {
  let serviceRoot = `${location.origin}`;
  serviceRoot += "/DesktopModules/" + path + "/";
  return serviceRoot;
}

const getTabId = function () {
  return dnn.getVar("sf_tabId", -1)
}

const GridDetailsLink = `${getServiceRoot('AcuitiSolutions')}CatalogGrid/API/List/GetGridDetails`

const getListAPI = function (commodityID, detailLink) {
  // let headers = getHeaders(svc, antiForgery)
  return axios.get(`${GridDetailsLink}?commodityID=${commodityID}&detailLink=${detailLink}`)
    .then(res => res.data)
}

const GetMenuAPI = function (ProductID) {
  let baseUrl = `${getServiceRoot('AcuitiSolutions')}ProductsBySeries/List/GetProductNavBySeries`
  return axios.get(`${baseUrl}?ProductID=${ProductID}`)
    .then(res => res.data)
}

export {
  getListAPI,
  GetMenuAPI
}

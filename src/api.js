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
  serviceRoot += "/API/" + path + "/";
  return serviceRoot;
}

const getTabId = function () {
  return dnn.getVar("sf_tabId", -1)
}

const getListAPI = function (svc, antiForgery, configuratorParams) {
  let headers = getHeaders(svc, antiForgery)
  let baseUrl = `${getServiceRoot(svc.path)}ProductConfigurator/GetProductConfiguratorResults`
  return axios.post(baseUrl, configuratorParams, {headers})
    .then(res => res)
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

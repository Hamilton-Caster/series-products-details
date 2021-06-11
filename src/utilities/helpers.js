const getKeyByValue = function (obj, value) {
  return Object.keys(obj).find(key => obj[key] === value)
}

function dynamicSort(property, sortOrder = 1, isCurrency) {
  if(property[0] === "-") {
    sortOrder = -1
    property = property.substr(1)
  }

  return function (a,b) {

    let valueA = a[property]
    let valueB = b[property]

    // convert to integers if money
    if (isCurrency && a[property][0] === '$') {
      valueA = a[property].substr(1).replace(',', '')
      valueA = parseInt(valueA)
      valueB = b[property].substr(1).replace(',', '')
      valueB = parseInt(valueB)
    }

    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    let result = (valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0
    return result * sortOrder
  }
}

export default {
  getKeyByValue,
  dynamicSort
}

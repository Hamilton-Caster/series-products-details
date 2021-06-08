import helpers from '@/utilities/helpers'

export class Enumeration {
  constructor (obj) {
    for (const key in obj) {
      this[key] = obj[key]
    }
    return Object.freeze(this)
  }

  getArray (nameProperty = 'name', valueProperty = 'value') {
    let array = Object.entries(this).map(([key]) => {
      if (typeof this[key] !== 'function') {
        return {
          [nameProperty]: key,
          [valueProperty]: this[key]
        }
      }
    })
    return array
  }
  has (key) {
    return this.hasOwnProperty(key)
  }
  getKey (value) {
    return helpers.getKeyByValue(this, value)
  }
}

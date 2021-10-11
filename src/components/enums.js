import {Enumeration} from '@/utilities/enums'

const AttributeTypes = new Enumeration({
  Checkbox: 'CheckBox',
  Dropdown: 'DropDownList',
  Boolean: 'Boolean'
})

const AttributeEnabled = new Enumeration({
  Disabled: 0,
  Enabled: 1
})

const SortDirection = new Enumeration({
  Descending: 'DESC',
  Ascending: 'ASC'
})

const ProductTypes = new Enumeration({
  Casters: 0,
  Wheels: 1
})

const ListType = new Enumeration({
  Application: 1,
  Series: 2
})

export {
  AttributeTypes,
  AttributeEnabled,
  ListType,
  ProductTypes,
  SortDirection
}

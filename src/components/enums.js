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

const FinderClassNames = new Enumeration({
  Expanded: 'finder-expanded',
  Collapsed: 'finder-collapsed'
})

const SortDirection = new Enumeration({
  Descending: 'DESC',
  Ascending: 'ASC'
})

const ProductAttributeTypes = new Enumeration({
  Rating: 'Rating',
  Html: 'HTML',
  String: 'String',
  Number: 'Number'
})

const ProductTypes = new Enumeration({
  Casters: 0,
  Wheels: 1
})

const ProductSeries = new Enumeration({
  Wheels: 1,
  Casters: 3
})

const ListType = new Enumeration({
  Application: 1,
  Series: 2
})

const SessionStorageKeys = [
  'ConfiguratorType',
  'Pagination',
  'SortOrder',
  'SortBy',
  'SelectedAttributes_Casters',
  'SelectedAttributes_Wheels'
]

const MenuStorage = new Enumeration({
  Casters: 'CastersApplicationLinks',
  Wheels: 'WheelsApplicationLinks'
})

const ScrollToResults = 'scrollToResults'

export {
  AttributeTypes,
  AttributeEnabled,
  FinderClassNames,
  ListType,
  MenuStorage,
  ProductAttributeTypes,
  ProductSeries,
  ProductTypes,
  ScrollToResults,
  SessionStorageKeys,
  SortDirection
}

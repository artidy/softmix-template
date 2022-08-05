const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  CategoryServiceInterface: Symbol.for('CategoryServiceInterface'),
  CategoryController: Symbol.for('CategoryController'),
  ProductServiceInterface: Symbol.for('ProductServiceInterface'),
  ProductController: Symbol.for('ProductController'),
  ExceptionFilterInterface: Symbol.for('ExceptionFilterInterface'),
  CompanyEmailServiceInterface: Symbol.for('CompanyEmailServiceInterface'),
  CompanyEmailController: Symbol.for('CompanyEmailController'),
  CompanyPhoneServiceInterface: Symbol.for('CompanyPhoneServiceInterface'),
  CompanyPhoneController: Symbol.for('CompanyPhoneController'),
  ServiceService: Symbol.for('ServiceService'),
  ServiceController: Symbol.for('ServiceController')
}

export default Component;

const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  CategoryServiceInterface: Symbol.for('CategoryServiceInterface'),
  CategoryController: Symbol.for('CategoryController'),
  ProductServiceInterface: Symbol.for('ProductServiceInterface'),
  ProductController: Symbol.for('ProductController'),
  ExceptionFilterInterface: Symbol.for('ExceptionFilterInterface')
}

export default Component;

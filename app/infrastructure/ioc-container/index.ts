import awilix from 'awilix';
export const appDi = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC,
  strict: true,
});

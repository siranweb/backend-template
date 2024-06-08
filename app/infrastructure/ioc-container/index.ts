import awilix from 'awilix';
export const di = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC,
  strict: true,
});

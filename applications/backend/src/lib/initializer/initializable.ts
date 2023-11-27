export const initializableSymbol = Symbol('initializable');

export const markInitializable = (target: any) => {
  Reflect.set(target, initializableSymbol, true);
};

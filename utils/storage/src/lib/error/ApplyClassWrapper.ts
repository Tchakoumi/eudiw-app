/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Define the decorator factory for applying wrapper method to all methods of a class
 *
 * @param wrapperMethod The wrapper method
 * @returns Targeted class
 */

export function ApplyClassWrapper<T extends { new (...args: any[]): object }>(
  wrapperMethod: (
    methodName: keyof InstanceType<T>,
    originalMethod: (...args: any[]) => any
  ) => any
) {
  return function (TargetClass: T) {
    const targetMethods = Object.getOwnPropertyNames(
      TargetClass.prototype
    ) as Array<keyof InstanceType<T>>;
    for (const methodName of targetMethods) {
      const originalMethod = TargetClass.prototype[methodName];
      if (typeof originalMethod === 'function') {
        TargetClass.prototype[methodName] = wrapperMethod(
          methodName,
          originalMethod
        );
      }
    }
    return TargetClass;
  };
}

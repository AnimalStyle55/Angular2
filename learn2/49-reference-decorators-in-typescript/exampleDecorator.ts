// Parameterized types (type need not be 'T')
export function sprayPaint<T extends Function>(ClassConstructorFn: T): T {
  ClassConstructorFn.prototype.pickColor = function() {
    return "red";
  };

  return ClassConstructorFn;
}

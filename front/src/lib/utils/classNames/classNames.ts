export type ClassNamesObject = {
  [key: string]: boolean | { subClass: boolean };
};

export function classNames(classes: ClassNamesObject): string {
  let result = "";
  Object.keys(classes).map((className) => {
    if (classes[className] instanceof Object) {
      const { subClass } = classes[className] as { subClass: boolean };
      if (subClass) result = `${result}-${className}`;
    } else if (classes[className] != false) {
      result = `${result} ${className}`;
    }
  });
  return result;
}

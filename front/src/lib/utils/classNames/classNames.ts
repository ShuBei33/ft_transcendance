export type ClassNamesObject = { [key: string]: boolean };

export function classNames(classes: ClassNamesObject): string {
  return Object.keys(classes)
    .filter((className) => classes[className])
    .join(" ");
}

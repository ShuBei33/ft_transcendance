export function deepCopy<T>(obj: T): T {
  // Check if the input is an object
  if (typeof obj !== "object" || obj === null) {
    return obj; // If not an object, return it as is (base case)
  }

  // Create a new object or array, depending on the type of obj
  const copy: any = Array.isArray(obj) ? [] : {};

  // Recursively copy each property in obj
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }

  return copy as T;
}

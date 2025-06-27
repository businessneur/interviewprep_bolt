/**
 * Utility functions for converting between camelCase and snake_case
 * Used for API communication with Python backend
 */

export function convertKeysToSnake(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnake);
  }

  const converted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    converted[snakeKey] = convertKeysToSnake(value);
  }

  return converted;
}

export function convertKeysToCamel(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamel);
  }

  const converted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    converted[camelKey] = convertKeysToCamel(value);
  }

  return converted;
}
function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function mapObjectKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const camelKey = toCamelCase(key);
    const value = obj[key];
    if (Array.isArray(value)) {
      result[camelKey] = value.map((item) =>
        typeof item === "object" && item !== null && !(item instanceof Date)
          ? mapObjectKeys(item as Record<string, unknown>)
          : item
      );
    } else if (typeof value === "object" && value !== null && !(value instanceof Date)) {
      result[camelKey] = mapObjectKeys(value as Record<string, unknown>);
    } else {
      result[camelKey] = value;
    }
  }
  return result;
}

export function extractData<T>(response: unknown): T[] {
  const resp = response as Record<string, unknown>;
  let data: unknown[] = [];

  if (resp.data && Array.isArray(resp.data)) {
    data = resp.data;
  } else if (resp.$values && Array.isArray(resp.$values)) {
    data = resp.$values;
  } else if (Array.isArray(response)) {
    data = response;
  } else if (resp.data && typeof resp.data === "object") {
    const nested = resp.data as Record<string, unknown>;
    if (nested.$values && Array.isArray(nested.$values)) {
      data = nested.$values;
    }
  }

  return data.map((item) => {
    if (typeof item === "object" && item !== null) {
      return mapObjectKeys(item as Record<string, unknown>) as unknown as T;
    }
    return item as unknown as T;
  });
}

export function extractItem<T>(response: unknown): T {
  const resp = response as Record<string, unknown>;
  let item = resp.data as Record<string, unknown> | undefined;

  if (!item && (resp as Record<string, unknown>).id == null) {
    item = resp;
  }

  if (item && typeof item === "object") {
    return mapObjectKeys(item) as unknown as T;
  }
  return response as T;
}

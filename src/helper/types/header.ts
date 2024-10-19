export interface ErpHeaders {
  [key: string]: string;
}

export function parseHeaders(headerString: string): ErpHeaders {
  const headers: ErpHeaders = {};
  const lines = headerString.split("\n");

  lines.forEach((line) => {
    const [key, value] = line.split(":").map((part) => part.trim());
    if (key && value) {
      headers[key] = value;
    }
  });

  return headers;
}

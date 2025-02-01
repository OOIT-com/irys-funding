import { Buffer } from 'buffer';

export function uint8Array2Hex(u: Uint8Array): string {
  return Buffer.from(u).toString('hex');
}

export function displayKey(s: string): string {
  if (!s || s.length < 11) {
    return s;
  }
  return `${s.substring(0, 6)}...${s.substring(s.length - 4)}`;
}

export function jsonToBase64(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}

export function base64ToJson(s: string): unknown {
  return JSON.parse(Buffer.from(s, 'base64').toString());
}

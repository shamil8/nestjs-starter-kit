import { customAlphabet } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  12,
);

export function getNANOID(): string {
  return nanoid();
}

export function getUUID(): string {
  return uuidv4();
}

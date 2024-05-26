import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encrypt(text: string, key: string) {
  return [...text]
    .map((x, i) =>
      (x.codePointAt(0)! ^ key.charCodeAt(i % key.length) % 255)
        .toString(16)
        .padStart(2, '0')
    )
    .join('');
}

export function decrypt(text: string, key: string) {
  return String.fromCharCode(
    ...text
      .match(/.{1,2}/g)!
      .map((e, i) => parseInt(e, 16) ^ key.charCodeAt(i % key.length) % 255)
  );
}

export function simpleEncrypt(text: string, key: number) {
  var result = '';
  for (var i = 0; i < text.length; i++) {
    var charCode = (text.charCodeAt(i) + key) % 256;
    result += String.fromCharCode(charCode);
  }
  return result;
}

export function simpleDecrypt(text: string, key: number) {
  var result = '';
  for (var i = 0; i < text.length; i++) {
    var charCode = (text.charCodeAt(i) - key + 256) % 256;
    result += String.fromCharCode(charCode);
  }
  return result;
}

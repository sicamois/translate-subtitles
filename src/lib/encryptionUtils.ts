'use server';
import 'server-only';

const key = process.env.ENCRYPTION_KEY!;

export async function encrypt(text: string) {
  return new Promise<string>((resolve) =>
    resolve(
      [...text]
        .map((x, i) =>
          (x.codePointAt(0)! ^ key.charCodeAt(i % key.length) % 255)
            .toString(16)
            .padStart(2, '0'),
        )
        .join(''),
    ),
  );
}

export async function decrypt(text: string) {
  return new Promise<string>((resolve) =>
    resolve(
      String.fromCharCode(
        ...text
          .match(/.{1,2}/g)!
          .map(
            (e, i) => parseInt(e, 16) ^ key.charCodeAt(i % key.length) % 255,
          ),
      ),
    ),
  );
}

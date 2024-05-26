'use server';

import { z } from 'zod';
import { permanentRedirect } from 'next/navigation';
import { encrypt } from '@/lib/utils';
import { type PutBlobResult, put } from '@vercel/blob';

export async function uploadFile(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const schema = z.object({
    file: z.instanceof(File),
  });
  const parse = schema.safeParse({
    file: formData.get('file'),
  });

  if (!parse.success) {
    return { message: 'Erreur lors de la récupération du fichier' };
  }

  const file = parse.data.file;
  let blob: PutBlobResult;

  try {
    const arrayBuffer = await file.arrayBuffer();
    // const buffer = new Uint8Array(arrayBuffer);

    blob = await put(file.name, arrayBuffer, { access: 'public' });
  } catch (e) {
    console.error(e);
    return { message: "Erreur lors de l'écriture du fichier" };
  }

  const encryptedFile = encrypt(blob.url, process.env.KEY!);

  permanentRedirect(`/modify-subtitles?file=${encryptedFile}`);
}

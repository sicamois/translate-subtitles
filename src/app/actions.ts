'use server';

import { z } from 'zod';
import fs from 'node:fs/promises';
import { permanentRedirect } from 'next/navigation';
import { encrypt } from '@/lib/utils';

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

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    await fs.writeFile(`.public/${file.name}`, buffer);
  } catch (e) {
    console.error(e);
    return { message: "Erreur lors de l'écriture du fichier" };
  }

  const encryptedFilename = encrypt(file.name, process.env.KEY!);

  permanentRedirect(`/modify-subtitles?file=${encryptedFilename}`);
}

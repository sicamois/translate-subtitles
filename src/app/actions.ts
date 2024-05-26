'use server';

import { z } from 'zod';

export async function uploadFile(
  prevState: {
    message: string;
    xmlData?: string;
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

  const data = parse.data;

  try {
    const arrayBuffer = await data.file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const xmlData = new TextDecoder().decode(buffer);
    return { message: 'Fichier chargé', xmlData };
  } catch (e) {
    return { message: 'Erreur lors de la récupération du fichier' };
  }
}

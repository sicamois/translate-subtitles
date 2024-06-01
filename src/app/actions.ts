'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { encrypt } from '@/lib/utils';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Subtitle } from '@/lib/fcpxmlParser';
import { TargetLanguageCode, Translator } from 'deepl-node';

export async function uploadFile(
  currentState: {
    message: string;
  },
  formData: FormData
) {
  const s3Client = new S3Client({ region: 'eu-west-3' });

  const schema = z.object({
    file: z.instanceof(File),
  });
  const parse = schema.safeParse({
    file: formData.get('file'),
  });

  if (!parse.success) {
    return {
      message: 'Erreur lors de la récupération du fichier',
    };
  }

  const file = parse.data.file;
  let s3output: PutObjectCommandOutput;

  try {
    // Put an object into an Amazon S3 bucket.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.name,
      Body: buffer,
    });
    s3output = await s3Client.send(command);
  } catch (e) {
    console.error(e);
    return {
      message: 'Erreur lors du téléchargement du fichier',
    };
  }

  const encryptedFile = encrypt(file.name, process.env.KEY!);

  redirect(`/translate?file=${encryptedFile}`);
}

// export async function createFile(
//   currentState: {
//     subtitles: Subtitle[];
//     videoTitle: string;
//     url?: string;
//     message: string;
//   },
//   fromData: FormData
// ) {
//   const s3Client = new S3Client({ region: 'eu-west-3' });

//   const language = fromData.get('language');
//   const translations = Array.from(fromData.entries()).filter(
//     ([key]) => key !== 'language'
//   );
//   const srtSubtites = translations.map(([ref, translation], index) => {
//     const subtitle = currentState.subtitles.find(
//       (subtitle) => subtitle.ref === ref
//     );
//     return `${index + 1}\n${subtitle?.timelineIn} --> ${
//       subtitle?.timelineOut
//     }\n${translation}`;
//   });

//   const srtData = `${srtSubtites.join('\n\n')}`;

//   const generatedFilename = `generated/${currentState.videoTitle} - SUB ${language}.srt`;

//   try {
//     // Put an object into an Amazon S3 bucket.
//     const putCommand = new PutObjectCommand({
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: generatedFilename,
//       Body: srtData,
//     });
//     await s3Client.send(putCommand);

//     // Get a pre-signed URL to download the file.
//     const getCommand = new GetObjectCommand({
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: generatedFilename,
//     });
//     const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 600 });

//     return {
//       subtitles: currentState.subtitles,
//       videoTitle: currentState.videoTitle,
//       url,
//       message: 'Le nouveau fichier a été créé avec succès',
//     };
//   } catch (e) {
//     console.error(e);
//     return {
//       subtitles: currentState.subtitles,
//       message: `Erreur lors de la création du nouveau fichier (${e})`,
//       videoTitle: currentState.videoTitle,
//     };
//   }
// }

export async function translate(
  currentState: {
    subtitles: Subtitle[];
    translations: string[];
    message: string;
  },
  fromData: FormData
) {
  if (!process.env.DEEPL_API_KEY) {
    return {
      subtitles: currentState.subtitles,
      translations: currentState.translations,
      message: 'Veuillez configurer une clé API DeepL',
    };
  }
  const translator = new Translator(process.env.DEEPL_API_KEY);
  const targetLanguage = fromData
    .get('language')
    ?.slice(0, 2) as TargetLanguageCode;
  const newTranslations = await translator.translateText(
    currentState.subtitles.map((subtitle) => {
      return subtitle.titles
        .map(
          (title) =>
            `<span class='${title.highlighted ? 'text-red-500' : ''}'>${
              title.text
            }</span>`
        )
        .join(' ');
    }),
    null,
    targetLanguage,
    { preserveFormatting: true, tagHandling: 'html' }
  );

  return {
    subtitles: currentState.subtitles,
    translations: newTranslations.map((translation) => translation.text),
    message: 'Les sous-titres ont été traduits avec succès',
  };
}

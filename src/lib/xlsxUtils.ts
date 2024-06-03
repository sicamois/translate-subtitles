import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Workbook } from 'exceljs';
import { Subtitle } from './fcpxmlParser';
import JSZip from 'jszip';

export async function createXlsxFromSubtitles(
  subtitles: Subtitle[],
  name: string,
  lang: string
) {
  const firstColName = 'Subtitle';
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(name);
  worksheet.columns = [
    { header: firstColName, key: firstColName, width: 70 },
    { header: lang, key: lang, width: 70 },
  ];

  const subtitleCol = worksheet.getColumn(firstColName);
  subtitleCol.values = [
    {
      richText: [{ text: firstColName, font: { bold: true, size: 12 } }],
    },
    ...subtitles.map((subtitle) => {
      return {
        richText: subtitle.titles.map((title) => {
          return {
            text: title.text + ' ',
            font: {
              size: 12,
              color: title.highlighted ? { argb: 'FF0000' } : undefined,
            },
          };
        }),
      };
    }),
  ];

  const langCol = worksheet.getColumn(lang);
  langCol.values = [
    {
      richText: [{ text: lang, font: { bold: true, size: 12 } }],
    },
  ];

  const s3Client = new S3Client({ region: 'eu-west-3' });
  let s3output: PutObjectCommandOutput;

  try {
    const xlsxFilename = `${name} - SUB ${lang}.xlsx`;
    // Put an object into an Amazon S3 bucket.
    const arrayBuffer = await workbook.xlsx.writeBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: xlsxFilename,
      Body: buffer,
    });
    s3output = await s3Client.send(command);
    return xlsxFilename;
  } catch (e) {
    console.error(e);
    throw new Error('Erreur lors de la création du fichier Excel');
  }
}

export async function createXlsxFileDataFromSubtitles(
  subtitles: Subtitle[],
  name: string,
  lang: string
) {
  const firstColName = 'Subtitle';
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(name);
  worksheet.columns = [
    { header: firstColName, key: firstColName, width: 70 },
    { header: lang, key: lang, width: 70 },
  ];

  const subtitleCol = worksheet.getColumn(firstColName);
  subtitleCol.values = [
    {
      richText: [{ text: firstColName, font: { bold: true, size: 12 } }],
    },
    ...subtitles.map((subtitle) => {
      return {
        richText: subtitle.titles.map((title) => {
          return {
            text: title.text + ' ',
            font: {
              size: 12,
              color: title.highlighted ? { argb: 'FF0000' } : undefined,
            },
          };
        }),
      };
    }),
  ];

  const langCol = worksheet.getColumn(lang);
  langCol.values = [
    {
      richText: [{ text: lang, font: { bold: true, size: 12 } }],
    },
  ];

  const arrayBuffer = workbook.xlsx.writeBuffer();
  // const buffer = new Uint8Array(arrayBuffer);

  return arrayBuffer;
}

export async function createZipFromSubtitles(
  subtitles: Subtitle[],
  name: string,
  langs: string[]
) {
  const zip = new JSZip();

  langs.forEach(async (lang) => {
    const arrayBuffer = createXlsxFileDataFromSubtitles(subtitles, name, lang);
    zip.file(`${name} - SUB ${lang}.xlsx`, arrayBuffer);
  });

  const s3Client = new S3Client({ region: 'eu-west-3' });
  let s3output: PutObjectCommandOutput;

  try {
    const zipFilename = `${name} - SUB.zip`;
    console.log('zipFilename', JSON.stringify(zip.files, null, 2));
    const zipBuffer = await zip.generateAsync({ type: 'uint8array' });

    // Put an object into an Amazon S3 bucket.
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: zipFilename,
      Body: zipBuffer,
    });
    s3output = await s3Client.send(command);
    return zipFilename;
  } catch (e) {
    console.error(e);
    throw new Error(
      'Erreur lors de la création du fichier Zip contenant les fichiers Excel'
    );
  }
}

import 'server-only';
import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Workbook } from 'exceljs';
import type { CellValue, Worksheet } from 'exceljs';
import { Subtitle } from './fcpxmlParser';
import JSZip from 'jszip';

const refColName = 'Ref';
const subtitleColName = 'Subtitle';

export async function createExcelFileDataFromSubtitles(
  subtitles: Subtitle[],
  name: string,
  lang: string,
) {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(name.slice(0, 31));

  worksheet.columns = [
    { header: refColName, key: refColName, width: 5 },
    { header: subtitleColName, key: subtitleColName, width: 70 },
    { header: lang, key: lang, width: 70 },
  ];

  const refCol = worksheet.getColumn(refColName);
  refCol.values = [
    {
      richText: [{ text: refColName, font: { bold: true, size: 12 } }],
    },
    ...subtitles.map((_, index) => {
      return index + 1;
    }),
  ];

  const subtitleCol = worksheet.getColumn(subtitleColName);
  subtitleCol.values = [
    {
      richText: [{ text: subtitleColName, font: { bold: true, size: 12 } }],
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
  langs: string[],
) {
  const zip = new JSZip();

  langs.forEach(async (lang) => {
    const arrayBuffer = createExcelFileDataFromSubtitles(subtitles, name, lang);
    zip.file(`${name} - SUB ${lang}.xlsx`, arrayBuffer);
  });

  const s3Client = new S3Client({ region: 'eu-west-3' });
  let s3output: PutObjectCommandOutput;

  try {
    const zipFilename = `${name} - SUB.zip`;
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
      'Erreur lors de la création du fichier Zip contenant les fichiers Excel',
    );
  }
}

function stringFromCellValue(cellValue: CellValue) {
  let name: string;
  switch (typeof cellValue) {
    case 'string':
      return cellValue;
    case 'object':
      if (cellValue !== null && 'richText' in cellValue) {
        return cellValue.richText.map((text: any) => text.text).join('');
      }
  }
  // if it doesn't match any of the above cases, throw an error
  throw new Error(
    `Impossible de récupérer le contenu de la cellule - ${cellValue}`,
  );
}

function extractColumn(worksheet: Worksheet, columnNumber: number) {
  const col = worksheet.getColumn(columnNumber);
  let column = col.values.filter(
    (value) => value !== null && value !== undefined,
  );
  if (!column.length) {
    throw new Error(
      `Aucune valeur trouvée dans la colonne: ${JSON.stringify(columnNumber, null, 2)}`,
    );
  }

  const nameCellValue = column.shift();
  const name = stringFromCellValue(nameCellValue);

  return { name, column };
}

function columnToSubtitle(column: CellValue[]): Subtitle[] {
  let subtitles = [] as Subtitle[];
  for (const cellValue of column) {
    switch (typeof cellValue) {
      case 'string':
        subtitles.push({
          titles: [{ text: cellValue, highlighted: false }],
        });
        break;
      case 'number':
        subtitles.push({
          titles: [{ text: cellValue.toString(), highlighted: false }],
        });
        break;
      case 'object':
        if (cellValue !== null && 'richText' in cellValue) {
          const titles = [] as { text: string; highlighted: boolean }[];
          for (const text of cellValue.richText) {
            if (text.text.trim() !== '') {
              titles.push({
                text: text.text,
                highlighted:
                  text.font?.color?.theme !== 1 &&
                  text.font?.color !== undefined,
              });
            }
          }
          subtitles.push({ titles });
        }
    }
  }
  if (subtitles.length === 0) {
    throw new Error(
      `Aucun sous-titre trouvé dans la colonne: ${JSON.stringify(column, null, 2)}`,
    );
  }
  return subtitles;
}

export async function importExcelFile(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = new Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) {
    throw new Error('Aucune feuille de calcul trouvée');
  }

  const refColumn = extractColumn(worksheet, 1);
  if (refColumn.name !== refColName) {
    throw new Error(`La première colonne doit être nommée "${refColName}"`);
  }
  // TODO : reorder subtitles if refs are not in order

  const originalSubtitlesColumn = extractColumn(worksheet, 2);
  if (originalSubtitlesColumn.name !== subtitleColName) {
    throw new Error(
      `La deuxième colonne doit être nommée "${subtitleColName}"`,
    );
  }
  const translatedSubtitlesColumns = extractColumn(worksheet, 3);

  return {
    originalSubtitles: columnToSubtitle(originalSubtitlesColumn.column),
    translatedSubtitles: columnToSubtitle(translatedSubtitlesColumns.column),
    language: translatedSubtitlesColumns.name,
  };
}

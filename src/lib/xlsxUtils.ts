'use server';

import 'server-only';
import { Workbook } from 'exceljs';
import type { CellValue, Worksheet } from 'exceljs';
import { Subtitle } from './fcpxmlParser';
import JSZip from 'jszip';
import fileContentToS3 from './fileContentToS3';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REF_COL_NAME = 'Ref';
const SUBTITLE_COL_NAME = 'Subtitle';
const S3_BUCKET = 'translate-subtitles-app-uploads';
const S3_REGION = 'eu-west-3';

// Excel file creation
export async function createExcelFileDataFromSubtitles(
  subtitles: Subtitle[],
  name: string,
  lang: string,
): Promise<Buffer> {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(name.slice(0, 31));

  setupWorksheetColumns(worksheet, lang);
  populateRefColumn(worksheet, subtitles);
  populateSubtitleColumn(worksheet, subtitles);
  populateLangColumn(worksheet, lang);

  return workbook.xlsx.writeBuffer();
}

function setupWorksheetColumns(worksheet: Worksheet, lang: string) {
  worksheet.columns = [
    { header: REF_COL_NAME, key: REF_COL_NAME, width: 5 },
    { header: SUBTITLE_COL_NAME, key: SUBTITLE_COL_NAME, width: 70 },
    { header: lang, key: lang, width: 70 },
  ];
}

function populateRefColumn(worksheet: Worksheet, subtitles: Subtitle[]) {
  const refCol = worksheet.getColumn(REF_COL_NAME);
  refCol.values = [
    createHeaderCell(REF_COL_NAME),
    ...subtitles.map((_, index) => index + 1),
  ];
}

function populateSubtitleColumn(worksheet: Worksheet, subtitles: Subtitle[]) {
  const subtitleCol = worksheet.getColumn(SUBTITLE_COL_NAME);
  subtitleCol.values = [
    createHeaderCell(SUBTITLE_COL_NAME),
    ...subtitles.map(createSubtitleCell),
  ];
}

function populateLangColumn(worksheet: Worksheet, lang: string) {
  const langCol = worksheet.getColumn(lang);
  langCol.values = [createHeaderCell(lang)];
}

function createHeaderCell(text: string) {
  return {
    richText: [{ text, font: { bold: true, size: 12 } }],
  };
}

function createSubtitleCell(subtitle: Subtitle) {
  return {
    richText: subtitle.titles.map((title) => ({
      text: title.text + ' ',
      font: {
        size: 12,
        color: getTextColor(title),
      },
    })),
  };
}

function getTextColor(title: { text: string; highlighted: boolean }) {
  if (title.text === '§') return { argb: '00FF00' };
  if (title.highlighted) return { argb: 'FF0000' };
  return undefined;
}

// Zip file creation
export async function createZipFromSubtitles(
  subtitles: Subtitle[],
  name: string,
  langs: string[],
): Promise<{ url: string; zipFilename: string }> {
  const zip = new JSZip();

  await Promise.all(
    langs.map(async (lang) => {
      const arrayBuffer = await createExcelFileDataFromSubtitles(
        subtitles,
        name,
        lang,
      );
      zip.file(`${name} - SUB ${lang}.xlsx`, arrayBuffer);
    }),
  );

  try {
    const zipFilename = `${name} - SUB.zip`;
    const zipBuffer = await zip.generateAsync({ type: 'uint8array' });
    await fileContentToS3(zipFilename, zipBuffer);

    const url = await getS3SignedUrl(zipFilename);

    return { url, zipFilename };
  } catch (e) {
    console.error(e);
    throw new Error(
      'Erreur lors de la création du fichier Zip contenant les fichiers Excel',
    );
  }
}

async function getS3SignedUrl(filename: string): Promise<string> {
  const s3Client = new S3Client({ region: S3_REGION });
  const getCommand = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: filename,
  });
  return getSignedUrl(s3Client, getCommand, { expiresIn: 600 });
}

// Excel file import
export async function importExcelFile(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = new Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) {
    throw new Error('Aucune feuille de calcul trouvée');
  }

  validateWorksheet(worksheet);

  const translatedSubtitlesColumns = extractColumn(worksheet, 3);

  return {
    translations: columnToSubtitle(translatedSubtitlesColumns.column),
    language: translatedSubtitlesColumns.name,
  };
}

function validateWorksheet(worksheet: Worksheet) {
  const refColumn = extractColumn(worksheet, 1);
  if (refColumn.name !== REF_COL_NAME) {
    throw new Error(`La première colonne doit être nommée "${REF_COL_NAME}"`);
  }

  const originalSubtitlesColumn = extractColumn(worksheet, 2);
  if (originalSubtitlesColumn.name !== SUBTITLE_COL_NAME) {
    throw new Error(
      `La deuxième colonne doit être nommée "${SUBTITLE_COL_NAME}"`,
    );
  }
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

function stringFromCellValue(cellValue: CellValue): string {
  switch (true) {
    case typeof cellValue === 'string':
      return cellValue;
    case typeof cellValue === 'number':
      return cellValue.toString();
    case typeof cellValue === 'object' &&
      cellValue !== null &&
      'richText' in cellValue:
      return cellValue.richText.map((text: any) => text.text).join('');
    default:
      throw new Error(
        `Impossible de récupérer le contenu de la cellule - ${cellValue}`,
      );
  }
}

function columnToSubtitle(column: CellValue[]): Subtitle[] {
  const subtitles = column
    .map(cellValueToSubtitle)
    .filter((subtitle): subtitle is Subtitle => subtitle !== null);
  if (subtitles.length === 0) {
    throw new Error(
      `Aucun sous-titre trouvé dans la colonne: ${JSON.stringify(column, null, 2)}`,
    );
  }
  return subtitles;
}

function cellValueToSubtitle(cellValue: CellValue): Subtitle | null {
  switch (true) {
    case cellValue === null || cellValue === undefined:
      return null;

    case typeof cellValue === 'string':
      return { titles: [{ text: cellValue, highlighted: false }] };

    case typeof cellValue === 'number':
      return { titles: [{ text: cellValue.toString(), highlighted: false }] };

    case typeof cellValue === 'object' &&
      // @ts-ignore case cellValue is null has been tested
      'richText' in cellValue:
      const titles = cellValue.richText
        .filter((richTextElement: any) => richTextElement.text.trim() !== '')
        .map((richTextElement: any) => ({
          text: richTextElement.text.trim() === '§' ? '' : richTextElement.text,
          highlighted:
            richTextElement.font?.color?.theme !== 1 &&
            richTextElement.font?.color !== undefined,
        }));
      return { titles };

    default:
      return null;
  }
}

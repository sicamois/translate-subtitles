import { notFound } from 'next/navigation';
import { decrypt } from '@/lib/encryptionUtils';
import { exctractFCPXMLInfosAndUrl } from '@/lib/fcpxmlUtils';
import { getDictionary } from '@/app/dictionaries';
import TranslateSubtitles from '@/components/TranslateSubtitles';
import type { SuppportedLocale } from '@/app/dictionaries';
import type { UploadFileAlertLabels } from '@/components/UploadFileAlert';
import type { DownloadFileButtonInfos } from '@/components/DownloadFileButton';

export default async function Subtitles({
  searchParams,
  params: { lang },
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { lang: SuppportedLocale };
}) {
  const labelsDict = await getDictionary(lang);
  const uploadLabels: UploadFileAlertLabels = {
    alertTrigger: labelsDict.translate.uploadTranslatedFile,
    alertTitle: labelsDict.translate.uploadTranslatedFile,
    alertDescription: labelsDict.translate.selectTranslationFile,
    action: labelsDict.file.download,
    cancel: labelsDict.file.cancel,
  };

  const langsParam = searchParams.langs;
  if (!langsParam || typeof langsParam !== 'string') {
    notFound();
  }
  const langs = langsParam.split(',');

  const encryptedFilename = searchParams.file;
  if (!encryptedFilename || typeof encryptedFilename !== 'string') {
    notFound();
  }
  const filename = decrypt(encryptedFilename, process.env.KEY!);

  const { videoTitle, subtitles, url, zipFilename } =
    await exctractFCPXMLInfosAndUrl(filename, langs);

  const downloadFileInfos: DownloadFileButtonInfos = {
    href: url,
    filename: zipFilename,
    label: labelsDict.translate.downloadExcelZip,
  };

  return (
    <main className="flex w-full flex-col items-center pb-20">
      <h1 className="p-6 text-center text-2xl font-thin drop-shadow-sm sm:text-4xl">
        {videoTitle}
      </h1>
      <h2 className="text-center text-xl font-thin italic drop-shadow-sm">
        {labelsDict.translate.translateSubtitles}
      </h2>
      <TranslateSubtitles
        subtitles={subtitles}
        downloadFileInfos={downloadFileInfos}
        uploadLabels={uploadLabels}
      />
    </main>
  );
}

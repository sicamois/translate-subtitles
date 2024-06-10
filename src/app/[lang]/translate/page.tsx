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
  console.log('encryptedFilename: ', encryptedFilename);
  const filename = await decrypt(encryptedFilename);
  console.log('filename: ', filename);

  const { videoTitle, subtitles, url, zipFilename } =
    await exctractFCPXMLInfosAndUrl(filename, langs);

  const downloadFileInfos: DownloadFileButtonInfos = {
    href: url,
    filename: zipFilename,
    label: labelsDict.translate.downloadExcelZip,
  };

  return (
    <main className="flex w-full flex-col items-center gap-6 pb-20">
      <section className="flex flex-col items-center gap-2">
        <h1 className="mt-8 px-4 text-center text-2xl font-light drop-shadow-sm sm:text-4xl">
          {videoTitle}
        </h1>
        <h2 className="text-center text-xl font-extralight drop-shadow-sm">
          {labelsDict.translate.translateSubtitles}
        </h2>
      </section>
      <TranslateSubtitles
        fcpxmlFilename={filename}
        subtitles={subtitles}
        downloadFileInfos={downloadFileInfos}
        uploadLabels={uploadLabels}
        createTranslatedFcpxmlLabel={
          labelsDict.translate.createTranslatedFcpxml
        }
      />
    </main>
  );
}

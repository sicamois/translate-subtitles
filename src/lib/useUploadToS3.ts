'use client';

import https from 'https';
import { useState, useTransition } from 'react';
import { uploadToS3PresignedUrl } from './uploadToS3PresignedUrl';

export default function useUploadToS3() {
  const [error, setError] = useState<Error | null>(null);
  const [s3key, setS3key] = useState<string | undefined>(undefined);

  const [isPending, startTransition] = useTransition();

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // TODO: Add a check for file size and type

    setError(null);
    setS3key(undefined);

    startTransition(async () => {
      try {
        const uploadUrl = await uploadToS3PresignedUrl(file);
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to upload file to S3: ${response.status} ${response.statusText}`,
          );
        }

        setS3key(file.name);
      } catch (error) {
        console.error(error);
        setError(error as Error);
      }
    });
  };

  return [handleInputChange, s3key, isPending, error] as [
    (event: React.ChangeEvent<HTMLInputElement>) => void,
    string | undefined,
    boolean,
    Error | null,
  ];
}

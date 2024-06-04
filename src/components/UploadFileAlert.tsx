import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

export type UploadFileAlertLabels = {
  alertTrigger: string;
  alertTitle: string;
  alertDescription: string;
  action: string;
  cancel: string;
};

export default function UploadFileAlert({
  labels,
  formAction,
  isPending,
}: {
  labels: UploadFileAlertLabels;
  formAction: (payload: FormData) => void;
  isPending?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="pointer-events-auto bg-gradient-to-r from-blue-600 to-emerald-500 text-lg transition-colors duration-100 ease-in-out hover:from-blue-700 hover:to-emerald-600"
          size={'lg'}
          disabled={isPending}
        >
          <p className="font-semibold drop-shadow">{labels.alertTrigger}</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent asChild>
        <form>
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {labels.alertDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-lg bg-gradient-to-l from-blue-600 to-emerald-500 p-[2px]">
            <Input
              // className="m-2 h-24 cursor-pointer rounded-md bg-gray-100 p-2 text-primary"
              className="h-24 cursor-pointer border-none p-9 text-lg text-primary"
              type="file"
              id="translation_file"
              name="translation_file"
              accept=".xlsx"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{labels.cancel}</AlertDialogCancel>
            <AlertDialogAction type="submit" formAction={formAction}>
              {labels.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

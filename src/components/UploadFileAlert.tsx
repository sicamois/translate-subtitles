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
}: {
  labels: UploadFileAlertLabels;
  formAction: (payload: FormData) => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="pointer-events-auto h-10 bg-gradient-to-r from-blue-600 to-emerald-500 p-2 px-4 text-lg transition-colors duration-100 ease-in-out hover:from-blue-700 hover:to-emerald-600">
          <div className="flex items-center gap-1">
            <p className="font-medium drop-shadow">{labels.alertTrigger}</p>
          </div>
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
          <Input
            className="m-2 w-full cursor-pointer rounded-md bg-gray-100 p-2 text-primary"
            type="file"
            id="translation_file"
            name="translation_file"
            accept=".xlsx"
          />
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

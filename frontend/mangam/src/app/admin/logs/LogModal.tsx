// components/LogDetailModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Log } from "./page";

interface LogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: Log | null;
}

export const LogDetailModal = ({
  isOpen,
  onClose,
  log,
}: LogDetailModalProps) => {
  if (!log) return null;

  const formatData = (data: string) => {
    try {
      return JSON.stringify(JSON.parse(data), null, 2);
    } catch {
      return data;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Log Detayları - #{log.log_id}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Eski Veri</h3>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <pre className="text-sm">{formatData(log.old_data)}</pre>
            </ScrollArea>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Yeni Veri</h3>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <pre className="text-sm">{formatData(log.new_data)}</pre>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

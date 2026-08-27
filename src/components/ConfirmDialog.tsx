import { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-tx-primary/20 backdrop-blur-sm z-[60] transition-opacity animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-[320px] bg-canvas rounded-[24px] p-5 shadow-2xl pointer-events-auto flex flex-col gap-4 animate-in zoom-in-95 duration-200">
          
          <div className="flex flex-col gap-2 text-center items-center">
            {danger && (
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-1">
                <AlertCircle size={24} />
              </div>
            )}
            <h2 className="text-[18px] font-semibold text-tx-primary leading-tight">{title}</h2>
            <div className="text-[14px] text-tx-muted leading-relaxed">
              {body}
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-medium text-[15px] bg-surface-neutral text-tx-primary active:opacity-80 transition-opacity"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-3 rounded-xl font-medium text-[15px] active:opacity-80 transition-opacity ${
                danger ? 'bg-red-500 text-white' : 'bg-tx-primary text-tx-inverse'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

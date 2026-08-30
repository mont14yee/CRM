import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onCancel,
  onConfirm,
  title,
  body,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  danger = true,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onCancel}
      />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-[320px] bg-canvas rounded-2xl p-6 shadow-2xl pointer-events-auto flex flex-col gap-4 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-2 text-center items-center">
            {danger && (
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-1">
                <AlertTriangle size={24} />
              </div>
            )}
            <h2 className="text-[18px] font-semibold text-tx-primary leading-tight">{title}</h2>
            {body && (
              <div className="text-[14px] text-tx-muted leading-relaxed">
                {body}
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl font-medium text-[15px] bg-surface-neutral text-tx-primary active:opacity-80 transition-opacity"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`flex-1 py-2.5 rounded-xl font-medium text-[15px] active:opacity-80 transition-opacity ${
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

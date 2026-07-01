import { useRef, useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  children,
  closeButton = true,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose?.();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="m-auto max-w-[95vw] rounded-[32px] border border-slate-200 bg-white p-0 shadow-2xl shadow-slate-950/10 backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm"
    >
      <div className="relative overflow-hidden rounded-[32px] bg-white p-0">
        {children}
        {closeButton && (
          <button
            onClick={handleClose}
            className="m-5 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Close
          </button>
        )}
      </div>
    </dialog>
  );
}

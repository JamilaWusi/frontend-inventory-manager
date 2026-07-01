import { useRef, useEffect } from 'react';

export default function Modal({
    isOpen,
    onClose,
    children,
    closeButton = true
}) {
    const dialogRef = useRef(null);

    // Sync state with dialog element
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isOpen]);

    // Handle backdrop click and escape key
    const handleClose = () => {
        onClose?.();
    };

    return (
        <dialog
            closedby='none'
            ref={dialogRef}
            onClose={handleClose}
            className='m-auto backdrop:bg-black/20 backdrop:backdrop-blur-sm'
        >

            <div>
                {children}
            </div>

            {closeButton && (
                <button
                    onClick={handleClose}
                    style={{
                        marginTop: '16px',
                        padding: '8px 16px',
                        cursor: 'pointer'
                    }}
                >
                    Close
                </button>
            )}
        </dialog>
    );
}
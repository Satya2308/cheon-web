import { X } from "~/icons";

interface Props {
  isOpen?: boolean;
  maxWidthClass?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export default function Modal(props: Props) {
  const {
    isOpen = true,
    maxWidthClass = "max-w-2xl",
    onClose,
    children,
    className,
  } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  return (
    <dialog open={isOpen} className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div
        className={`modal-box p-0 ml-3 sm:ml-0 overflow-hidden ${maxWidthClass} ${className}`}
      >
        <button
          type="button"
          onClick={handleClose}
          className="btn btn-sm btn-square btn-ghost flex justify-self-end mt-4 mr-4 text-base-content/50"
        >
          <X size={24} />
        </button>
        <main className="max-h-[calc(100vh-9em)] px-5 pb-5 overflow-auto">
          {children}
        </main>
      </div>
    </dialog>
  );
}

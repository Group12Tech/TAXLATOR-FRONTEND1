import BaseModal from "./BaseModals";

type Props = {
  open: boolean;
  onClose: () => void;
  type: "success" | "error";
  message: string;
};

export default function FeedbackModal({
  open,
  onClose,
  type,
  message,
}: Props) {
  return (
    <BaseModal open={open} onClose={onClose} width="max-w-sm">
      <div className="text-center space-y-4">

        <div
          className={`w-12 h-12 mx-auto rounded-full grid place-items-center ${
            type === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {type === "success" ? "✓" : "!"}
        </div>

        <p className="text-sm text-slate-600">{message}</p>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-brand-600 text-white text-sm"
        >
          OK
        </button>
      </div>
    </BaseModal>
  );
}
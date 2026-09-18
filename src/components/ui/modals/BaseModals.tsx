import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
};

export default function BaseModal({
  open,
  onClose,
  title,
  children,
  width = "max-w-md",
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/30 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`bg-white rounded-xl shadow-soft w-full ${width}`}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="font-semibold">{title}</h2>

                <button
                  onClick={onClose}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
import { useState } from "react";
import BaseModal from "./BaseModals";
import FeedbackModal from "./FeedbackModal";
import { useAuth } from "../../../state/useAuth";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EditProfileModal({ open, onClose }: Props) {
  
  const {user} = useAuth();
   
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"success" | "error">(
    "success"
  );
  const [feedbackMessage, setFeedbackMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      // API request here

      setFeedbackType("success");
      setFeedbackMessage("Profile updated successfully.");
      setFeedbackOpen(true);
      onClose();
    } catch {
      setFeedbackType("error");
      setFeedbackMessage("Failed to update profile.");
      setFeedbackOpen(true);
    }
  }

  return (
    <>
      <BaseModal open={open} onClose={onClose} title="Edit Profile" width="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm text-slate-600">Full Name</label>
            <input
              className="w-full border rounded px-3 py-2 mt-1"
              value={`${user?.lastName + " " + user?.firstName}`}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Email Address</label>
            <input
              className="w-full border rounded px-3 py-2 mt-1"
              value={user?.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-white bg-red-400 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-brand-600 text-white text-sm"
            >
              Save Changes
            </button>
          </div>

        </form>
      </BaseModal>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        type={feedbackType}
        message={feedbackMessage}
      />
    </>
  );
}
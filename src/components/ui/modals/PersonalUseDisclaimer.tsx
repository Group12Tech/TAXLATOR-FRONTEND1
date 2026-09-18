import { useEffect, useState } from "react";

const DISCLAIMER_KEY = "taxlator_personal_use_disclaimer_acknowledged";

export default function PersonalUseDisclaimer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const acknowledged = window.localStorage.getItem(DISCLAIMER_KEY);
    if (acknowledged !== "true") setOpen(true);
  }, []);

  function continueToTaxlator() {
    window.localStorage.setItem(DISCLAIMER_KEY, "true");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="personal-use-disclaimer-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <h2
          id="personal-use-disclaimer-title"
          className="text-xl font-bold text-slate-900 sm:text-2xl"
        >
          Personal Use Disclaimer
        </h2>

        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          TAXLATOR is intended for <strong>personal and informational use only</strong>.
          Calculations are estimates and should not be considered professional tax,
          legal, or financial advice.
        </p>

        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          Please verify your tax obligations with a qualified professional or the
          relevant tax authority before making decisions.
        </p>

        <button
          type="button"
          onClick={continueToTaxlator}
          className="mt-6 w-full rounded-xl bg-brand-800 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Continue to TAXLATOR
        </button>
      </div>
    </div>
  );
}

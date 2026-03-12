
// =========================================
// src/pages/Profile.tsx
// =========================================

// =========================================
// src/pages/Profile.tsx
// =========================================

import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { useAuth } from "../../state/useAuth";
import { useState } from "react";
import EditProfileModal from "../../components/ui/modals/EditProfileModal";


const mockUser = {
  firstName: "James",
  lastName: "Okikiola",
  email: "okikiolajames@gmail.com",
};

const mockStats = {
  totalCalculations: 30,
  lastAmount: 900000,
};

const mockHistory = [
  {
    id: 1,
    date: "March 10, 2026",
    type: "FREELANCER",
    income: 6000000,
    tax: 870000,
  },
  {
    id: 2,
    date: "March 3, 2026",
    type: "PAYE/PIT",
    income: 3000000,
    tax: 170250,
  },
  {
    id: 3,
    date: "Feb 28, 2026",
    type: "FREELANCER",
    income: 900000,
    tax: 15000,
  },
];

function formatMoney(num: number) {
  return new Intl.NumberFormat("en-NG").format(num);
}

function getTypeStyles(type: string) {
  switch (type) {
    case "FREELANCER":
      return "text-amber-800 bg-amber-100";
    case "PAYE/PIT":
      return "text-emerald-800 bg-emerald-100";
    default:
      return "text-slate-800 bg-slate-100";
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  console.log( user)

  function getFirstName(fullName: string) {
	return fullName.split(" ")[0]
  }


//   function formatType(type: string) {
// 	return type.replace("_", "/") 
//   }

//   function extractTaxResult(result: any) {
//   const first = Object.values(result ?? {})[0]

//   if (typeof first === "number") return first
//   if (first?.tax) return first.tax
//     return 0
//   }

//   const totalCalculations = history.length

// 	const lastAmount =
// 		history.length > 0
// 		  ? extractTaxResult(history[0].result)
// 		  : 0

  return (
    <div className="bg-slate-100 min-h-screen py-8 px-4">

      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= WELCOME ================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              Welcome Back, {getFirstName(user?.lastName ?? "User")}
            </h1>

            <p className="text-slate-500 text-sm">
              Here is an overview of your tax calculations and activities
            </p>
          </div>

          <button
            onClick={() => navigate("/calculate")}
            className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-3 rounded-lg font-medium text-sm"
          >
            Calculate Tax →
          </button>

        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <StatCard
            label="Total Calculations"
            value={mockStats.totalCalculations}
          />

          <StatCard
            label="Last Calculated Amount"
            value={`₦${formatMoney(mockStats.lastAmount)}`}
          />

        </div>

        {/* ================= RECENT ================= */}

        <div>

          <div className="flex justify-between items-center mb-4">

            <h2 className="font-semibold text-slate-700">
              Recent Calculations
            </h2>

            <button
              onClick={() => navigate("/history")}
              className="text-brand-700 text-sm font-medium"
            >
              View all
            </button>

          </div>

          <div className="space-y-3">

            {mockHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-xl px-4 py-3 flex items-center justify-between shadow-sm hover:shadow"
              >

                <div className="space-y-1">

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={14} />
                    {item.date}
                  </div>

                  <p className="text-sm text-slate-600">
                    Income
                  </p>

                  <p className="font-semibold">
                    ₦{formatMoney(item.income)}
                  </p>

                </div>

                <div className="text-right">

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${getTypeStyles(
                      item.type
                    )}`}
                  >
                    {item.type}
                  </span>

                  <p className="text-xs text-slate-500 mt-2">
                    Tax Result
                  </p>

                  <p className="font-semibold">
                    ₦{formatMoney(item.tax)}
                  </p>

                </div>

              </div>
            ))}

          </div>
        </div>

        {/* ================= ACCOUNT ================= */}

        <div className="bg-white rounded-2xl border shadow-soft p-6">

          <h3 className="font-semibold mb-4">
            Account
          </h3>

          <div className="space-y-3 text-sm">

            <Row
              label="Full Name"
              value={`${user?.firstName} ${user?.lastName}`}
            />

            <Row
              label="Email"
              value={user?.email}
            />

          </div>

		  <button
            onClick={() => {
			setProfileOpen(false);
			setEditProfileOpen(true);
		  }}>
			Edit Profile
		  </button>

        </div>

      </div>

		<EditProfileModal
			open={editProfileOpen}
			onClose={() => setEditProfileOpen(false)}
		/>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-xl border shadow-soft p-5">
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
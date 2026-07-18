
import TaxlatorLogo from "../../assets/images/TAX_LOGOs.png";
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import CalculateModal from "../../components/ui/modals/CalculateModal";
import { useAuth } from "../../state/useAuth";
import { Menu, X } from "lucide-react";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EditProfileModal from "../ui/modals/EditProfileModal";

// ============================= NAVBAR COMPONENT =============================
function NavItem({
	 to,
	 children,
	 onClick,
	 className = "",
	}: {
	 to?: string;
	 children: React.ReactNode;
	 onClick?: () => void;
	 className?: string;
	}) {
	if (to) {
		return (
		<NavLink
			to={to}
			onClick={onClick}
			className={({ isActive }) =>
			`block text-sm font-medium px-3 py-2 rounded ${
				isActive
				? "text-brand-700 bg-brand-50"
				: "text-slate-700 hover:text-brand-700 hover:bg-slate-50"
			} ${className}`
			}
		>
			{children}
		</NavLink>
		);
    }

  return (
    <button
      onClick={onClick}
      className={`block text-sm font-medium px-3 py-2 rounded text-slate-700 hover:text-brand-700 hover:bg-slate-50 ${className}`}
    >
      {children}
    </button>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, signout, loading, user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const [openCalc, setOpenCalc] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);


  

  const isCalculateActive = location.pathname.startsWith("/calculate");

  function closeMobile() {
    setMobileOpen(false);
  }

  const navItems: Array<{
    label: string;
    path?: string;
    action?: () => void;
    authOnly?: boolean;
    isCalculate?: boolean;
  }> = [
    { label: "Home", path: "/" },
    { label: "Calculate", action: () => setOpenCalc(true), isCalculate: true },
    { label: "History", path: "/history", authOnly: true },
    { label: "Tax Guides", path: "/taxguide" },
    { label: "About", path: "/about" },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.authOnly || authenticated,
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
if (loading) return null;
  return (
    <>
      <header className="bg-white border-b w-full">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
          {/* ======================= LEFT: Logo ======================= */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
           <img
    src={TaxlatorLogo}
    alt="Taxlator Logo"
    className="h-11 w-auto"
/>
            <div className="leading-tight">
              <div className="text-sm font-semibold">TAXLATOR</div>
              <div className="text-[11px] text-slate-500 -mt-0.5">
                Nigeria Tax Tools
              </div>
            </div>
          </Link>

          {/* ======================= CENTER: Desktop nav ======================= */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-2">
            {filteredNavItems.map((item, idx) =>
              item.path ? (
                <NavItem key={idx} to={item.path}>
                  {item.label}
                </NavItem>
              ) : item.isCalculate ? (
                <NavItem
                  key={idx}
                  onClick={item.action}
                  className={
                    isCalculateActive ? "text-brand-700 bg-brand-50" : ""
                  }
                >
                  {item.label}
                </NavItem>
              ) : (
                <NavItem key={idx} onClick={item.action}>
                  {item.label}
                </NavItem>
              ),
            )}
          </nav>

          {/* ======================= RIGHT: Auth + Mobile ======================= */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 rounded border grid place-items-center hover:bg-slate-50"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {authenticated && (
              <div ref={dropdownRef} className="relative hidden sm:block z-40">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded border text-sm hover:bg-slate-50"
                >
                  <User className="w-4 h-4" />
                   {user?.fullName}
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-soft overflow-hidden z-50"
                    >
                      < Link
					  	to='/profile'
						
						className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>

                      <div className="border-t" />

                      <button
                        onClick={signout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            {!authenticated && (
              <button
                onClick={() => navigate("/signin")}
                className="hidden sm:inline-flex px-3 py-2 rounded border text-sm hover:bg-slate-50"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/*======================= MOBILE DROPDOWN ======================= */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="max-w-6xl mx-auto px-4 py-3 grid gap-1">
              {filteredNavItems.map((item, idx) =>
                item.path ? (
                  <NavItem key={idx} to={item.path} onClick={closeMobile}>
                    {item.label}
                  </NavItem>
                ) : (
                  <NavItem
                    key={idx}
                    onClick={() => {
                      closeMobile();
                      item.action?.();
                    }}
                    className={`w-full text-left ${
                      item.isCalculate && isCalculateActive
                        ? "text-brand-700 bg-brand-50"
                        : ""
                    }`}
                  >
                    {item.label}
                  </NavItem>
                ),
              )}

              {/* ======================= Mobile auth button ======================= */}
              {/* <div className="pt-2 border-t mt-2">{authButton}</div> */}
              {authenticated ? (
                <div className="pt-2 border-t mt-2 grid gap-1">
                  <NavItem to="/profile" onClick={closeMobile}>
                    Profile
                  </NavItem>

                  <NavItem to="/history" onClick={closeMobile}>
                    History
                  </NavItem>

                  <NavItem to="/settings" onClick={closeMobile}>
                    Settings
                  </NavItem>

                  <button
                    onClick={() => {
                      closeMobile();
                      signout();
                    }}
                    className="text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t mt-2">
                  <button
                    onClick={() => {
                      closeMobile();
                      navigate("/signin");
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-slate-50"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <CalculateModal
        open={openCalc}
        onClose={() => setOpenCalc(false)}
        onPick={(path) => {
          setOpenCalc(false);
          navigate(path);
        }}
      />

	  <EditProfileModal
		  open={editProfileOpen}
		  onClose={() => setEditProfileOpen(false)}
	  />
    </>
  );
}

import { AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export const WarningBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slide-in animation on mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div 
      className={`warning-banner sticky top-0 z-50 flex items-center justify-center gap-2 py-2 px-4 transition-all duration-500 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
      style={{
        background: "linear-gradient(90deg, hsla(262, 76%, 57%, 0.1), hsla(174, 88%, 56%, 0.08), hsla(262, 76%, 57%, 0.1))",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid hsla(262, 76%, 57%, 0.2)",
      }}
    >
      <AlertTriangle className="w-3.5 h-3.5 text-violet flex-shrink-0" />
      <span className="text-[11px] text-foreground/90">
        <span className="text-violet font-semibold">Official CreditBuzz</span>
        {" — Only valid on "}
        <span className="text-teal font-medium">www.CreditBuzz.online</span>
        <span className="hidden sm:inline">{". Any other version is fake and must be reported."}</span>
      </span>
    </div>
  );
};

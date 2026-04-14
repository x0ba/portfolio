import { useState, useCallback } from "react";
import { Mail, Check } from "lucide-react";

interface CopyEmailProps {
  email: string;
  iconSize?: number;
  className?: string;
}

export default function CopyEmail({
  email,
  iconSize = 18,
  className = "interactive-icon-link text-muted-foreground hover:text-foreground",
}: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    },
    [email],
  );

  return (
    <a
      href={`mailto:${email}`}
      aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
      className={`${className} relative inline-flex items-center`}
      onClick={handleClick}
    >
      <span
        className="inline-flex transition-all duration-200"
        style={{
          opacity: copied ? 0 : 1,
          transform: copied ? "scale(0.5)" : "scale(1)",
          position: copied ? "absolute" : "relative",
        }}
      >
        <Mail style={{ width: iconSize, height: iconSize }} />
      </span>
      <span
        className="inline-flex text-green-500 transition-all duration-200"
        style={{
          opacity: copied ? 1 : 0,
          transform: copied ? "scale(1)" : "scale(0.5)",
          position: copied ? "relative" : "absolute",
        }}
      >
        <Check style={{ width: iconSize, height: iconSize }} />
      </span>

      {/* Tooltip */}
      <span
        className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-foreground text-background px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none transition-all duration-200"
        style={{
          opacity: copied ? 1 : 0,
          transform: copied ? "translateY(0)" : "translateY(4px)",
        }}
      >
        Copied!
      </span>

      {/* Screen reader announcement */}
      <span className="sr-only" aria-live="polite">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </a>
  );
}

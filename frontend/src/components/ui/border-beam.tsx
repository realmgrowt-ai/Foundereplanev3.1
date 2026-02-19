import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 12,
  delay = 0,
  colorFrom = "hsl(var(--primary))",
  colorTo = "hsl(var(--accent))",
  borderWidth = 1.5,
}: BorderBeamProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className
      )}
      style={{
        ["--size" as string]: `${size}px`,
        ["--duration" as string]: `${duration}s`,
        ["--delay" as string]: `${delay}s`,
        ["--color-from" as string]: colorFrom,
        ["--color-to" as string]: colorTo,
        ["--border-width" as string]: `${borderWidth}px`,
      }}
    >
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          padding: "var(--border-width)",
          background: `linear-gradient(var(--background), var(--background)) padding-box, 
                       conic-gradient(from calc(var(--beam-position, 0) * 360deg), 
                         transparent 0%, 
                         var(--color-from) 10%, 
                         var(--color-to) 20%, 
                         transparent 30%
                       ) border-box`,
          mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          animation: `border-beam-rotate var(--duration) linear infinite`,
          animationDelay: "var(--delay)",
        }}
      />
    </div>
  );
};

export default BorderBeam;

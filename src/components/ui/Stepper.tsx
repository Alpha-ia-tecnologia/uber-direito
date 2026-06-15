import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  label: string;
  hint?: string;
}

export function Stepper({
  steps,
  current,
  className,
}: {
  steps: Step[];
  current: number; // index of active step
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-col gap-0 sm:flex-row sm:items-start", className)}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={i} className="flex flex-1 gap-3 sm:flex-col sm:gap-0 sm:items-center">
            <div className="flex flex-col items-center sm:flex-row sm:w-full">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full border-2 text-[0.8rem] font-semibold transition-colors",
                  done && "bg-navy-700 border-navy-700 text-white",
                  active && "border-bordo-500 text-bordo-700 bg-bordo-50",
                  !done && !active && "border-line-strong text-faint bg-surface",
                )}
              >
                {done ? <Check className="size-4" strokeWidth={2.5} /> : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    "my-1 w-0.5 flex-1 sm:my-0 sm:mx-2 sm:h-0.5 sm:w-auto rounded-full",
                    done ? "bg-navy-600" : "bg-line",
                  )}
                  style={{ minHeight: "1.5rem" }}
                />
              )}
            </div>
            <div className="pb-5 sm:pb-0 sm:mt-2 sm:text-center sm:max-w-[8.5rem]">
              <span className={cn("block text-[0.83rem] font-semibold leading-tight", active ? "text-navy-900" : done ? "text-ink-soft" : "text-faint")}>
                {step.label}
              </span>
              {step.hint && <span className="mt-0.5 block text-[0.74rem] text-faint">{step.hint}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

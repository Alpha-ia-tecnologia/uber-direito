import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const baseControl =
  "w-full bg-surface border border-line-strong rounded-lg px-3.5 text-[0.9rem] text-ink placeholder:text-faint " +
  "transition-colors focus:border-navy-500 focus:outline-2 focus:outline-offset-1 focus:outline-bordo-500/60 " +
  "disabled:bg-surface-2 disabled:text-muted";

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-[0.84rem] font-semibold text-ink-soft">
          {label} {required && <span className="text-bordo-600">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="text-[0.78rem] text-danger-ink font-medium">{error}</span>
      ) : (
        hint && <span className="text-[0.78rem] text-faint">{hint}</span>
      )}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function Input({ className, invalid, ...rest }, ref) {
    return <input ref={ref} className={cn(baseControl, "h-11", invalid && "border-danger", className)} {...rest} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return <textarea ref={ref} className={cn(baseControl, "py-2.5 min-h-24 leading-relaxed resize-y", className)} {...rest} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select ref={ref} className={cn(baseControl, "h-11 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_0.75rem_center] bg-no-repeat pr-10", className)} {...rest}>
        {children}
      </select>
    );
  },
);

export function Toggle({
  checked,
  onChange,
  label,
  description,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  description?: string;
  id?: string;
}) {
  const gen = useId();
  const fieldId = id ?? gen;
  return (
    <div className="flex items-start justify-between gap-4">
      {(label || description) && (
        <label htmlFor={fieldId} className="select-none">
          {label && <span className="block text-[0.88rem] font-medium text-ink">{label}</span>}
          {description && <span className="block text-[0.8rem] text-muted mt-0.5">{description}</span>}
        </label>
      )}
      <button
        id={fieldId}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordo-500",
          checked ? "bg-navy-700" : "bg-navy-200",
        )}
      >
        <span
          className={cn(
            "inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[1.4rem]" : "translate-x-0.5",
          )}
          style={{ transitionTimingFunction: "var(--ease-spring)" }}
        />
      </button>
    </div>
  );
}

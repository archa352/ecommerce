/** A labelled input, so every admin form spaces and sizes its fields alike. */
export default function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  placeholder,
  hint,
  required,
  inputMode,
  className = 'col-md-6',
  hideLabel = false,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  inputMode?: 'text' | 'decimal' | 'numeric';
  className?: string;
  /** For rows that repeat the same field, where a visible label is noise. */
  hideLabel?: boolean;
}) {
  return (
    <div className={className}>
      {!hideLabel && (
        <label className="form-label text-sm fw-medium" htmlFor={name}>
          {label}
          {required && <span className="text-danger-main"> *</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className="form-control radius-8"
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        aria-label={hideLabel ? label : undefined}
      />
      {hint && <p className="text-xs text-secondary-light mb-0 mt-4">{hint}</p>}
    </div>
  );
}

import { ComponentProps, ReactNode, useState, useRef, useEffect } from "react";

type BaseFieldProps = {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
};

type TextFieldProps = BaseFieldProps & ComponentProps<"input">;

type SelectFieldProps = BaseFieldProps & {
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
} & ComponentProps<"select">;

export function TextField({ label, required, hint, error, className = "", ...props }: TextFieldProps) {
  const inputProps = {
    ...props,
    name: props.name ?? props.id,
  };

  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
      <span>
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <input
        className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-all focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100 ${
          className ?? ""
        }`}
        {...inputProps}
      />
      {hint && <p className="text-xs font-normal text-slate-400">{hint}</p>}
      {error && <p className="text-xs font-normal text-rose-500">{error}</p>}
    </label>
  );
}

export function SelectField({ label, required, hint, error, options, placeholder = "Choose", className = "", ...props }: SelectFieldProps) {
  const selectProps = {
    ...props,
    name: props.name ?? props.id,
  };

  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
      <span>
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <div className="relative">
        <select
          className={`w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-all focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-100 ${
            className ?? ""
          }`}
          {...selectProps}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">⌄</span>
      </div>
      {hint && <p className="text-xs font-normal text-slate-400">{hint}</p>}
      {error && <p className="text-xs font-normal text-rose-500">{error}</p>}
    </label>
  );
}

type FileUploadFieldProps = BaseFieldProps & ComponentProps<"input">;

export function FileUploadField({ label, required, hint = "Upload 1 supported file. Max 10 MB.", error, className = "", ...props }: FileUploadFieldProps) {
  const inputProps = {
    ...props,
    name: props.name ?? props.id,
  };

  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
      <span>
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <div
        className={`flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50 ${
          className ?? ""
        }`}
      >
        <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <span className="text-xs font-semibold text-slate-700">Drag & drop file</span>
        <span className="text-xs text-slate-500">or click to browse</span>
        <input type="file" className="sr-only" {...inputProps} />
      </div>
      {hint && <p className="text-xs font-normal text-slate-400">{hint}</p>}
      {error && <p className="text-xs font-normal text-rose-500">{error}</p>}
    </label>
  );
}

type SearchableSelectFieldProps = BaseFieldProps & {
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  disabled?: boolean;
  id?: string;
};

export function SearchableSelectField({ 
  label, 
  required, 
  hint, 
  error, 
  options, 
  placeholder = "Search or select", 
  value = "",
  onChange,
  disabled = false,
  id,
}: SearchableSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : "";

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      onChange({ target: { value: optionValue } });
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
      <span>
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-all cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-400"
          } ${isOpen ? "border-blue-500 shadow-md ring-2 ring-blue-100" : ""}`}
        >
          <span className={displayText ? "text-slate-900" : "text-slate-400"}>
            {displayText || placeholder}
          </span>
        </div>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">⌄</span>
        
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-slate-400 text-center">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`px-3 py-2 text-sm cursor-pointer transition hover:bg-blue-50 ${
                      option.value === value ? "bg-blue-100 text-blue-700 font-semibold" : "text-slate-900"
                    }`}
                  >
                    {option.label}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {hint && <p className="text-xs font-normal text-slate-400">{hint}</p>}
      {error && <p className="text-xs font-normal text-rose-500">{error}</p>}
    </label>
  );
}

export function FormSection({ title, description, actions, children }: { title: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-6 flex flex-col gap-2 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          {description && <p className="mt-1 text-xs font-medium text-slate-500">{description}</p>}
        </div>
        {actions}
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}

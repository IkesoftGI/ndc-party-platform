// src/components/Shared/ExecutiveYearSelector.tsx

interface Props {
  selectedYear: string;
  onChange: (year: string) => void;
  years: string[]; // new prop
}

export default function ExecutiveYearSelector({ selectedYear, onChange, years }: Props) {
  return (
    // Year Dropdown
    <div className="d-flex justify-content-center mb-4">
      <select
        className="form-select w-auto"
        value={selectedYear}
        onChange={(e) => onChange(e.target.value)}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            Term: {year}
          </option>
        ))}
      </select>
    </div>
  );
}

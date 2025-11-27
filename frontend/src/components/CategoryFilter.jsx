export default function CategoryFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="all">All Categories</option>
      <option value="Fiction">Fiction</option>
      <option value="Science">Science</option>
      <option value="History">History</option>
    </select>
  );
}

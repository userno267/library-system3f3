export default function Pagination({ page, onChange }) {
  return (
    <div className="flex gap-2">
      <button
        className="px-3 py-1 bg-gray-300 rounded"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>

      <span>Page {page}</span>

      <button
        className="px-3 py-1 bg-gray-300 rounded"
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

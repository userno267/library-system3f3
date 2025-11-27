export default function BookCard({ book }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="font-bold text-lg">{book.title}</h2>
      <p className="text-gray-600">{book.category}</p>

      <div className="mt-3 flex gap-2">
        <button className="px-3 py-1 bg-blue-600 text-white rounded">
          View
        </button>

        <button className="px-3 py-1 bg-yellow-500 text-white rounded">
          Edit
        </button>

        <button className="px-3 py-1 bg-red-600 text-white rounded">
          Delete
        </button>
      </div>
    </div>
  );
}

const confidenceColor = {
  High: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-red-100 text-red-700",
};

const CategoryResult = ({ result }) => {
  if (!result) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Categorization Result</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Category</p>
          <p className="font-semibold text-gray-800">{result.category}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Subcategory</p>
          <p className="font-semibold text-gray-800">{result.subcategory}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-2">Sustainability Tags</p>
        <div className="flex flex-wrap gap-2">
          {result.sustainability_tags.map((tag) => (
            <span
              key={tag}
              className="bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-3 py-1 rounded-full"
            >
              🌱 {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-500">Confidence</p>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${confidenceColor[result.confidence]}`}
        >
          {result.confidence}
        </span>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500 mb-1">AI Reasoning</p>
        <p className="text-gray-700 text-sm">{result.reasoning}</p>
      </div>

      <div className="text-xs text-gray-400 flex gap-4">
        <span>Model: {result.model_used}</span>
        <span>Time: {result.duration_ms}ms</span>
      </div>
    </div>
  );
};

export default CategoryResult;

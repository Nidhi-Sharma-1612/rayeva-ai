const ProposalResult = ({ result }) => {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          📋 Executive Summary
        </h2>
        <p className="text-gray-600">{result.executive_summary}</p>
      </div>

      {/* Recommended Products */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          🛒 Recommended Products
        </h2>
        <div className="space-y-4">
          {result.recommended_products.map((product, index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <span className="text-green-700 font-bold">
                  ${product.total_cost.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <p className="text-sm text-gray-600 mb-3">
                {product.justification}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.sustainability_tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    🌱 {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>Unit Cost: ${product.unit_cost}</span>
                <span>Quantity: {product.recommended_quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Allocation */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          💰 Budget Allocation
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Total Budget</p>
            <p className="text-xl font-bold text-gray-800">
              ${result.budget_allocation.total_budget.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-xl font-bold text-green-600">
              ${result.budget_allocation.total_spent.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="text-xl font-bold text-blue-600">
              ${result.budget_allocation.remaining_budget.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {result.budget_allocation.allocation_breakdown.map((item) => (
            <div key={item.category} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-40">
                {item.category}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-24 text-right">
                ${item.amount.toLocaleString()} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          🌍 Impact Summary
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-green-700 mb-1">
              🌿 Environmental Impact
            </p>
            <p className="text-sm text-gray-600">
              {result.impact_summary.environmental_impact}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-blue-700 mb-1">
              📊 ESG Compliance
            </p>
            <p className="text-sm text-gray-600">
              {result.impact_summary.esg_compliance}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-purple-700 mb-1">
              ⭐ Brand Reputation
            </p>
            <p className="text-sm text-gray-600">
              {result.impact_summary.brand_reputation}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-orange-700 mb-1">
              ♻️ Carbon Reduction
            </p>
            <p className="text-sm text-gray-600">
              {result.impact_summary.estimated_carbon_reduction}
            </p>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="text-xs text-gray-400 flex gap-4 px-1">
        <span>Model: {result.model_used}</span>
        <span>Time: {result.duration_ms}ms</span>
      </div>
    </div>
  );
};

export default ProposalResult;

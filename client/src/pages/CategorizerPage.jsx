import useCategorizer from "../hooks/useCategorizer";
import ProductForm from "../components/categorizer/ProductForm";
import CategoryResult from "../components/categorizer/CategoryResult";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const CategorizerPage = () => {
  const { result, loading, error, categorize } = useCategorizer();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            🏷️ Product Categorizer
          </h1>
          <p className="text-gray-500 mt-1">
            Enter product details and let AI categorize it instantly.
          </p>
        </div>

        <ProductForm onSubmit={categorize} loading={loading} />

        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {result && <CategoryResult result={result} />}
      </div>
    </div>
  );
};

export default CategorizerPage;

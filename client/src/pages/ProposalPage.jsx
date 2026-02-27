import useProposal from "../hooks/useProposal";
import ProposalForm from "../components/proposal/ProposalForm";
import ProposalResult from "../components/proposal/ProposalResult";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const ProposalPage = () => {
  const { result, loading, error, generate } = useProposal();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            📄 B2B Proposal Generator
          </h1>
          <p className="text-gray-500 mt-1">
            Enter client details and let AI generate a full sustainable
            procurement proposal.
          </p>
        </div>

        <ProposalForm onSubmit={generate} loading={loading} />

        {loading && (
          <div className="text-center space-y-2">
            <Loader />
            <p className="text-sm text-gray-500">
              Generating proposal... this may take 10-15 seconds.
            </p>
          </div>
        )}
        {error && <ErrorMessage message={error} />}
        {result && <ProposalResult result={result} />}
      </div>
    </div>
  );
};

export default ProposalPage;

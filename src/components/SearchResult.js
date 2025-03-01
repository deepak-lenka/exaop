import TwitterCard from './TwitterCard';
import MediaGrid from './MediaGrid';
import AnalysisCard from './AnalysisCard';

export default function SearchResult({ result }) {
  if (!result) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-red-500">
        <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Error
        </h3>
        <p className="text-white">No result data available</p>
      </div>
    );
  }

  const { executiveSummary, keyFindings, sourceAnalysis, sources, error } = result;

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-red-500">
        <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Error
        </h3>
        <p className="text-white">{error}</p>
      </div>
    );
  }

  if (!sources || sources.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-yellow-500">
        <h3 className="text-xl font-bold text-yellow-400 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No Results
        </h3>
        <p className="text-white">No results found for this query. Please try a different search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Query */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-blue-500">
        <h2 className="text-2xl font-bold text-blue-400 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Research Query
        </h2>
        <p className="text-xl text-white font-medium">"{result.query}"</p>
      </div>

      {/* Executive Summary */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <div className="result-header">
          <div className="result-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
          </div>
          <h3 className="section-title">Executive Summary</h3>
        </div>
        <p className="text-gray-200 mt-4 leading-relaxed text-justify whitespace-pre-wrap" style={{ textIndent: '2em' }}>{executiveSummary}</p>
      </div>

      {/* Key Findings */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <div className="result-header">
          <div className="result-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h3 className="section-title">Key Findings</h3>
        </div>
        <ul className="space-y-3 mt-4">
          {keyFindings.map((finding, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-blue-400 mt-1 text-lg">•</span>
              <span className="text-gray-200 leading-relaxed">{finding.replace('• ', '')}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Source Analysis */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <div className="result-header">
          <div className="result-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="section-title">Source Analysis</h3>
        </div>
        <p className="text-gray-200 mt-4">{sourceAnalysis}</p>
      </div>

      {/* Individual Sources */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <div className="result-header">
          <div className="result-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
          <h3 className="section-title">Sources</h3>
        </div>
        <div className="mt-4 space-y-6">
          {sources.map((source, index) => (
            <div key={index} className="source-item">
              <h4 className="text-lg font-semibold text-blue-400 mb-2 hover:text-blue-300 transition-colors duration-200">
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {source.title}
                </a>
              </h4>
              <ul className="space-y-2">
                {source.points.map((point, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-gray-300">{point.replace('• ', '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

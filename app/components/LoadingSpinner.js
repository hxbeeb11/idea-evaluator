export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1ABC9C]"></div>
      <span className="ml-2">Analyzing your idea...</span>
    </div>
  );
} 
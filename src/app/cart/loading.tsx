export default function CartLoading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="flex space-x-2 justify-center mb-4">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-bounce"></div>
          <div className="h-3 w-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-3 w-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-gray-600 font-medium">Loading your cart...</p>
      </div>
    </div>
  );
}
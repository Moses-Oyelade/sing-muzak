// components/ErrorFallback.tsx
interface Props {
  message: string;
  onRetry: () => void;
}
export default function ErrorFallback({ message, onRetry }: Props) {
  return (
    <div className="p-6 text-center text-red-600">
      <p>{message}</p>
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}

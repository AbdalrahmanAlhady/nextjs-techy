export default function NotAuthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <h1 className="text-3xl font-bold">Not Authorized</h1>
      <p className="text-gray-600">You do not have permission to access this page.</p>
      <a
        href="/"
        className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
      >
        Return Home
      </a>
    </div>
  );
}

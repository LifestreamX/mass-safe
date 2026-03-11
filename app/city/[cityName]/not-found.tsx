export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
          City Not Found
        </h2>
        <p className='text-gray-600 mb-8'>
          We couldn't find the city you're looking for in our Massachusetts
          database.
        </p>
        <a
          href='/'
          className='inline-block px-6 py-3 bg-primary text-white rounded-lg hover:filter hover:brightness-90 transition'
        >
          Back to Search
        </a>
      </div>
    </div>
  );
}

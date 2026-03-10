export default function Footer() {
  return (
    <footer className='bg-gray-100 border-t mt-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center text-gray-600 text-sm'>
          <p className='mb-2'>
            Crime statistics are provided for informational purposes only and
            may not reflect real-time conditions.
          </p>
          <p className='text-gray-500'>
            © {new Date().getFullYear()} MassSafe. Data source: FBI Crime Data
            Explorer API.
          </p>
        </div>
      </div>
    </footer>
  );
}

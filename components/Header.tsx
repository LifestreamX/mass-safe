'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <Link href='/' className='flex items-center'>
            <h1 className='text-2xl font-bold text-primary'>MassSafe</h1>
          </Link>

          <nav className='flex items-center space-x-6'>
            {session ? (
              <>
                <Link
                  href='/dashboard'
                  className='text-gray-700 hover:text-primary transition'
                >
                  Dashboard
                </Link>
                <div className='flex items-center space-x-3'>
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={32}
                      height={32}
                      className='rounded-full'
                    />
                  )}
                  <span className='text-gray-700'>{session.user?.name}</span>
                  <button
                    onClick={() => signOut()}
                    className='text-gray-700 hover:text-primary transition'
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition'
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

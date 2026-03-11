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
            <h1 className='text-2xl font-bold'>
              <span className='text-black'>Mass</span>
              <span className='text-primary'>Safe</span>
            </h1>
          </Link>

          <nav className='flex items-center space-x-6'>
            {session ? (
              <div className='flex items-center gap-6'>
                <Link
                  href='/dashboard'
                  className='text-sm font-medium text-gray-600 hover:text-primary transition-colors'
                >
                  Dashboard
                </Link>

                <div className='h-8 w-[1px] bg-gray-200 hidden sm:block'></div>

                <div className='flex items-center gap-4 py-1 px-2 pr-1 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100'>
                  <div className='hidden sm:flex flex-col items-end'>
                    <span className='text-sm font-semibold text-gray-900 leading-none capitalize'>
                      {session.user?.name?.split(' ')[0]}
                    </span>
                    <button
                      onClick={() => signOut()}
                      className='text-[11px] text-gray-500 hover:text-red-600 transition-colors font-medium mt-1 uppercase tracking-wider'
                    >
                      Sign Out
                    </button>
                  </div>

                  <div className='relative w-9 h-9 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200'>
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <div className='w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold'>
                        {session.user?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className='px-6 py-2 bg-primary text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transform transition active:scale-95'
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

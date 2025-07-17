'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthComponent() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="p-4">
        <p className="text-lg">
          Signed in as <strong>{session.user?.email}</strong>
        </p>
        <button
          onClick={() => signOut()}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p className="text-lg">Not signed in</p>
      <button
        onClick={() => signIn()}
        className="mt-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
      >
        Sign in
      </button>
    </div>
  );
}

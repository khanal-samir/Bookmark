"use client";

import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <div>
          <p>Signed in as {session.user.username || session.user.name}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div>Hello</div>
      )}
    </div>
  );
}

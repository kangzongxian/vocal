import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';

// Navigation Bar at the Top
export default function Navbar() {
  const { user, username } = useContext(UserContext)

  const router = useRouter();
  const signOut =  () => {
    auth.signOut();
    router.reload();
  }



  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">Vocal</button>
          </Link>
        </li>
        {/* dynamically render data whether user is logged in or not */}
        {/* user is signed-in and has username */}
        {username && (
          <>
            <li className="push-left">
              <button onClick={signOut}>Sign Out</button>
            </li>
            <li>
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL || '/hacker.png'} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Login</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
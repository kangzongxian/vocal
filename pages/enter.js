// Login Page
// Using just enter.js in the main pages means /enter is a route
import { auth, googleAuthProvider } from '../lib/firebase';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

export default function Enter(props) {
  const { user, username } = useContext(UserContext)

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {/* Render stuff depending on whether user signed in or not */}
      {/* Also see if have username */}
      {user ? 
        !username ? <UsernameForm /> : <SignOutButton /> 
        : 
        <SignInButton />
      }
    </main>
  );
}

// Sign in with Google button
// Async await
// Should also wrap in try-catch block to catch any errors that might occur
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} /> Sign in with Google
    </button>
  );
}

// Sign out button
// Sign out using auth
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
  return null;
}
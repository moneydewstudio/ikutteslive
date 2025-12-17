import { app } from './firebase';
import { 
  getAuth,
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously as firebaseSignInAnonymously, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

// Explicitly pass the initialized app to getAuth
// This prevents Firebase from trying to find a default app that might not be registered yet
const auth = getAuth(app);

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
}

export const authService = {
  /**
   * Subscribe to authentication state changes.
   * Returns an unsubscribe function.
   */
  subscribeToAuthChanges: (callback: (user: AuthUser | null) => void) => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isAnonymous: user.isAnonymous
        });
      } else {
        callback(null);
      }
    });
  },

  getCurrentUser: (): AuthUser | null => {
    const user = auth.currentUser;
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      isAnonymous: user.isAnonymous
    };
  },

  getIdToken: async (): Promise<string | null> => {
    return auth.currentUser ? await auth.currentUser.getIdToken() : null;
  },

  signInWithGoogle: async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  },

  signInAnonymously: async (): Promise<void> => {
    await firebaseSignInAnonymously(auth);
  },

  signOut: async (): Promise<void> => {
    await firebaseSignOut(auth);
  }
};
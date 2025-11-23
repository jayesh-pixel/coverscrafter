import { signInWithCustomToken } from "firebase/auth";
import { auth } from "./config";

/**
 * Sign in with custom Firebase token from backend and get ID token
 */
export async function getIdTokenFromCustomToken(customToken: string): Promise<string> {
  try {
    // Sign in with custom token from backend
    const userCredential = await signInWithCustomToken(auth, customToken);
    
    // Get the Firebase ID token (this is what we'll use for API access)
    const idToken = await userCredential.user.getIdToken();
    
    return idToken;
  } catch (error) {
    console.error("Failed to get ID token from custom token:", error);
    throw new Error("Failed to authenticate with Firebase");
  }
}

/**
 * Get fresh ID token for authenticated user
 */
export async function getFreshIdToken(): Promise<string | null> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }
    
    return await currentUser.getIdToken(true);
  } catch (error) {
    console.error("Failed to get fresh ID token:", error);
    return null;
  }
}

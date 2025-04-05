import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateEmail,
  updatePassword,
  linkWithCredential,
  EmailAuthProvider,
  deleteUser,
  updateProfile,
  signInAnonymously,
} from "firebase/auth";

const getFriendlyAuthError = (errorMessage: string) => {
  if (errorMessage.includes("auth/email-already-in-use")) {
    return "That email is already in use. Please sign in or use another email.";
  }
  if (errorMessage.includes("auth/wrong-password") || errorMessage.includes("auth/invalid-credential")) {
    return "Incorrect password. Please try again.";
  }
  if (errorMessage.includes("auth/user-not-found")) return "No user found that matches that email.";
  if (errorMessage.includes("weak-password")) return "Password should be at least 6 characters.";

  return errorMessage;
};

/*
 █████╗ ██╗   ██╗████████╗██╗  ██╗
██╔══██╗██║   ██║╚══██╔══╝██║  ██║
███████║██║   ██║   ██║   ███████║
██╔══██║██║   ██║   ██║   ██╔══██║
██║  ██║╚██████╔╝   ██║   ██║  ██║
╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝
*/
export const getCurrentUser = () => getAuth().currentUser;

export const signUp = async (
  email: string,
  password: string,
  confirmPassword: string,
  setError: (error: string) => void
) => {
  if (password !== confirmPassword) setError("Password does not match the confirmation");

  const auth = getAuth();
  return (
    auth.currentUser?.isAnonymous
      ? linkWithCredential(auth.currentUser, EmailAuthProvider.credential(email, password))
      : createUserWithEmailAndPassword(auth, email, password)
  )
    .then(({ user }) => user)
    .catch((e) => setError(getFriendlyAuthError(e.message)));
};

export const signIn = (email: string, password: string, setError: (error: string) => void) => {
  const auth = getAuth();

  return signInWithEmailAndPassword(auth, email, password)
    .then(({ user }) => user)
    .catch((e) => setError(getFriendlyAuthError(e.message)));
};

export function signInAnon() {
  const auth = getAuth();
  signInAnonymously(auth);
}

export const forgotPassword = (email: string) => sendPasswordResetEmail(getAuth(), email);

export const signUserOut = () => signOut(getAuth());

export const updateUserEmail = (email: string) => {
  const cu = getCurrentUser();
  if (cu) updateEmail(cu, email);
  else throw new Error("You must be signed in to update your email.");
};

export const updateUserProfile = (displayName: string) => {
  const cu = getCurrentUser();
  if (cu) updateProfile(cu, { displayName });
  else throw new Error("You must be signed in to update your profile.");
};

export const updateUserPassword = (newPassword: string) => {
  const cu = getCurrentUser();
  if (cu) return updatePassword(cu, newPassword);
  throw new Error("You must be signed in to update your password.");
};

export const deleteUserAccount = () => {
  const cu = getCurrentUser();
  if (cu) deleteUser(cu);
  else throw new Error("You must be signed in to delete your account.");
};

export function getToken() {
  const cu = getCurrentUser();
  if (cu) return cu.getIdToken();
  throw new Error("You must be signed in to get a token.");
}

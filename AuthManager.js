// in AuthManager.js
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from './Secrets';

let app, auth;
// this guards against initializing more than one "App"
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
auth = getAuth(app);


const signIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
}

export { signIn }
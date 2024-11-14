import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { initializeApp, getApps } from 'firebase/app';
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../Secrets';

let app;
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const db = getFirestore(app);

export const addUser = createAsyncThunk(
  'chat/addUser',
  async (user) => {
    const userToAdd = {
      displayName: user.displayName,
      email: user.email,
      key: user.uid
    };
    try {
      await setDoc(doc(db, 'users', user.uid), userToAdd);
    } catch (e) {
      console.log('Error adding user' , e)
    }
    return userToAdd;
  }
)


export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    users: [],
  },
  // reducers is a mandatory argument even if all of our reducers
  // are in extraReducers
  reducers: [],
  extraReducers: (builder) => {
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.users = [...state.users, action.payload]
    });
  }
})

export default authSlice.reducer
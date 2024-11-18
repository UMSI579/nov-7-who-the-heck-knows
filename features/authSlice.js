import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { initializeApp, getApps } from 'firebase/app';
import { setDoc, getDocs, addDoc, doc, getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { firebaseConfig } from '../Secrets';

let app;
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const db = getFirestore(app);


let snapshotUnsubscribe = undefined;
export const subscribeToUserUpdates = (dispatch) => {
  if (snapshotUnsubscribe) {
    snapshotUnsubscribe();
  }
    snapshotUnsubscribe = onSnapshot(collection(db, 'users'), usersSnapshot => {
      const updatedUsers = usersSnapshot.docs.map(uSnap => {
        console.log(uSnap.data());
        return uSnap.data(); // already has key?
      });
      dispatch(loadUsers(updatedUsers));
    });
}

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


export const loadUsers = createAsyncThunk(
  'chat/loadUsers',
  async (users) => {
    return [...users];
  }
)

export const addOrSelectChat = createAsyncThunk(
  'chat/addOrSelect',
  async({user1id, user2id}) => {
q    try {
      const chatQuery = query(collection(db, 'chats'),
        where('participants', 'array-contains', user1id),
      );
      const results = await getDocs(chatQuery);
      console.log('results, 63', results)
      /*
        Since we want to find a chat that has user1 and user2
        as "participants", ideally we would do this in a single
        query like this (note that by default multiple where
        clauses are ANDed together):

        const chatQuery = query(
          collection(db, 'chats'),
          where('participants', 'array-contains', user1id),
          where('participants', 'array-contains', user2id)
        );

        but Firestore doesn't allow more than one 'array-contains'
        where clause in a single query.

        So instead we do the
        second 'array-contains' clause "manually" by getting all of
        user1's chats and then using Array.find() to look for one
        that also contains user2 as a participant.
      */
      const chatSnap = results.docs?.find(
        elem => elem.data().participants.includes(user2id),
      );
      console.log('chat snap 87', chatSnap)
      let theChat;

      if (!chatSnap) { // we DIDN'T find a match, create a new chat
        theChat = {
          participants: [user1id, user2id],
        }
        const chatRef = await addDoc(collection(db, 'chats'), theChat);
        theChat.id = chatRef.id
        console.log('created a new chat:', theChat);
      } else { // we DID find a match, so let's use it.
        theChat = {
          ...chatSnap.data(),
          id: chatSnap.id
        }
        console.log('found a matching chat:', theChat);
      }
    }
    catch(e) {
      console.log('error finding chats', e)
    }

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

    builder.addCase(loadUsers.fulfilled, (state, action) => {
      state.users = action.payload
    });
  }
})

export default authSlice.reducer
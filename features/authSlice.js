import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { initializeApp, getApps } from 'firebase/app';
import {
  setDoc,
  doc,
  addDoc,
  getDocs,
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  orderBy } from 'firebase/firestore';
import { firebaseConfig } from '../Secrets';

let app;
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const db = getFirestore(app);


let usersSnapshotUnsub = undefined;
export const subscribeToUserUpdates = (dispatch) => {
  if (usersSnapshotUnsub) {
    usersSnapshotUnsub();
  }
    usersSnapshotUnsub = onSnapshot(collection(db, 'users'), usersSnapshot => {
      const updatedUsers = usersSnapshot.docs.map(uSnap => {
        console.log(uSnap.data());
        return uSnap.data(); // already has key?
      });
      dispatch(loadUsers(updatedUsers));
    });
}


export const unsubscribeFromUsers = () => {
  if (usersSnapshotUnsub) {
    usersSnapshotUnsub();
    usersSnapshotUnsub = undefined;
  }
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


let chatSnapshotUnsub = undefined;
export const addOrSelectChat = createAsyncThunk(
  'chat/addOrSelect',
  async({user1id, user2id}, {dispatch}) => {
    try {
      const chatQuery = query(collection(db, 'chats'),
        where('participants', 'array-contains', user1id),
      );
      const results = await getDocs(chatQuery);
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

// initial dispatch to add currentChat to reducer
      dispatch(authSlice.actions.setCurrentChat(theChat))

      if (chatSnapshotUnsub) {
        chatSnapshotUnsub();
        chatSnapshotUnsub = undefined;
      }
      const q = query(
        collection(db, 'chats', theChat.id, 'messages'),
        orderBy('timestamp', 'asc')
      );
      chatSnapshotUnsub = onSnapshot(
        q,
        (messagesSnapshot) => {
          const messages = messagesSnapshot.docs.map(msgSnap => {
            const message = msgSnap.data();
            return {
              ...message,
              timestamp: message.timestamp.seconds,
              id: msgSnap.id
            }
          }); // grab the messages from the snapshot, then dispatch to reducer
          dispatch(authSlice.actions.setCurrentChat({
            ...theChat,
            messages: messages
          }))
        }
      );
    }
    catch(e) {
      console.log('error finding chats', e)
    }

  }
)


export const unsubscribeFromChat = () => {
  if (chatSnapshotUnsub) {
    chatSnapshotUnsub();
    chatSnapshotUnsub = undefined;
  }
}

export const addCurrentChatMessage = createAsyncThunk(
  'chat/addMessage',
  async (message, {getState}) => {
    try {
      const currentChat = getState().authSlice.currentChat;
      const messageCollection = collection(db, 'chats', currentChat.id, 'messages');
      await addDoc(messageCollection, message); // no need to dispatch
    } catch (e) {
      console.log('could not add message', e)
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    users: [],
    currentChat: {}
  },
  // reducers is a mandatory argument even if all of our reducers
  // are in extraReducers
  reducers: {
    setCurrentChat: (state, action) => {
      console.log('setting current chat to', action.payload);
      state.currentChat = action.payload;
    }
  },
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
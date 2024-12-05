// features/AuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const addUser = createAsyncThunk(
  'chat/addUser',
  async (user) => {
    return {...user};
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

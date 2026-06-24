import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationApi } from '../../services';

export const fetchNotifications = createAsyncThunk('notif/fetch', async () => {
  const r = await notificationApi.list(); return r.data;
});

const slice = createSlice({
  name: 'notifications',
  initialState: { items: [] },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchNotifications.fulfilled, (s, a) => { s.items = a.payload; });
  },
});
export default slice.reducer;

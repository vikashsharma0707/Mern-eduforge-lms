import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { enrollmentApi } from '../../services';

export const fetchMyEnrollments = createAsyncThunk('enroll/fetch', async () => {
  const r = await enrollmentApi.list(); return r.data;
});
export const enrollCourse = createAsyncThunk('enroll/create', async (id) => {
  const r = await enrollmentApi.enroll(id); return r.data;
});

const slice = createSlice({
  name: 'enrollments',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMyEnrollments.fulfilled, (s, a) => { s.items = a.payload; })
     .addCase(enrollCourse.fulfilled, (s, a) => { s.items.push(a.payload); });
  },
});
export default slice.reducer;

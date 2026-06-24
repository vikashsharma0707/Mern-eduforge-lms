import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseApi } from '../../services';

export const fetchCourses = createAsyncThunk('courses/fetch', async (params) => {
  const r = await courseApi.list(params); return r.data;
});

const slice = createSlice({
  name: 'courses',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCourses.pending, (s) => { s.loading = true; })
     .addCase(fetchCourses.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
     .addCase(fetchCourses.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
  },
});
export default slice.reducer;

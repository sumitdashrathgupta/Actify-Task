import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, status: 'Active' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 32, status: 'Inactive' },
    { id: 6, name: 'Diana Miller', email: 'diana@example.com', age: 27, status: 'Active' },
    { id: 7, name: 'Ethan Davis', email: 'ethan@example.com', age: 31, status: 'Inactive' },
    { id: 8, name: 'Fiona Clark', email: 'fiona@example.com', age: 29, status: 'Active' },
    { id: 9, name: 'George White', email: 'george@example.com', age: 33, status: 'Active' },
    { id: 10, name: 'Hannah Lee', email: 'hannah@example.com', age: 26, status: 'Inactive' },
  ],
  filteredData: [],
  currentPage: 1,
  itemsPerPage: 10,
  sortConfig: { key: null, direction: 'asc' },
  searchTerm: '',
  editingId: null,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    addData: (state, action) => {
      state.data.push(action.payload);
    },
    updateData: (state, action) => {
      const index = state.data.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteData: (state, action) => {
      state.data = state.data.filter(item => item.id !== action.payload);
    },
    setEditingId: (state, action) => {
      state.editingId = action.payload;
    },
    setFilteredData: (state, action) => {
      state.filteredData = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSortConfig: (state, action) => {
      state.sortConfig = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const {
  addData,
  updateData,
  deleteData,
  setEditingId,
  setFilteredData,
  setCurrentPage,
  setSortConfig,
  setSearchTerm,
} = tableSlice.actions;

export default tableSlice.reducer; 
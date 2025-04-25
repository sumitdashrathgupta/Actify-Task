import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSort, FaSortUp, FaSortDown, FaFileExcel, FaSearch, FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import { setCurrentPage, setSortConfig, setSearchTerm, setFilteredData, updateData, deleteData } from '../store/tableSlice';
import * as XLSX from 'xlsx';

const Table = () => {
  const dispatch = useDispatch();
  const [editingRow, setEditingRow] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const {
    data,
    filteredData,
    currentPage,
    itemsPerPage,
    sortConfig,
    searchTerm
  } = useSelector((state) => state.table);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'age', label: 'Age' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    dispatch(setSortConfig({ key, direction }));
  };

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
    dispatch(setCurrentPage(1));
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    dispatch(setFilteredData(result));
    return result;
  }, [data, searchTerm, sortConfig, dispatch]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const currentData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredAndSortedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      dispatch(deleteData(id));
    }
  };

  const handleEdit = (row) => {
    setEditingRow(row.id);
    setEditFormData(row);
  };

  const handleEditChange = (e, field) => {
    setEditFormData({
      ...editFormData,
      [field]: e.target.value
    });
  };

  const handleUpdate = () => {
    // Format date to DD-MM-YY if it's changed
    let updatedData = { ...editFormData };
    if (editFormData.date) {
      const date = new Date(editFormData.date);
      if (!isNaN(date.getTime())) {
        updatedData.date = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).slice(-2)}`;
      }
    }
    
    dispatch(updateData(updatedData));
    setEditingRow(null);
    setEditFormData({});
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by any field..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border rounded w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <FaFileExcel className="mr-2" />
          Export to Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {sortConfig.key === column.key ? (
                      sortConfig.direction === 'asc' ? (
                        <FaSortUp className="ml-1" />
                      ) : (
                        <FaSortDown className="ml-1" />
                      )
                    ) : (
                      <FaSort className="ml-1" />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 border-b border-gray-200">
                    {editingRow === row.id ? (
                      <input
                        type={column.key === 'age' ? 'number' : column.key === 'date' ? 'date' : 'text'}
                        value={editFormData[column.key] || ''}
                        onChange={(e) => handleEditChange(e, column.key)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    {editingRow === row.id ? (
                      <button
                        onClick={handleUpdate}
                        className="text-green-600 hover:text-green-800"
                        title="Save"
                      >
                        <FaSave />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {currentData.length} of {filteredAndSortedData.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table; 
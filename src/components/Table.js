import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSort, FaSortUp, FaSortDown, FaFileExcel, FaSearch, FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import { setCurrentPage, setSortConfig, setSearchTerm, setFilteredData, updateData, deleteData } from '../store/tableSlice';
import * as XLSX from 'xlsx';

const Table = () => {
  const dispatch = useDispatch();
  const [editingRow, setEditingRow] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [nameSearch, setNameSearch] = useState('');

  const {
    data: tableData,
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
    dispatch(updateData(editFormData));
    setEditingRow(null);
    setEditFormData({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      dispatch(deleteData(id));
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  };

  const filteredData = useMemo(() => {
    return tableData.filter((item) =>
      item.name.toLowerCase().includes(nameSearch.toLowerCase())
    );
  }, [tableData, nameSearch]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">
                <div className="flex flex-col space-y-2">
                  <span className="text-xs font-semibold text-gray-600 uppercase">Name</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={nameSearch}
                      onChange={(e) => setNameSearch(e.target.value)}
                      placeholder="Search name..."
                      className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Email
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Age
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Date
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200">
                  {editingRow === row.id ? (
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => handleEditChange(e, 'name')}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    row.name
                  )}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {editingRow === row.id ? (
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => handleEditChange(e, 'email')}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    row.email
                  )}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {editingRow === row.id ? (
                    <input
                      type="number"
                      value={editFormData.age || ''}
                      onChange={(e) => handleEditChange(e, 'age')}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    row.age
                  )}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {editingRow === row.id ? (
                    <input
                      type="date"
                      value={editFormData.date || ''}
                      onChange={(e) => handleEditChange(e, 'date')}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    row.date
                  )}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {editingRow === row.id ? (
                    <select
                      value={editFormData.status || ''}
                      onChange={(e) => handleEditChange(e, 'status')}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    row.status
                  )}
                </td>
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
          Showing {currentData.length} of {filteredData.length} entries
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
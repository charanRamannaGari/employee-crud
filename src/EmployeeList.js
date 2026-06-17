import { useState } from 'react';
import EmployeeForm from './EmployeeForm';

const PAGE_SIZE = 5; // employees per page

function EmployeeList() {

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Charan', department: 'IT',      salary: 50000 },
    { id: 2, name: 'Ravi',   department: 'HR',      salary: 40000 },
    { id: 3, name: 'Priya',  department: 'Finance', salary: 45000 },
  ]);

  const [editEmployee, setEditEmployee] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // NEW: sort state -> which column, and which direction
  const [sortField, setSortField] = useState(null);     // 'name' | 'department' | 'salary' | null
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  // ADD
  const handleAdd = (formData) => {
    const newEmployee = {
      id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
      name: formData.name,
      department: formData.department,
      salary: Number(formData.salary)
    };
    setEmployees([...employees, newEmployee]);
  };

  const handleEdit = (emp) => {
    setEditEmployee(emp);
  };

  const handleUpdate = (formData) => {
    const updated = employees.map(emp =>
      emp.id === editEmployee.id
        ? { ...emp, name: formData.name, department: formData.department, salary: Number(formData.salary) }
        : emp
    );
    setEmployees(updated);
    setEditEmployee(null);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  // NEW: called when a column header is clicked
  const handleSort = (field) => {
    if (sortField === field) {
      // Same column clicked again -> toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column -> default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // reset to page 1 whenever sort changes
  };

  // Filter first
  const filteredEmployees = employees.filter(emp => {
    const text = searchText.toLowerCase();
    return (
      emp.name.toLowerCase().includes(text) ||
      emp.department.toLowerCase().includes(text)
    );
  });

  // NEW: Sort the filtered results (creates a new array, doesn't mutate original)
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortField) return 0; // no sorting applied

    let valA = a[sortField];
    let valB = b[sortField];

    // String comparison for name/department, numeric for salary
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    } else {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }
  });

  // Pagination math (applied AFTER sorting)
  const totalPages = Math.ceil(sortedEmployees.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + PAGE_SIZE);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // NEW: renders the sort arrow icon for a given column
  const renderSortIcon = (field) => {
    if (sortField !== field) return <span className="sort-icon sort-icon-idle">⇕</span>;
    return sortDirection === 'asc'
      ? <span className="sort-icon">▲</span>
      : <span className="sort-icon">▼</span>;
  };

  return (
    <div>
      <EmployeeForm
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editEmployee={editEmployee}
      />

      <div className="card">
        <div className="list-header">
          <h2>Employee List</h2>
          <input
            type="text"
            placeholder="Search by name or department..."
            value={searchText}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        {sortedEmployees.length === 0 ? (
          <p className="empty-state">
            {searchText
              ? `No employees match "${searchText}"`
              : 'No employees yet. Add one above!'}
          </p>
        ) : (
          <>
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th className="sortable" onClick={() => handleSort('name')}>
                    Name {renderSortIcon('name')}
                  </th>
                  <th className="sortable" onClick={() => handleSort('department')}>
                    Department {renderSortIcon('department')}
                  </th>
                  <th className="sortable" onClick={() => handleSort('salary')}>
                    Salary {renderSortIcon('salary')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.salary}</td>
                    <td>
                      <button onClick={() => handleEdit(emp)} className="btn btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(emp.id)} className="btn btn-delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn-page"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={page === currentPage ? 'btn-page active' : 'btn-page'}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn-page"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        <p className="result-count">
          Showing {paginatedEmployees.length} of {sortedEmployees.length} employees
          {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
        </p>
      </div>
    </div>
  );
}

export default EmployeeList;
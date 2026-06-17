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

  // NEW: tracks which page we're on
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter first
  const filteredEmployees = employees.filter(emp => {
    const text = searchText.toLowerCase();
    return (
      emp.name.toLowerCase().includes(text) ||
      emp.department.toLowerCase().includes(text)
    );
  });

  // NEW: Pagination math
  const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + PAGE_SIZE);

  // When search text changes, always reset to page 1
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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

        {filteredEmployees.length === 0 ? (
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
                  <th>Name</th>
                  <th>Department</th>
                  <th>Salary</th>
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

            {/* NEW: Pagination controls - only show if more than 1 page */}
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
          Showing {paginatedEmployees.length} of {filteredEmployees.length} employees
          {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
        </p>
      </div>
    </div>
  );
}

export default EmployeeList;
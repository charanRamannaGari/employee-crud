import { useState } from 'react';
import EmployeeForm from './EmployeeForm';

function EmployeeList() {

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Charan', department: 'IT',      salary: 50000 },
    { id: 2, name: 'Ravi',   department: 'HR',      salary: 40000 },
    { id: 3, name: 'Priya',  department: 'Finance', salary: 45000 },
  ]);

  const [editEmployee, setEditEmployee] = useState(null);

  // NEW: search text state
  const [searchText, setSearchText] = useState('');

  // ADD
  const handleAdd = (formData) => {
    const newEmployee = {
      id: employees.length + 1,
      name: formData.name,
      department: formData.department,
      salary: Number(formData.salary)
    };
    setEmployees([...employees, newEmployee]);
  };

  // EDIT - load employee into form
  const handleEdit = (emp) => {
    setEditEmployee(emp);
  };

  // UPDATE - save edited employee
  const handleUpdate = (formData) => {
    const updated = employees.map(emp =>
      emp.id === editEmployee.id
        ? { ...emp, name: formData.name, department: formData.department, salary: Number(formData.salary) }
        : emp
    );
    setEmployees(updated);
    setEditEmployee(null);
  };

  // DELETE
  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  // NEW: filter employees by name OR department (case-insensitive)
  const filteredEmployees = employees.filter(emp => {
    const text = searchText.toLowerCase();
    return (
      emp.name.toLowerCase().includes(text) ||
      emp.department.toLowerCase().includes(text)
    );
  });

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
            onChange={(e) => setSearchText(e.target.value)}
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
              {filteredEmployees.map(emp => (
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
        )}

        {searchText && (
          <p className="result-count">
            Showing {filteredEmployees.length} of {employees.length} employees
          </p>
        )}
      </div>
    </div>
  );
}

export default EmployeeList;
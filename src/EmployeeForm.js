import { useState, useEffect } from 'react';

function EmployeeForm({ onAdd, onUpdate, editEmployee }) {

  const [form, setForm] = useState({
    name: '', department: '', salary: ''
  });

  // When editEmployee changes → fill form with their data
  useEffect(() => {
    if (editEmployee) {
      setForm({
        name: editEmployee.name,
        department: editEmployee.department,
        salary: editEmployee.salary
      });
    } else {
      setForm({ name: '', department: '', salary: '' });
    }
  }, [editEmployee]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.department || !form.salary) {
      alert('Please fill all fields!');
      return;
    }
    if (editEmployee) {
      onUpdate(form);  // UPDATE mode
    } else {
      onAdd(form);     // ADD mode
    }
    setForm({ name: '', department: '', salary: '' });
  };

  return (
    <div className="card">
      <h2>{editEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />
        <input
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
        />
        <button type="submit" className={editEmployee ? 'btn btn-update' : 'btn btn-add'}>
          {editEmployee ? 'Update' : 'Add'}
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
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
    <div style={{ marginBottom: '20px' }}>
      <h2>{editEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={{ marginRight: '10px', padding: '6px' }}
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          style={{ marginRight: '10px', padding: '6px' }}
        />
        <input
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          style={{ marginRight: '10px', padding: '6px' }}
        />
        <button type="submit"
          style={{ background: editEmployee ? 'blue' : 'green', color: 'white', padding: '6px 12px', border: 'none', cursor: 'pointer' }}>
          {editEmployee ? 'Update' : 'Add'}
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
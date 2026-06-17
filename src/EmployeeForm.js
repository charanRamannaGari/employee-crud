import { useState, useEffect } from 'react';

function EmployeeForm({ onAdd, onUpdate, editEmployee }) {

  const [form, setForm] = useState({
    name: '', department: '', salary: ''
  });

  // NEW: stores validation error messages per field
  const [errors, setErrors] = useState({});

  // When editEmployee changes -> fill form with their data
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
    setErrors({}); // clear old errors when switching mode
  }, [editEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear the error for this field as soon as user starts typing again
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validates all fields, returns an errors object
  const validate = () => {
    const newErrors = {};

    // Name: required, letters/spaces only, min 2 chars
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(form.name)) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    // Department: required
    if (!form.department.trim()) {
      newErrors.department = 'Department is required';
    } else if (form.department.trim().length < 2) {
      newErrors.department = 'Department must be at least 2 characters';
    }

    // Salary: required, must be a positive number
    if (!form.salary.toString().trim()) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(form.salary) || Number(form.salary) <= 0) {
      newErrors.salary = 'Salary must be a positive number';
    } else if (Number(form.salary) > 10000000) {
      newErrors.salary = 'Salary seems too high, please check';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    // If there are any errors, show them and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editEmployee) {
      onUpdate(form);
    } else {
      onAdd(form);
    }

    setForm({ name: '', department: '', salary: '' });
    setErrors({});
  };

  return (
    <div className="card">
      <h2>{editEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit} className="employee-form" noValidate>

        <div className="form-field">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-field">
          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className={errors.department ? 'input-error' : ''}
          />
          {errors.department && <span className="error-text">{errors.department}</span>}
        </div>

        <div className="form-field">
          <input
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            className={errors.salary ? 'input-error' : ''}
          />
          {errors.salary && <span className="error-text">{errors.salary}</span>}
        </div>

        <button type="submit" className={editEmployee ? 'btn btn-update' : 'btn btn-add'}>
          {editEmployee ? 'Update' : 'Add'}
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
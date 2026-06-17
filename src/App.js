import EmployeeList from './EmployeeList';
import './EmployeeStyles.css';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Employee Management</h1>
      <EmployeeList />
    </div>
  );
}

export default App;
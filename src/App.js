import React, { useState } from 'react';
import EmployeeTable from './Table';
import Employee from './Employee';

function App() {
  let fileReader;
  const [employeeData, setEmployeeData] = useState();

  const handleFileReader = (e) => {
    const fileContent = fileReader.result;

    if(fileContent.length) {
      const employeeList = new Employee(fileContent.split('\r\n'));
      employeeList.handleData();

      setEmployeeData(employeeList.longestWorkingPairs);
      employeeList.showResultInTable();
    }
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileReader;
    fileReader.readAsText(file);
  }

  return (
    <div className="App">
      <input
        type="file"
        onChange={e => handleFileChosen(e.target.files[0])}
      />
      <h1 style={{textAlign: 'center', paddingBottom: '10px'}}>Longest working pair of Employees</h1>
      {employeeData ?
        <EmployeeTable data={employeeData} />
      :
        <p style={{textAlign: 'center', paddingBottom: '10px'}}>No data about employees</p>
      }
    </div>
  );
}


export default App;

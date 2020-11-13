import React, { useEffect, useState } from 'react';
import './Table.css';

function EmployeeTable(props) {
    const [tableBody, setTableBody] = useState();
    const [tableData] = useState(props.data)

    useEffect(() => {
        setTableBody(generateTableBody(tableData));
    }, [tableData]);;

    const generateTableBody = (data) => {
        // small check to see if there is at least some data passed to the table generator
        if (!data[0])
            return (
                <tr className="table-row">
                    <td className="table-data">No valid pair of employee in the submited data</td>
                </tr>
            )

        /**
         * This one shows only the longest working pair
         */
        return (
            <tr className="table-row">
                <td className="table-data">{data[0].empID1}</td>
                <td className="table-data">{data[0].empID2}</td>
                <td className="table-data">{data[0].projectID}</td>
                <td className="table-data">{data[0].daysWorked}</td>
            </tr>
        )

        /**
         * If we want to show all pairs who worked on the same project
         * aware that the current code would not run because of the return on previous line
         */
        return data.map((employee, index) => {
            const { empID1, empID2, projectID, daysWorked } = employee //destructuring
            return (
                <tr className="table-row" key={index}>
                    <td className="table-data">{empID1}</td>
                    <td className="table-data">{empID2}</td>
                    <td className="table-data">{projectID}</td>
                    <td className="table-data">{daysWorked}</td>
                </tr>
            )
        })
    }

    return (
        <div className="container">
            <table id='employees' className='table'>
                <thead className="table-header">
                    <tr className="table-header-row">
                        <th className="header__item">Employee ID #1</th>
                        <th className="header__item">Employee ID #2</th>
                        <th className="header__item">Projects</th>
                        <th className="header__item">Days worked</th>
                    </tr>
                </thead>
                <tbody className="table-content">
                    {tableBody}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeTable;

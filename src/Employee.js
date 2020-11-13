const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds = 1 day;

// Helper class for cleaner insertion
class EmployeePair {
    empID1;
    empID2;
    projectID;
    daysWorked;

    constructor(employee1ID, employee2ID, projects, daysWorked) {
        this.empID1 = employee1ID;
        this.empID2 = employee2ID;
        this.projectID = projects;
        this.daysWorked = daysWorked;
    }
}

class Employees {

    // All manipulations can be done with one array but its not practical
    employeeList = [];
    employeePairs = [];
    longestWorkingPairs = [];

    constructor(data) {
        this.employeeList = data;
    }

    handleData() {
        let emplObjArr = this.formatToObjArr(this.employeeList);

        // Sort the data based on employee ID's for easier manipulation later on
        emplObjArr.sort(function (a, b) {
            return a.empID - b.empID;
        })

        // Group all employees based on projectID for easier comparison later
        let groupByProject = this.groupBy(emplObjArr, (item) => {
            return [item.projectID];
        });

        // Cycle through all grouped objects to check for pairs working at the same period
        Object.keys(groupByProject).forEach(project => {

            // if there are 2 or more employees on the same project it will check for overlaping periods
            if (groupByProject[project].length >= 2) {

                // Nested loops for checking all possible combinations
                for (let i = 0; i < groupByProject[project].length; i++) {
                    for (let j = i + 1; j < groupByProject[project].length; j++) {

                        // The two employees have overlaping period of time working on the same project and are added to the list
                        if (this.checkPeriodOverlap(groupByProject[project][i], groupByProject[project][j])) {
                            let empoyeePair = new EmployeePair(
                                groupByProject[project][i].empID,
                                groupByProject[project][j].empID,
                                groupByProject[project][i].projectID,
                                this.getDaysWorkedTogether(groupByProject[project][i], groupByProject[project][j]),
                            )
                            this.employeePairs.push(empoyeePair)
                        }
                    }
                }
            }
        })

        // Group all pairs who have worked on more than 1 project
        let groupByPair = this.groupBy(this.employeePairs, (item) => {
            return [item.empID1, item.empID2];
        });

        // Getting the final version of each pair of employees worktime and projects
        groupByPair.forEach(pair => {
            let daysWorkedTogether = 0;
            let projects = '';
            for (let i = 0; i < pair.length; i++) {
                daysWorkedTogether += pair[i].daysWorked;
                projects = projects + ' ' + pair[i].projectID;
            }
            let empoyeePair = new EmployeePair(
                pair[0].empID1,
                pair[0].empID2,
                projects,
                daysWorkedTogether,
            )
            this.longestWorkingPairs.push(empoyeePair)
        })

        // Sorts the list in descending order based on 'daysWorked'
        // For ascending order swap a and b values in return
        this.longestWorkingPairs.sort(function (a, b) {
            return b.daysWorked - a.daysWorked;
        })
    }

    // Format the data to Object Array for easier manipulation
    formatToObjArr(employeeList) {
        let emplObjArr = [];
        employeeList.forEach(employee => {
            let employeeArr = employee.split(', ');

            emplObjArr.push({
                'empID': employeeArr[0],
                'projectID': employeeArr[1],
                'dateFrom': new Date(employeeArr[2]),
                'dateTo': this.checkIfDateIsValid(new Date(employeeArr[3]))
            })
        })
        return emplObjArr;
    }

    // Helper function for grouping data based on criteria
    groupBy(array, f) {
        // create holder
        let groups = {};

        // loop through the given array
        array.forEach(o => {
            /**
             * Generate key for the group from the return value of the function.
             * Most of the time the key would be the criteria on which we are grouping
             */
            let group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });

        return Object.keys(groups).map(group => {
            return groups[group];
        })
    }

    getDaysWorkedTogether(empl1, empl2) {
        /**
         * Merges the two overlaping periods of the empoyees takes the latest starting date and the earlist end date
         * resulting in time period in which the two employees work together on the same project
         * the perios os then converted to days and returned to the table
         */
        let startDate;
        let endDate;

        if (empl1.dateFrom <= empl2.dateFrom) {
            startDate = empl2.dateFrom;
        } else {
            startDate = empl1.dateFrom;
        }

        if (empl1.dateTo <= empl2.dateTo) {
            endDate = empl1.dateTo;
        } else {
            endDate = empl2.dateTo;
        }

        return Math.round(Math.abs(startDate - endDate) / oneDay);
    }

    checkPeriodOverlap(empl1, empl2) {
        /**
         * For employees to be working on the same project at the same time some conditions are needed
         * We take Employee 1 as the person who started wokring on Project X earlier
         * Employee 2 have later or same starting date as Employee 1
         * Start time of Employee 1 should be less or equal to end date of Employee 2 so we can make sure there periods overlap
         * Start date of Employee 2 should be less or equal to end date of Employee 1 for the same reasons as above
         *
         * From these statements comes the formula:
         * StartA <= EndB && StartB <= EndA ? worked together : didn't work together
         *
         * If we want to remove the possibilitity for working only for one day on the project we simply need to remove the '=' from the formula
         * StartA < EndB && StartB < EndA ? worked together for more than 1 day : didn't work together
         */
        if (empl1.dateFrom <= empl2.dateFrom) {
            return empl1.dateFrom <= empl2.dateTo && empl2.dateFrom <= empl1.dateTo;
        } else {
            return empl2.dateFrom <= empl1.dateTo && empl1.dateFrom <= empl2.dateTo;
        }
    }

    showResultInTable() {
        console.table(this.longestWorkingPairs[0]);
    }

    checkIfDateIsValid(date) {
        return isNaN(date.getTime()) ? new Date() : date;
    }
}

export default Employees;

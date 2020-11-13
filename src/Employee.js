const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds = 1 day;

class Employees {

    longestWorkingPair = [];
    employeeList = [];

    constructor(data) {
        this.employeeList = data;
    }

    handleData() {
        let emplObjArr = [];

        this.employeeList.forEach(employee => {
          let employeeArr = employee.split(', ');

          emplObjArr.push({
            'empID': employeeArr[0],
            'projectID': employeeArr[1],
            'dateFrom': new Date(employeeArr[2]),
            'dateTo':  this.checkIfDateIsValid(new Date(employeeArr[3]))
          })
        })

        // Group all employees based on projectID for easier comparison later
        let groupByProject = emplObjArr.reduce((acc, value) => {

          if (!acc[value.projectID]) {
            acc[value.projectID] = [];
          }

          // Grouping
          acc[value.projectID].push(value);

          return acc;
        }, {});

        // Cycle through all grouped objects to check for pairs working at the same period
        Object.keys(groupByProject).forEach(project => {
          if(groupByProject[project].length >= 2){
            for(let i = 0; i < groupByProject[project].length; i++){
              for(let j = i + 1; j < groupByProject[project].length; j++){
                if(this.checkIfWorkedTogether(groupByProject[project][i], groupByProject[project][j])){
                  // The two employees have overlaping period of time working on the same project and are added to the list
                  this.longestWorkingPair.push({
                    'empID1': groupByProject[project][i].empID,
                    'empID2': groupByProject[project][j].empID,
                    'projectID': project,
                    'daysWorked': this.getDaysWorkedTogether(groupByProject[project][i], groupByProject[project][j]),
                  })
                }
              }
            }
          }
        })

        this.longestWorkingPair.sort(function(a, b) {
            return b.daysWorked - a.daysWorked;
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

        if(empl1.dateFrom <= empl2.dateFrom){
          startDate = empl2.dateFrom;
        } else {
          startDate = empl1.dateFrom;
        }

        if(empl1.dateTo <= empl2.dateTo){
          endDate = empl1.dateTo;
        } else {
          endDate = empl2.dateTo;
        }

        return Math.round(Math.abs(startDate - endDate) / oneDay);
    }

    checkIfWorkedTogether(empl1, empl2) {
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
        if(empl1.dateFrom <= empl2.dateFrom){
            return empl1.dateFrom <= empl2.dateTo && empl2.dateFrom <= empl1.dateTo;
        } else {
            return empl2.dateFrom <= empl1.dateTo && empl1.dateFrom <= empl2.dateTo;
        }
    }

    showResultInTable(){
        console.table(this.longestWorkingPair[0]);
    }

    checkIfDateIsValid(date) {
        return isNaN(date.getTime()) ? new Date() : date;
    }
}

export default Employees;

const fs = require("fs");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    })
}

//module.exports.getTAs = function () {
//    return new Promise(function (resolve, reject) {
//        var filteredStudents = [];
//
//        for (let i = 0; i < dataCollection.students.length; i++) {
//            if (dataCollection.students[i].TA == true) {
//                filteredStudents.push(dataCollection.students[i]);
//            }
//        }
//
//        if (filteredStudents.length == 0) {
//            reject("query returned 0 results"); return;
//        }
//
//       resolve(filteredStudents);
//    });
//};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getCourseById = function (id){
    return new Promise((resolve,reject) =>{
        var foundCourse=[];
        for(let i=0;i < dataCollection.courses.length;i++)
        {
            if(dataCollection.courses[i].courseId==id)
            {
                foundCourse.push(dataCollection.courses[i]);
            }
        }
        if(foundCourse.length<=0){
            reject("query returned 0 results");return;
        }
        else{
            resolve(foundCourse);
        }
     });
}

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i<dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};




module.exports.addStudent=(studentData)=>{
    console.log("This is student object", studentData);
    return new Promise((resolve, reject) =>{
        let updateStuData = dataCollection.students;
        studentData['studentNum'] = updateStuData.length+1;
        if(typeof studentData['TA'] !== undefined && studentData['TA'] === 'on') {
            studentData['TA'] = true;
        } else {
            studentData['TA'] = false;
        }
        updateStuData.push(studentData)
        
        fs.writeFile('./data/students.json', JSON.stringify(updateStuData), function(err, data) {
            if (err) {
                reject("Error", err);
            }
            console.log('Done!');
            resolve(data);
        });
    });
}


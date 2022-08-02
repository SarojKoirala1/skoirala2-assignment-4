const Sequelize = require('sequelize');
var sequelize = new Sequelize('deun3jc0i65dli', 'avmcfabsxlrvtj', '6e923adda1340091ca57bb8014f3e22b56f2e44fcec9adb66079be643c778396', {
    host: 'ec2-3-213-228-206.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query:{ raw: true }
});

const Student = sequelize.define('student', {
    studentNum: {
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    firstName:Sequelize.STRING,
    lastName:Sequelize.STRING,
    email:Sequelize.STRING,
    addressStreet:Sequelize.STRING,
    addressCity:Sequelize.STRING,
    addressProvince:Sequelize.STRING,
    TA:Sequelize.BOOLEAN,
    status:Sequelize.STRING,
});

 const Course = sequelize.define('course',{
    courseId:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});
Course.hasMany(Student, {foreignKey: 'course'});

//const fs = require("fs");

//class Data{
//    constructor(students, courses){
//        this.students = students;
//        this.courses = courses;
//    }
//}

//let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        //fs.readFile('./data/courses.json','utf8', (err, courseData) => {
        //    if (err) {
        //        reject("unable to load courses"); return;
        //    }

        //    fs.readFile('./data/students.json','utf8', (err, studentData) => {
        //        if (err) {
        //            reject("unable to load students"); return;
        //        }

        //        dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
        //        resolve();
            sequelize.sync()
            .then(() => resolve())
            .catch(() => reject("unable to sync the database"));
            });
//        });
//    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
    //   if (dataCollection.students.length == 0) {
    //        reject("query returned 0 results"); return;
    //    }

    //    resolve(dataCollection.students);
        Student.findAll()
        .then(()=>resolve(Student.findAll()))
        .catch(()=>reject("no results returned"))
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    //if (dataCollection.courses.length == 0) {
    //    reject("query returned 0 results"); return;
    //}

    //resolve(dataCollection.courses);
    Course.findAll()
        .then(()=>resolve(Course.findAll()))
        .catch(()=>reject("no results returned"))
   });
};

module.exports.getStudentByNum = function (studentNum) {
    return new Promise(function (resolve, reject) {
        //var foundStudent = null;

        //for (let i = 0; i < dataCollection.students.length; i++) {
        //    if (dataCollection.students[i].studentNum == num) {
        //        foundStudent = dataCollection.students[i];
        //    }
        //}

        //if (!foundStudent) {
        //    reject("query returned 0 results"); return;
        //}

        //resolve(foundStudent);
        Student.findAll({
            where:{
                studentNum: studentNum
            }
        })
        .then(()=>resolve(Student.findAll({
            where:{
                studentNum: studentNum
            }
        })))
        .catch(()=>reject("no results returned")) 
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        //var filteredStudents = [];

        //for (let i = 0; i < dataCollection.students.length; i++) {
        //    if (dataCollection.students[i].course == course) {
        //        filteredStudents.push(dataCollection.students[i]);
        //    }
        //}

        //if (filteredStudents.length == 0) {
        //    reject("query returned 0 results"); return;
        //}

        //resolve(filteredStudents);
        Student.findAll({
            where:{
                course: course
            }
        })
        .then(()=>resolve(Student.findAll({
            where:{
                course: course
            }
        })))
        .catch(()=>reject("no results returned"))
    });
};

module.exports.getCourseById = function (id) {
    return new Promise(function (resolve, reject) {
        //var foundCourse = null;

        //for (let i = 0; i < dataCollection.courses.length; i++) {
        //    if (dataCollection.courses[i].courseId == id) {
        //        foundCourse = dataCollection.courses[i];
        //    }
        //}

        //if (!foundCourse) {
        //    reject("query returned 0 results"); return;
        //}

        //resolve(foundCourse);
        Course.findAll({
            where:{
                courseId: id
            }
        })
        .then(()=>resolve(Course.findAll({
            where:{
                courseId: id
            }
        })))
        .catch(()=>reject("no results returned"))
    });
};

module.exports.addStudent = function (studentData) {
        studentData.TA = (studentData.TA) ? true : false;
        //studentData.TA = (studentData.TA) ? true : false;
        //studentData.studentNum = dataCollection.students.length + 1;
        //dataCollection.students.push(studentData);

        //resolve();
        for(prop in studentData){
            if(prop=="") prop=null;
        }
        return new Promise((resolve, reject) => {
            Student.create(studentData)
            .then(()=>resolve("Student Added"))
            .catch(()=>reject("unable to create student"))
        });

};

module.exports.updateStudent = function (studentData) {
        studentData.TA = (studentData.TA) ? true : false;
        //studentData.TA = (studentData.TA) ? true : false;

        //for(let i=0; i < dataCollection.students.length; i++){
        //    if(dataCollection.students[i].studentNum == studentData.studentNum){
        //        dataCollection.students[i] = studentData;
        //    }
        //}
        //resolve();
        for(prop in studentData){
            if(prop=="") prop=null;
        }
        return new Promise((resolve, reject) => {
            Student.update(studentData,{where: {studentNum:studentData.studentNum}}) 
            .then(()=>resolve("Student Updated"))
            .catch(()=>reject("unable to update student"))
        });
};


module.exports.addCourse = function (courseData) {
    for(prop in courseData){
        if(prop=="") prop=null;
    }
    return new Promise((resolve, reject) => {
        Course.create(courseData)
        .then(()=>resolve())
        .catch(()=>reject("unable to create course"))
    });

};

module.exports.updateCourse = function (courseData) {
    for(prop in courseData){
        if(prop=="") prop=null;
    }
    return new Promise((resolve, reject) => {
        Course.update(courseData,{where:{courseId: courseData.courseId}}) 
        .then(()=>resolve(Course.update(courseData,{where:{courseId: courseData.courseId}})))
        .catch(()=>reject("unable to update course"))
    });
};

module.exports.deleteCourseById = function(id){
    return new Promise((resolve, reject) => {
        Course.destroy({where: {courseId:id}}) 
        .then(()=>resolve("Destroyed"))
        .catch(()=>reject("unable to delete course"))
    });
};

module.exports.deleteStudentByNum = function(studentNum){
    return new Promise((resolve, reject) => {
        Student.destroy({where: {studentNum:studentNum}}) 
        .then(()=>resolve("Destroyed")) 
        .catch(()=>reject("unable to delete student"))
    });
};


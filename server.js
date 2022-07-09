/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Saroj Koirala 
*  Student ID: 133423210 
*  Date: 7/5/2022
*
*  Online (Heroku) Link: https://skoirala2-assignment-4.herokuapp.com/
*
********************************************************************************/ 
 

var HTTP_PORT = process.env.PORT || 8088;
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser')
var collegeData = require('./modules/collegeData');

app.use(express.static("public/css"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("images"));
//===================================================================================
//shopwing home page
//http://localhost:8088/
//home.html
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/views/home.html'))
});

//===================================================================================


//===================================================================================
//showing about page
//http://localhost:8088/about
//about.html
app.get('/about',(req,res)=>{
    res.sendFile(path.join(__dirname,'/views/about.html'))
});
//===================================================================================


//===================================================================================
//showing htmlDemo Page
//http://localhost:8088/htmlDemo
//htmlDemo.html
app.get('/htmlDemo',(req,res)=>{
    res.sendFile(path.join(__dirname,'/views/htmlDemo.html'))
});
//===================================================================================


//===================================================================================
//showing Add Student Page
//http://localhost:8088/students/add
//addStudents.html

app.get("/students/add", (req,res) => {
    res.sendFile(path.join(__dirname,"/views/addStudents.html"))
});
//===================================================================================


//===================================================================================
app.post("/students/add", (req, res)=> {
    if(req.body) {
        collegeData.addStudent(req.body).then((successData) => {
            res.redirect("http://localhost:8088/students");
        }).catch((err) => {
            res.send({Message : err})
        });
    }
});
//===================================================================================


//===================================================================================
//showing all courses
//http://localhost:8088/courses
//courses.json
// app.get('/courses',(req,res)=>{
//     res.sendFile(path.join(__dirname,'/data/courses.json'))
// });
app.get('/courses',(req,res)=>{
collegeData.getCourses().then((cdata)=>{
    var jString = JSON.stringify(cdata);
   res.send(jString);
 }).catch(()=>{
     res.send("NO result found");
 });
});
//===================================================================================


//===================================================================================
//showing all TAs
//http://localhost:8088/tas
app.get('/tas',(req,res)=>{
    collegeData.getTAs().then((tadata)=>{
        var jString = JSON.stringify(tadata);
        res.send(jString);
    }).catch(()=>{
        res.send("No result found")
    });
});
//===================================================================================


//===================================================================================
//showing students with specific course number if query is inputted in url otherwise showing all students
//http://localhost:8088/students?course=num
 app.get("/students",(req,res)=>{
     var scourse = req.query.course;
     if(scourse){
         collegeData.getStudentsByCourse(scourse)
         .then((scdata)=>{
             var jString = JSON.stringify(scdata);
             res.send(jString);
         })
         .catch((err)=>{
             res.send("No students with this Course Number Found");
         });
    
 }else{

//http://localhost:8088/students
     collegeData.getAllStudents().then((alldata)=>{
        var jString = JSON.stringify(alldata);
       res.send(jString);
     }).catch(()=>{
         res.send("NO result found");
     });
 }
 });
 //===================================================================================


 //===================================================================================
 //Showing student with specific student number typed as parameter in url
//http://localhost:8088/num
app.get("/students/:num",(req,res)=>{
    var snum = req.params.num;
    if(snum <=0){
        res.send("NO results");
    }else{
        collegeData.getStudentByNum(snum).then((stdata)=>{
        var resultStudent = JSON.stringify(stdata);
        res.send(resultStudent);
    }).catch(()=>{
        res.send("No Student with such Student Number")
    });
    }
});
//===================================================================================


//===================================================================================
//incase of page not found
app.get('*', function(req, res){
    res.send('404:Page Not Found');
  });
//===================================================================================


//===================================================================================
// setup http server to listen on HTTP_PORT
collegeData.initialize().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log(`Successful: Listening on ${HTTP_PORT}`)
    });
}).catch(function(err){
    console.log(err);
});
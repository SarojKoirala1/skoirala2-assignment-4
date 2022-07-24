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
const exphbs = require("express-handlebars");

app.use(express.static("public/css"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("images"));
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    helpers: {
        navLink: function (url, options) {
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set("view engine", ".hbs");
//===================================================================================

//===================================================================================
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});
//===================================================================================

//===================================================================================
//shopwing home page
//http://localhost:8088/
//home.hbs
app.get('/',(req,res)=>{
    res.render("home", {
        data: {},
        dataArr: {},
    })
});

//===================================================================================


//===================================================================================
//showing about page
//http://localhost:8088/about
//about.html
app.get('/about',(req,res)=>{
    res.render("about", {
        
    });
});
//===================================================================================


//===================================================================================
//showing htmlDemo Page
//http://localhost:8088/htmlDemo
//htmlDemo.html
app.get('/htmlDemo',(req,res)=>{
    res.render("htmlDemo",{

    });
});
//===================================================================================


//===================================================================================
//showing Add Student Page
//http://localhost:8088/students/add
//addStudents.html

app.get("/students/add", (req,res) => {
    res.render("addStudents",{

    });
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
app.post("/student/update", (req, res) => {
    console.log(req.body);
    res.redirect("/students");
});


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
    //res.send(jString);
    res.render("courses",{
        courses: cdata,
     });
 }).catch(()=>{
     res.render("courses", {message: "no results"});
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
             //res.send(jString);
             res.render("students",{
                students: scdata,
             });
         })
         .catch((err)=>{
            res.render("students", {message: "no results"});
         });
    
 }else{

//http://localhost:8088/students
     collegeData.getAllStudents()
     .then((alldata)=>{
        var jString = JSON.stringify(alldata);
        //res.send(jString);
        res.render("students",{
            students: alldata,
        });
     }).catch(()=>{
        res.render("students", {message: "no results"});
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
        res.render("student", { student: stdata }); 
    }).catch(()=>{
        res.render("student", {message: "no results"});
    });
    }
});
//===================================================================================
app.get("/course/:id",(req,res)=>{
    var cId = req.params.id;
    if(cId <=0){
        res.send("NO results");
    }else{
        collegeData.getCourseById(cId).then((crsdata)=>{
        var resultCourse = JSON.stringify(crsdata);
        res.render("course", {data: crsdata}); 
        //res.send(resultCourse)
    }).catch(()=>{
        res.render("course", {message: "no results"});
    });
    }
});
//=====================================================================================
app.post("/student/update", (req, res) => {
  collegeData.updateStudents(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.send(err);
    });
});

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
});2
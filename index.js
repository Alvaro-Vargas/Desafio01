//Requiring EXPRESS
const express = require('express');
var count_requests = 0;

//Defining the server
const server = express();

//Data structure that will receive the projects
const projects = [
    {
        id: "0",
        title: "New Project",
        tasks: ["New task"]
    },
    {
        id: "1",
        title: "New Project",
        tasks: ["New task"]
    }
]

//Necessary to inform exoress (the server) to use JSON format
server.use(express.json());

//GLOBAL Middlewares
//Count how many requests have been done so far
server.use((req, res, next) => {
    count_requests++;

    console.log(`So far: ${count_requests} requests`);

    next();
    
})

//LOCAL Middelewares

function checkNewProject(req, res, next) {
    //The project ID will be replaced by an auto increment
    // if (!req.body.id){
    //     return res.status(400).json("The new project is missing: PROJECT ID")
    // }

    if(!req.body.title){
        return res.status(400).json("The new project is missing: PROJECT TITLE")
    }

    next();
}

function checkId (req, res, next) {
    
    if (!projects[req.params.id]){
        return res.status(400).json('The project ID does not exist');
    };

    next();
}

//ROUTES

//List all Projects
server.get('/projects', (req, res) => {
    return res.json(projects);
})

//Lists ONE project
server.get('/projects/:id', checkId, (req, res) => {
    const {id} = req.params;

    return res.json(projects[id]);
})

//Add new project. (ID auto-increment)
server.post('/projects', checkNewProject, (req, res) =>{
    const { title } = req.body;

    projects.push({ id: projects.length.toString(), title: title, tasks: [] });

    return res.json(projects)
})

//Add a new task to one specific project 
server.post('/projects/:id/tasks', checkId, (req, res) =>{
    const { id } = req.params;
    const { task } = req.body;

    projects[id].tasks.push(task);

    return res.json(projects[id])
})

//Change project title
server.put('/projects/:id', checkId, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects[id].title = title;

    return res.json(projects[id])
})

//Delete one specific project
server.delete('/projects/:id', checkId, (req, res) => {
    const { id } = req.params;

    projects.splice(id, 1);

    //Once you delete one project, the project IDs must be updated
    for (let i = 0; i < projects.length; i++) {
        projects[i].id = i.toString();
    }

    return res.json(projects)
    

})

//Starting the server
server.listen(3000)
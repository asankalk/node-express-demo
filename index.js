const { response } = require('express'); // not sure where this came from
const Joi = require('joi');
const express = require('express');
const app = express();

//Middleware
app.use(express.json());

const courses = [
    { id:1, name: 'Course 1'},
    { id:2, name: 'Course 2'},
    { id:3, name: 'Course 3'},
];

app.get('/', (req, res) => {
    res.send("Hello, Asanka!");
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
})


app.post('/api/courses', (req, res) => {

    const { error} = validateCourse(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };
    courses.push(course);
});

app.put('/api/courses/:id', (req, res) =>{
    const course = courses.find (c => c.id === parseInt(req.params.id ));
    if (!course) res.status(404).send(`Course not found`);

    const { error}  = validateCourse(req.body); // This is equal to result.error - Object Destructuring
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);
});


app.get('/api/courses/:id', (req, res) => {
    const course = courses.find (c => c.id === parseInt(req.params.id ));
    if (!course) res.status(404).send(`Course not found`);
    res.send(course);
});


function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listning on ${port}`));

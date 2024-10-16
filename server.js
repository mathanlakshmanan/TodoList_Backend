const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.DBURL).then(()=>{
    console.log("DB Conneted");
    
}).catch((err)=>{
    console.log(err);
    
})

const todoSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
});

const Todo = mongoose.model("Todo", todoSchema);


app.post('/todolist', async(req, res)=>{
    const {title, description} = req.body;
    try {
        const newtodo = new Todo({title, description});
        await newtodo.save();
        res.status(201).json(newtodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
        
    }
})

app.get("/todos", async(req, res)=>{
try {
   const allTodo = await Todo.find();
   res.status(200).json(allTodo);
} catch (error) {
    console.log(error);
    res.status(500).json({message:error.message});
    
}
})

app.put('/todos/:id', async (req, res)=>{
    try {
        const {title, description} = req.body;
        const id = req.params.id;
        const updateTodo = await Todo.findByIdAndUpdate({_id:id},{title,description},{new:true});
        res.status(200).json(updateTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
        
    }
})

app.delete('/todos/:id', async(req, res)=>{
    try {
        const id = req.params.id;
        await Todo.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})


app.listen(8000, ()=>{
    console.log("Server Running on 8000");
    
})
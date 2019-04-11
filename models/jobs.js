const mongoose = require("mongoose")

//schema set up 

const jobSchema = new mongoose.Schema({
    title:String,
    location:String, 
    salary:String,
    description:String,
});


module.exports = mongoose.model('Job', jobSchema);
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"), 
    User        = require("./models/user"), 
    Job  = require("./models/jobs");
    



 mongoose.connect("mongodb+srv://jordanlfc1989:Salah3848!@cluster0-lzsn2.mongodb.net/recsite?retryWrites=true");
// mongoose.connect('mongodb://localhost:27017/yelp_camp_v11', {useNewUrlParser: true});
// mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})



//--setup

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "omg hello !",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
   next();
});

//-- setup--end 



//-- functions 

const authenticator = (passport.authenticate('local', {
        successRedirect:'/staff_portal',
        failureRedirect:'/login'
}));


//-- functions--end 




//--get routes

app.get('/', (req,res) => res.render('index'))

app.get('/about', (req,res) => res.render('about'))

app.get('/login', (req,res) => res.render('login'))

app.get('/logout', (req,res) => (req.logout() ,res.redirect('/jobs')));

app.get('/jobs', (req,res) => res.render('jobs'))

app.get('/1234/create/new/newadmin/create1234', (req,res) => res.render('reg'))

app.get('/staff_portal', (req,res)=> {
    Job.find({}, (err,allJobs) => err? console.log(err) : res.render('portal', {allJobs:allJobs}))
});

app.get('/staff_portal/newjob', (req,res) => res.render('newjob'))

// router.get('/:id/edit',middleware.checkCampOwnership,(req,res) => {
//     Campground.findById(req.params.id, function(err,foundCampground){
//         res.render("campgrounds/edit", {campground: foundCampground});
//     });
// });

app.get('/staff_portal/:id/edit', (req,res)=> {
    Job.findById(req.params.id, function(err,foundJob){
        res.render('editjob', {job:foundJob});
    });
});
    

//--get routes--end 







//--post routes

app.post('/login', authenticator ,(req,res,err) => {
    
});

app.post("/1234/create/new/newadmin/create1234", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render('reg');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect('/staff_portal'); 
        });
    });
});


app.post('/staff_portal', (req,res) => {
    let jobTitle = req.body.jTitle
    let jobLocation = req.body.jLocation
    let jobSalary = req.body.jSalary
    let jobDescription = req.body.jDescription
    
    let newJob = {title:jobTitle, location:jobLocation, salary:jobSalary, description:jobDescription}
    
    Job.create(newJob, (err,newlyCreated) => err? console.log(err) : (res.redirect('/staff_portal'), console.log(newlyCreated)));
    
})

//--post route--end


//--update route

// router.put('/:id',middleware.checkCampOwnership, (req,res) => {
//     Campground.findByIdAndUpdate(req.params.id,req.body.campground, (err,updatedCampground) => err? res.redirect('/campgrounds') :
//     res.redirect('/campgrounds/'+req.params.id));
// });


app.put('/staff_portal/:id', (req,res) => {
    console.log(req.body.job);
    Job.findOneAndUpdate(req.params.id,req.body.job, (err,updatedJob) => err? res.redirect('/staff_portal') :
    res.redirect('/staff_portal'));
    
});



//--delete routes

app.delete('/staff_portal/:id',(req,res)=> {
    Job.findByIdAndDelete(req.params.id, (err) => err? res.redirect('/staff_portal') :
    res.redirect('/staff_portal'))
});

//--delete route --end 










app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"), 
    User        = require("./models/user");
    



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
app.get('/jobs', (req,res) => res.render('jobs'))
app.get('/1234/create/new/newadmin/create1234', (req,res) => res.render('reg'))
app.get('/staff_portal', (req,res)=> res.render('portal'))
app.get('/logout', (req,res) => (req.logout() ,res.redirect('/jobs')));

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

//-post route--end





app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"), 
    User        = require("./models/user");
    



// mongoose.connect("mongodb+srv://jordanlfc1989:Salah3848!@cluster0-lzsn2.mongodb.net/yelp_camp?retryWrites=true");
// mongoose.connect('mongodb://localhost:27017/yelp_camp_v11', {useNewUrlParser: true});
// mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});



app.get('/', (req,res) => res.render('index'))
app.get('/about', (req,res) => res.render('about'))
app.get('/login', (req,res) => res.render('login'))
app.get('/jobs', (req,res) => res.render('jobs'))


app.post('/login',(req,res) => res.send('login'))





app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});

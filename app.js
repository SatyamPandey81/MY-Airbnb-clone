const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./init/utils/wrapAsync.js");
const ExpressError = require("./init/utils/expressErr.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session  = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const flash = require("connect-flash");
const { isLoggedIn, isOwner, isReviewOwner } = require("./middleware");


const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));

// session configuration
app.use(session({
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
}));

// flash configuration
app.use(flash());

// passport configuration
app.use(passport.initialize());

// to use persistent login sessions
app.use(passport.session());


// using static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});



app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req, res)=>{
    res.send("Hi I Am Root");
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// index route
app.get("/listings",wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New Route
app.get("/listings/new", isLoggedIn, wrapAsync(async (req,res)=> {
    res.render("listings/new.ejs");
}));

// Show Route
app.get("/listings/:id",wrapAsync(async (req, res)=> {
    let{id} = req.params; 
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "owner"
        }
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));


// Create Route
app.post("/listings", isLoggedIn, validateListing, wrapAsync(async (req,res)=> {

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    if (req.body.listing.image && req.body.listing.image.trim() !== "") {
        newListing.image = {
            url: req.body.listing.image,
            filename: "listingimage"
        };
    }

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit", isLoggedIn, isOwner, wrapAsync(async(req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "You can edit the listing now!");
    res.render("listings/edit.ejs",{listing});
}));

// Update Route
app.put("/listings/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {

    let { id } = req.params;

    let updatedData = { ...req.body.listing };

    // SAFE image update
    if (req.body.listing.image && req.body.listing.image.trim() !== "") {
        updatedData.image = {
            url: req.body.listing.image,
            filename: "listingimage"
        };
    }

    await Listing.findByIdAndUpdate(id, updatedData);
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}));

// Delete Route

app.delete("/listings/:id", isLoggedIn, isOwner, wrapAsync(async (req, res)=> {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}));

// Post route for reviews
app.post("/listings/:id/reviews", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.owner = req.user._id;

    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();
    req.flash("success", "Review added!");

    res.redirect(`/listings/${listing._id}`);
}));

// Delete route for reviews
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}));

// get route for the signup form
app.get("/signup",(req, res) => {
    res.render("users/signup.ejs");
});

// post route for the signup form
app.post("/signup", wrapAsync(async (req, res, next) => {
    try{
        let { username, password } = req.body;
        const newUser = new User({ username });

        const registeredUser = await User.register(newUser, password);
        // after successful registration, we want to log in the user
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// get route for the login form
app.get("/login",(req, res) => {
    res.render("users/login.ejs");
});

// post route for the login form
app.post("/login", 
    passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password!"
    }), 
    (req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect("/listings");
    });

// logout route
app.get("/logout",(req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
});


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
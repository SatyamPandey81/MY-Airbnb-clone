const Listing = require("./models/listing.js");

// login check

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
};

// validation for listing

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if(!listing || !listing.owner || !listing.owner.equals(req.user._id)) {
        return res.redirect("/listings");
    }
    next();
};

// review validation

const Review = require("./models/review.js");

module.exports.isReviewOwner = async (req, res, next) => {
    let { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if(!review || !review.owner.equals(req.user._id)){
        return res.redirect("/listings");
    }
    next();
};

// flash messages
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash("error", "You must be logged in first!");
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login");
    }
    next();
};
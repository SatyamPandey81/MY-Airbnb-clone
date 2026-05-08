const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=60",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=60"
          : v,
    },
  },

  price: {
    type: Number,
    min: 0,
  },

  location: {
    type: String,
    trim: true,
  },

  country: {
    type: String,
    trim: true,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});


listingSchema.post("findByIdAndDelete", async (listing) => {
  if(listing){
    await review.deleteMany({_id: {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
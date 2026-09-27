const Listing = require("../models/listing");

// Map of common cities to coordinates [lng, lat] for interactive map fallback
const CITY_COORDINATES = {
  "malibu": [-118.7798, 34.0259],
  "new york city": [-74.0060, 40.7128],
  "new york": [-74.0060, 40.7128],
  "aspen": [-106.8175, 39.1911],
  "florence": [11.2558, 43.7696],
  "portland": [-122.6784, 45.5152],
  "cancun": [-86.8515, 21.1619],
  "lake tahoe": [-120.0324, 39.0968],
  "los angeles": [-118.2437, 34.0522],
  "swiss alps": [8.5417, 46.5584],
  "serengeti": [34.8333, -2.3333],
  "bali": [115.1889, -8.4095],
  "banff": [-115.5708, 51.1784],
  "santorini": [25.4317, 36.3932],
  "tokyo": [139.6917, 35.6895],
  "cotswolds": [-1.8833, 51.8333],
  "amalfi coast": [14.6027, 40.6340],
  "phuket": [98.3981, 7.8804],
  "scottish highlands": [-4.2026, 57.3061],
  "dubai": [55.2708, 25.2048],
  "maui": [-156.3319, 20.7984],
  "zermatt": [7.7491, 46.0207],
  "fiji": [178.0650, -17.7134],
  "provence": [5.3698, 43.8333],
  "lake como": [9.2572, 45.9939],
  "kyoto": [135.7681, 35.0116],
  "goa": [73.8567, 15.2993],
  "mumbai": [72.8777, 19.0760],
  "delhi": [77.1025, 28.7041],
};

function getCoordinatesForLocation(location, country) {
  const locLower = (location || "").toLowerCase().trim();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (locLower.includes(key)) {
      return coords;
    }
  }
  return [77.2090, 28.6139]; // Default coordinates
}

module.exports.index = async (req, res) => {
  const { category, search } = req.query;
  let filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [
      { title: searchRegex },
      { location: searchRegex },
      { country: searchRegex },
      { description: searchRegex }
    ];
  }

  let listings = await Listing.find(filter);
  res.render("listing/index", { listings, activeCategory: category || null, searchQuery: search || "" });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  res.render("listing/show", { listing });
};

module.exports.createListing = async (req, res) => {
  const listingData = req.body.listing || req.body;
  const newListing = new Listing(listingData);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  } else if (typeof listingData.image === "string" && listingData.image.trim() !== "") {
    newListing.image = { url: listingData.image.trim(), filename: "listingimage" };
  }

  // Set geometry coordinates
  const coords = getCoordinatesForLocation(newListing.location, newListing.country);
  newListing.geometry = { type: "Point", coordinates: coords };

  await newListing.save();
  req.flash("success", "New listing created successfully!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image?.url || listing.image;
  if (originalImageUrl && originalImageUrl.includes("/upload")) {
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  }

  res.render("listing/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const updateData = req.body.listing || req.body;

  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  listing.title = updateData.title || listing.title;
  listing.description = updateData.description || listing.description;
  listing.price = updateData.price !== undefined ? updateData.price : listing.price;
  listing.location = updateData.location || listing.location;
  listing.country = updateData.country || listing.country;
  if (updateData.category) {
    listing.category = updateData.category;
  }

  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  } else if (typeof updateData.image === "string" && updateData.image.trim() !== "") {
    listing.image = { url: updateData.image.trim(), filename: "listingimage" };
  }

  // Update geometry if location changed
  if (updateData.location) {
    const coords = getCoordinatesForLocation(listing.location, listing.country);
    listing.geometry = { type: "Point", coordinates: coords };
  }

  await listing.save();
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};


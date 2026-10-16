const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
    initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const CITY_COORDINATES = {
  "malibu": [-118.7798, 34.0259],
  "new york city": [-74.0060, 40.7128],
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

const CATEGORIES = [
  "trending", "rooms", "cities", "mountains", "castles",
  "pools", "camping", "farms", "arctic", "boats", "domes"
];

function getCoordinates(location) {
  const locLower = (location || "").toLowerCase().trim();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (locLower.includes(key)) {
      return coords;
    }
  }
  return [77.2090, 28.6139];
}

const initDB = async () => {
  await Listing.deleteMany({});
  let ownerUser = await User.findOne({});

  if (!ownerUser) {
    console.log("Creating default owner user...");
    const newUser = new User({ email: "admin@wanderlust.com", username: "wanderlust_admin" });
    ownerUser = await User.register(newUser, "admin123");
  }

  const updatedData = initData.data.map((obj, idx) => {
    const coords = getCoordinates(obj.location);
    const category = obj.category || CATEGORIES[idx % CATEGORIES.length];
    const imageUrl = typeof obj.image === "object" && obj.image !== null ? obj.image.url : obj.image;
    const filename = typeof obj.image === "object" && obj.image !== null ? (obj.image.filename || "listingimage") : "listingimage";

    return {
      ...obj,
      image: { url: imageUrl, filename: filename },
      owner: ownerUser._id,
      geometry: { type: "Point", coordinates: coords },
      category: category,
    };
  });

  await Listing.insertMany(updatedData);
  console.log("Database initialized successfully with sample listings!");
  mongoose.connection.close();
};
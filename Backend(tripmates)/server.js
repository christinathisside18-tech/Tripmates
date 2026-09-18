import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js'; 

dotenv.config();
const app = express(); 

app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/TripMates";

mongoose.connect(MONGO_URI)
    .then(() => console.log(" MongoDB Connected Successfully!"))
    .catch((err) => console.log(" MongoDB Connection Error: ", err.message));

// --- 1. POST SCHEMA & MODEL ---
const postSchema = new mongoose.Schema({
    user: { type: String, required: true },
    location: { type: String, default: "Explorer Mode" },
    caption: { type: String, required: true },
    image: { type: String },
    likes: { type: Number, default: 0 },
    points: { type: Number, default: 100 },
    createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

// --- 2. ACTIVITY STATS SCHEMA & MODEL ---
const activityStatsSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    flights: { type: Number, default: 0 },
    hotels: { type: Number, default: 0 },
    guides: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    trips: { type: Number, default: 0 },
    buddies: { type: Number, default: 0 }
});
const ActivityStats = mongoose.model('ActivityStats', activityStatsSchema);

// --- 3. FOLLOWERS SCHEMA & MODEL ---
const followSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] }
});
const Follow = mongoose.model('Follow', followSchema);

// --- 4. FLIGHT BOOKING SCHEMA & MODEL ---
const flightBookingSchema = new mongoose.Schema({
    username: { type: String, required: true },
    airline: { type: String },
    flightNo: { type: String },
    from: { type: String },
    to: { type: String },
    departDate: { type: String },
    travelClass: { type: String },
    passengers: { type: Number },
    totalPrice: { type: Number },
    passengerDetails: [{
        name: { type: String },
        age: { type: String },
        passportId: { type: String },
        contact: { type: String },
        email: { type: String },
        aadhar: { type: String },
        pan: { type: String }
    }],
    bookedAt: { type: Date, default: Date.now }
});
const FlightBookingModel = mongoose.model('FlightBooking', flightBookingSchema);

// --- 5. HOTEL BOOKING SCHEMA & MODEL ---
const hotelBookingSchema = new mongoose.Schema({
    username: { type: String, required: true },
    hotelName: { type: String },
    area: { type: String },
    city: { type: String },
    checkIn: { type: String },
    checkOut: { type: String },
    nights: { type: Number },
    guests: { type: Number },
    roomType: { type: String },
    totalPrice: { type: Number },
    guestDetails: {
        name: { type: String },
        contact: { type: String },
        email: { type: String },
        aadhar: { type: String },
        pan: { type: String }
    },
    bookedAt: { type: Date, default: Date.now }
});
const HotelBookingModel = mongoose.model('HotelBooking', hotelBookingSchema);

// --- 6. VAULT SCHEMA & MODEL ---
const vaultSchema = new mongoose.Schema({
    username: { type: String, required: true },
    docName: { type: String, required: true },
    category: { type: String, required: true },
    fileData: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
});
const VaultDoc = mongoose.model('VaultDoc', vaultSchema);

// ── Emergency Contact Schema ──
const EmergencyContactSchema = new mongoose.Schema({
  username: String,
  name: String,
  phone: String,
  relation: String,
  createdAt: { type: Date, default: Date.now }
});
const EmergencyContact = mongoose.model('EmergencyContact', EmergencyContactSchema);

// ── Trip Check-In Schema ──
const TripCheckInSchema = new mongoose.Schema({
  username: String,
  message: String,
  contact: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
});
const TripCheckIn = mongoose.model('TripCheckIn', TripCheckInSchema);

// --- GROUP TRIP SCHEMA ---
const groupTripSchema = new mongoose.Schema({
  organizerUsername: { type: String, required: true },
  organizerName: { type: String },
  destination: { type: String, required: true },
  travelDate: { type: String, required: true },
  returnDate: { type: String },
  totalSeats: { type: Number, default: 4 },
  filledSeats: { type: Number, default: 1 },
  tripType: { type: String, enum: ['group', 'solo_open', 'friend_backed_out'], default: 'group' },
  description: { type: String },
  isVisible: { type: Boolean, default: true },
  joinRequests: [{ username: String, message: String, status: { type: String, default: 'pending' } }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
const GroupTrip = mongoose.model('GroupTrip', groupTripSchema);

// --- BUDDY FINDER SCHEMA ---
const buddyFinderSchema = new mongoose.Schema({
  username: { type: String, required: true },
  destination: { type: String, required: true },
  travelDate: { type: String, required: true },
  returnDate: { type: String },
  isActive: { type: Boolean, default: true },
  isAnonymous: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
const BuddyFinder = mongoose.model('BuddyFinder', buddyFinderSchema);

// --- LOCAL GUIDE SCHEMA ---
const localGuideSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  bio: { type: String },
  languages: { type: [String], default: [] },
  specialties: { type: [String], default: [] },
  pricePerHour: { type: Number },
  pricePerDay: { type: Number },
  experience: { type: String },
  isAvailable: { type: Boolean, default: true },
  ratings: [{ username: String, rating: Number, review: String, date: { type: Date, default: Date.now } }],
  avgRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const LocalGuide = mongoose.model('LocalGuide', localGuideSchema);

// --- GUIDE BOOKING SCHEMA ---
const guideBookingSchema = new mongoose.Schema({
  guideUsername: { type: String, required: true },
  touristUsername: { type: String, required: true },
  touristName: { type: String },
  tourDate: { type: String, required: true },
  duration: { type: String, required: true },
  bookingType: { type: String, enum: ['hourly', 'daily'], required: true },
  totalPrice: { type: Number },
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const GuideBooking = mongoose.model('GuideBooking', guideBookingSchema);

// ─── DAY PLAN SCHEMA & MODEL ───────────────────────────────────────
const dayPlanSchema = new mongoose.Schema({
  username: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  planDate: { type: String, required: true },
  planName: { type: String, default: 'My Day Plan' },
  activities: [{
    activityName: { type: String, required: true },
    category: { type: String },
    time: { type: String },
    duration: { type: String },
    cost: { type: Number, default: 0 },
    notes: { type: String },
    completed: { type: Boolean, default: false }
  }],
  totalCost: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const DayPlan = mongoose.model('DayPlan', dayPlanSchema);

// =================================================================
// ALL ROUTES
// =================================================================

// --- SIGNUP ---
app.post('/api/signup', async (req, res) => {
    try {
        const { fullName, email, username, mobileNumber, password } = req.body;
        const newUser = new User({ fullName, email, username, mobileNumber, password });
        await newUser.save();
        res.status(201).json({ success: true, message: "Registration successful! ", user: { fullName: newUser.fullName, username: newUser.username } });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: "Email or Username already exists! " });
        res.status(400).json({ message: err.message });
    }
});

// --- LOGIN ---
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || user.password !== password) return res.status(400).json({ message: "Invalid credentials! " });
        res.status(200).json({ success: true, message: "Welcome back to TripMates! ", user: { fullName: user.fullName, username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
});

// --- SOCIAL FEED ROUTES ---
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) { res.status(500).json({ message: "Error fetching posts" }); }
});

app.post('/api/posts', async (req, res) => {
    try {
        const { user, caption, image, location } = req.body;
        const newPost = new Post({ user, caption, image, location });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) { res.status(400).json({ message: "Error creating post" }); }
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) { res.status(500).json({ message: "Delete failed" }); }
});

app.patch('/api/posts/:id/like', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json({ likes: post.likes });
    } catch (err) { res.status(500).json({ message: "Like failed" }); }
});

// --- ACTIVITY STATS ---
app.get('/api/stats/:username', async (req, res) => {
    try {
        const stats = await ActivityStats.findOne({ username: req.params.username });
        if (!stats) return res.status(200).json({ username: req.params.username, flights: 0, hotels: 0, guides: 0, activities: 0, trips: 0, buddies: 0 });
        res.status(200).json(stats);
    } catch (err) { res.status(500).json({ message: "Error fetching stats" }); }
});

// --- FOLLOWERS ---
app.get('/api/follow/:username', async (req, res) => {
    try {
        const data = await Follow.findOne({ username: req.params.username });
        if (!data) return res.status(200).json({ followers: 0, following: 0 });
        res.status(200).json({ followers: data.followers.length, following: data.following.length });
    } catch (err) { res.status(500).json({ message: "Error fetching follow data" }); }
});

app.post('/api/follow', async (req, res) => {
    try {
        const { followerUsername, targetUsername } = req.body;
        await Follow.findOneAndUpdate({ username: targetUsername }, { $addToSet: { followers: followerUsername } }, { upsert: true, new: true });
        await Follow.findOneAndUpdate({ username: followerUsername }, { $addToSet: { following: targetUsername } }, { upsert: true, new: true });
        res.status(200).json({ message: "Followed successfully" });
    } catch (err) { res.status(500).json({ message: "Follow failed" }); }
});

app.post('/api/unfollow', async (req, res) => {
    try {
        const { followerUsername, targetUsername } = req.body;
        await Follow.findOneAndUpdate({ username: targetUsername }, { $pull: { followers: followerUsername } });
        await Follow.findOneAndUpdate({ username: followerUsername }, { $pull: { following: targetUsername } });
        res.status(200).json({ message: "Unfollowed successfully" });
    } catch (err) { res.status(500).json({ message: "Unfollow failed" }); }
});

// --- FLIGHT BOOKING ---
app.post('/api/bookflight', async (req, res) => {
    try {
        const booking = new FlightBookingModel(req.body);
        await booking.save();
        res.status(201).json({ success: true, message: "Flight booked successfully", booking });
    } catch (err) { res.status(400).json({ message: "Booking failed" }); }
});

// --- HOTEL BOOKING ---
app.post('/api/bookhotel', async (req, res) => {
    try {
        const booking = new HotelBookingModel(req.body);
        await booking.save();
        res.status(201).json({ success: true, message: "Hotel booked successfully", booking });
    } catch (err) { res.status(400).json({ message: "Hotel booking failed" }); }
});

// --- VAULT ---
app.get('/api/vault/:username', async (req, res) => {
    try {
        const docs = await VaultDoc.find({ username: req.params.username }).sort({ uploadedAt: -1 });
        res.status(200).json(docs);
    } catch (err) { res.status(500).json({ message: "Error fetching documents" }); }
});

app.post('/api/vault', async (req, res) => {
    try {
        const doc = new VaultDoc(req.body);
        await doc.save();
        res.status(201).json({ success: true, message: "Document uploaded", doc });
    } catch (err) { res.status(400).json({ message: "Upload failed" }); }
});

app.delete('/api/vault/:id', async (req, res) => {
    try {
        await VaultDoc.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Document deleted" });
    } catch (err) { res.status(500).json({ message: "Delete failed" }); }
});

// --- BUDDY FINDER ---
app.post('/api/buddy-finder', async (req, res) => {
  try {
    await BuddyFinder.updateMany({ username: req.body.username }, { isActive: false });
    const entry = new BuddyFinder(req.body);
    await entry.save();
    res.status(201).json({ success: true, entry });
  } catch (err) { res.status(400).json({ message: 'Registration failed' }); }
});

app.get('/api/buddy-finder/:destination/:date', async (req, res) => {
  try {
    const buddies = await BuddyFinder.find({ destination: { $regex: req.params.destination, $options: 'i' }, travelDate: req.params.date, isActive: true });
    res.status(200).json({ count: buddies.length, destination: req.params.destination });
  } catch (err) { res.status(500).json({ message: 'Error fetching buddies' }); }
});

app.get('/api/buddy-finder/user/:username', async (req, res) => {
  try {
    const entry = await BuddyFinder.findOne({ username: req.params.username, isActive: true });
    res.status(200).json({ active: !!entry, entry: entry || null });
  } catch (err) { res.status(500).json({ message: 'Error checking buddy status' }); }
});

app.delete('/api/buddy-finder/:username', async (req, res) => {
  try {
    await BuddyFinder.updateMany({ username: req.params.username }, { isActive: false });
    res.status(200).json({ message: 'Removed from buddy finder' });
  } catch (err) { res.status(500).json({ message: 'Error removing buddy' }); }
});

// --- GROUP TRIP ---
app.post('/api/group-trip', async (req, res) => {
  try {
    const trip = new GroupTrip(req.body);
    await trip.save();
    res.status(201).json({ success: true, trip });
  } catch (err) { res.status(400).json({ message: 'Group trip creation failed' }); }
});

app.get('/api/group-trip', async (req, res) => {
  try {
    const filter = { isActive: true, isVisible: true };
    if (req.query.destination) filter.destination = { $regex: req.query.destination, $options: 'i' };
    const trips = await GroupTrip.find(filter).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (err) { res.status(500).json({ message: 'Error fetching group trips' }); }
});

app.get('/api/group-trip/user/:username', async (req, res) => {
  try {
    const trips = await GroupTrip.find({ organizerUsername: req.params.username, isActive: true });
    res.status(200).json(trips);
  } catch (err) { res.status(500).json({ message: 'Error fetching trips' }); }
});

app.post('/api/group-trip/:id/join', async (req, res) => {
  try {
    const trip = await GroupTrip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const already = trip.joinRequests.find(r => r.username === req.body.username);
    if (already) return res.status(400).json({ message: 'Already requested' });
    trip.joinRequests.push({ username: req.body.username, message: req.body.message || '' });
    await trip.save();
    res.status(200).json({ success: true, message: 'Join request sent!' });
  } catch (err) { res.status(500).json({ message: 'Join request failed' }); }
});

app.post('/api/group-trip/:id/notify', async (req, res) => {
  try {
    const trip = await GroupTrip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json({ success: true, message: 'Organizer notified!' });
  } catch (err) { res.status(500).json({ message: 'Notify failed' }); }
});

app.delete('/api/group-trip/:id', async (req, res) => {
  try {
    await GroupTrip.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ message: 'Trip cancelled' });
  } catch (err) { res.status(500).json({ message: 'Error cancelling trip' }); }
});

// --- LOCAL GUIDE ---
app.post('/api/guides', async (req, res) => {
  try {
    const existing = await LocalGuide.findOne({ username: req.body.username });
    if (existing) {
      const updated = await LocalGuide.findOneAndUpdate({ username: req.body.username }, req.body, { new: true });
      return res.status(200).json({ success: true, guide: updated });
    }
    const guide = new LocalGuide(req.body);
    await guide.save();
    res.status(201).json({ success: true, guide });
  } catch (err) { res.status(400).json({ message: 'Guide registration failed' }); }
});

app.get('/api/guides', async (req, res) => {
  try {
    const filter = {};
    if (req.query.city) filter.city = { $regex: req.query.city, $options: 'i' };
    if (req.query.available) filter.isAvailable = true;
    const guides = await LocalGuide.find(filter).sort({ avgRating: -1 });
    res.status(200).json(guides);
  } catch (err) { res.status(500).json({ message: 'Error fetching guides' }); }
});

app.get('/api/guides/:username', async (req, res) => {
  try {
    const guide = await LocalGuide.findOne({ username: req.params.username });
    if (!guide) return res.status(404).json({ message: 'Guide not found' });
    res.status(200).json(guide);
  } catch (err) { res.status(500).json({ message: 'Error fetching guide' }); }
});

app.post('/api/guides/:username/review', async (req, res) => {
  try {
    const guide = await LocalGuide.findOne({ username: req.params.username });
    if (!guide) return res.status(404).json({ message: 'Guide not found' });
    const alreadyReviewed = guide.ratings.find(r => r.username === req.body.username);
    if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' });
    guide.ratings.push({ username: req.body.username, rating: req.body.rating, review: req.body.review });
    guide.totalReviews = guide.ratings.length;
    guide.avgRating = guide.ratings.reduce((s, r) => s + r.rating, 0) / guide.ratings.length;
    await guide.save();
    res.status(200).json({ success: true, guide });
  } catch (err) { res.status(500).json({ message: 'Review failed' }); }
});

app.patch('/api/guides/:username/availability', async (req, res) => {
  try {
    const guide = await LocalGuide.findOneAndUpdate({ username: req.params.username }, { isAvailable: req.body.isAvailable }, { new: true });
    res.status(200).json({ success: true, guide });
  } catch (err) { res.status(500).json({ message: 'Update failed' }); }
});

// --- GUIDE BOOKING ---
app.post('/api/guide-booking', async (req, res) => {
  try {
    const booking = new GuideBooking(req.body);
    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (err) { res.status(400).json({ message: 'Booking request failed' }); }
});

app.get('/api/guide-booking/guide/:username', async (req, res) => {
  try {
    const bookings = await GuideBooking.find({ guideUsername: req.params.username }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) { res.status(500).json({ message: 'Error fetching bookings' }); }
});

app.get('/api/guide-booking/tourist/:username', async (req, res) => {
  try {
    const bookings = await GuideBooking.find({ touristUsername: req.params.username }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) { res.status(500).json({ message: 'Error fetching bookings' }); }
});

app.patch('/api/guide-booking/:id/status', async (req, res) => {
  try {
    const booking = await GuideBooking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json({ success: true, booking });
  } catch (err) { res.status(500).json({ message: 'Status update failed' }); }
});

// --- DAY PLAN ---
app.post('/api/dayplan', async (req, res) => {
  try {
    const { username, city, planDate } = req.body;
    const existing = await DayPlan.findOne({ username, city, planDate });
    if (existing) {
      const updated = await DayPlan.findOneAndUpdate({ username, city, planDate }, { ...req.body, updatedAt: new Date() }, { new: true });
      return res.status(200).json({ success: true, plan: updated });
    }
    const plan = new DayPlan(req.body);
    await plan.save();
    res.status(201).json({ success: true, plan });
  } catch (err) { res.status(400).json({ message: 'Day plan save failed' }); }
});

app.get('/api/dayplan/:username', async (req, res) => {
  try {
    const plans = await DayPlan.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (err) { res.status(500).json({ message: 'Error fetching day plans' }); }
});

app.get('/api/dayplan/single/:id', async (req, res) => {
  try {
    const plan = await DayPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.status(200).json(plan);
  } catch (err) { res.status(500).json({ message: 'Error fetching plan' }); }
});

app.patch('/api/dayplan/:id/activity/:actIndex', async (req, res) => {
  try {
    const plan = await DayPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    plan.activities[req.params.actIndex].completed = req.body.completed;
    plan.updatedAt = new Date();
    await plan.save();
    res.status(200).json({ success: true, plan });
  } catch (err) { res.status(500).json({ message: 'Update failed' }); }
});

app.delete('/api/dayplan/:id', async (req, res) => {
  try {
    await DayPlan.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Day plan deleted' });
  } catch (err) { res.status(500).json({ message: 'Delete failed' }); }
});

// --- EMERGENCY CONTACTS ---
app.get('/api/emergency-contacts/:username', async (req, res) => {
  const contacts = await EmergencyContact.find({ username: req.params.username });
  res.json(contacts);
});
app.post('/api/emergency-contacts', async (req, res) => {
  const contact = new EmergencyContact(req.body);
  await contact.save();
  res.json(contact);
});
app.delete('/api/emergency-contacts/:id', async (req, res) => {
  await EmergencyContact.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// --- TRIP CHECK-IN ---
app.post('/api/checkins', async (req, res) => {
  const checkIn = new TripCheckIn(req.body);
  await checkIn.save();
  res.json(checkIn);
});
app.get('/api/checkins/:username', async (req, res) => {
  const checkIns = await TripCheckIn.find({ username: req.params.username }).sort({ createdAt: -1 }).limit(10);
  res.json(checkIns);
});

// =================================================================
// ADMIN ROUTES
// =================================================================

// Admin credentials (hardcoded)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'tripmates@admin123';

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true, message: 'Admin login successful' });
  }
  res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

// Overview stats
app.get('/api/admin/overview', async (req, res) => {
  try {
    const [totalUsers, totalPosts, totalFlights, totalHotels, totalDayPlans, totalGuideBookings, totalGuides] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      FlightBookingModel.countDocuments(),
      HotelBookingModel.countDocuments(),
      DayPlan.countDocuments(),
      GuideBooking.countDocuments(),
      LocalGuide.countDocuments(),
    ]);
    res.status(200).json({ totalUsers, totalPosts, totalFlights, totalHotels, totalDayPlans, totalGuideBookings, totalGuides });
  } catch (err) { res.status(500).json({ message: 'Error fetching overview' }); }
});

// Get all users list
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) { res.status(500).json({ message: 'Error fetching users' }); }
});

// Get full details of one user
app.get('/api/admin/users/:username', async (req, res) => {
  try {
    const u = req.params.username;
    const [user, flightBookings, hotelBookings, posts, stats, followData, vaultDocs, dayPlans, guideBookings] = await Promise.all([
      User.findOne({ username: u }),
      FlightBookingModel.find({ username: u }).sort({ bookedAt: -1 }),
      HotelBookingModel.find({ username: u }).sort({ bookedAt: -1 }),
      Post.find({ user: u }).sort({ createdAt: -1 }),
      ActivityStats.findOne({ username: u }),
      Follow.findOne({ username: u }),
      VaultDoc.find({ username: u }).sort({ uploadedAt: -1 }),
      DayPlan.find({ username: u }).sort({ createdAt: -1 }),
      GuideBooking.find({ touristUsername: u }).sort({ createdAt: -1 }),
    ]);
    res.status(200).json({ user, flightBookings, hotelBookings, posts, stats, followData, vaultDocs, dayPlans, guideBookings });
  } catch (err) { res.status(500).json({ message: 'Error fetching user details' }); }
});

// Edit user
app.patch('/api/admin/users/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, user: updated });
  } catch (err) { res.status(500).json({ message: 'Update failed' }); }
});

// Delete user + all their data
app.delete('/api/admin/users/:username', async (req, res) => {
  try {
    const u = req.params.username;
    await Promise.all([
      User.findOneAndDelete({ username: u }),
      FlightBookingModel.deleteMany({ username: u }),
      HotelBookingModel.deleteMany({ username: u }),
      Post.deleteMany({ user: u }),
      ActivityStats.deleteMany({ username: u }),
      Follow.deleteMany({ username: u }),
      VaultDoc.deleteMany({ username: u }),
      DayPlan.deleteMany({ username: u }),
      GuideBooking.deleteMany({ touristUsername: u }),
      EmergencyContact.deleteMany({ username: u }),
      TripCheckIn.deleteMany({ username: u }),
    ]);
    res.status(200).json({ success: true, message: 'User and all data deleted' });
  } catch (err) { res.status(500).json({ message: 'Delete failed' }); }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`); 
});

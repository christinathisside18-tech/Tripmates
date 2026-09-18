import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from './tripmates logo.jpeg';
import { useTheme } from './ThemeContext';

const Activities = ({ user }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const accent    = theme.accent;
  const navBg     = theme.navBg;
  const navText   = theme.navText;
  const pageBg    = theme.pageBg;
  const cardBg    = theme.cardBg;
  const secondary = theme.secondary;
  const muted     = theme.muted;
  const btnBg     = theme.btnBg;
  const btnText   = theme.btnText;

  const [view, setView] = useState('browse'); // 'browse' | 'planner'
  const [searchCity, setSearchCity] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [planDate, setPlanDate] = useState('');
  const [planName, setPlanName] = useState('My Day Plan');
  const [plannedActivities, setPlannedActivities] = useState([]);
  const [dragItem, setDragItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedPlans, setSavedPlans] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const dragOverItem = useRef(null);

  // ─── CITY DATABASE ────────────────────────────────────────────────
  const cityDatabase = {
    'Goa': {
      state: 'Goa',
      description: 'Sun, Sand & Serenity',
      bestFor: 'Beaches, Nightlife, Water Sports',
      activities: [
        { name: 'Baga Beach Morning Walk', category: 'Beach', duration: '2h', cost: 0, tip: 'Reach by 7am for sunrise views' },
        { name: 'Calangute Beach Water Sports', category: 'Adventure', duration: '3h', cost: 1500, tip: 'Parasailing and jet ski available' },
        { name: 'Anjuna Flea Market', category: 'Shopping', duration: '2h', cost: 1000, tip: 'Every Wednesday, bargain hard!' },
        { name: 'Old Goa Churches Tour', category: 'Culture', duration: '3h', cost: 300, tip: 'Basilica of Bom Jesus is a must' },
        { name: 'Dudhsagar Waterfalls Trek', category: 'Nature', duration: '8h', cost: 1200, tip: 'Best in monsoon season' },
        { name: 'Spice Plantation Tour', category: 'Nature', duration: '3h', cost: 800, tip: 'Lunch included in most tours' },
        { name: 'Sunset Cruise', category: 'Relaxation', duration: '2h', cost: 1200, tip: 'Book in advance during peak season' },
        { name: 'Goan Seafood Dinner', category: 'Food', duration: '2h', cost: 800, tip: 'Try fish curry rice at local shacks' },
        { name: 'Nightlife at Tito\'s Lane', category: 'Nightlife', duration: '3h', cost: 2000, tip: 'Starts after 10pm' },
        { name: 'Palolem Beach Kayaking', category: 'Adventure', duration: '2h', cost: 1000, tip: 'Calm waters, great for beginners' },
        { name: 'Fort Aguada Visit', category: 'History', duration: '2h', cost: 200, tip: 'Great views of Arabian Sea' },
        { name: 'Yoga & Meditation Session', category: 'Relaxation', duration: '2h', cost: 700, tip: 'Many beachside yoga classes available' },
        { name: 'Scuba Diving at Grande Island', category: 'Adventure', duration: '4h', cost: 3500, tip: 'Full day trip with equipment included' },
        { name: 'Casino Night', category: 'Nightlife', duration: '3h', cost: 2500, tip: 'Floating casinos on Mandovi river' },
      ]
    },
    'Mumbai': {
      state: 'Maharashtra',
      description: 'The City That Never Sleeps',
      bestFor: 'Heritage, Street Food, Bollywood',
      activities: [
        { name: 'Gateway of India', category: 'History', duration: '1h', cost: 100, tip: 'Take a ferry to Elephanta Caves' },
        { name: 'Elephanta Caves Ferry Tour', category: 'Culture', duration: '4h', cost: 500, tip: 'UNESCO World Heritage Site' },
        { name: 'Marine Drive Stroll', category: 'Relaxation', duration: '2h', cost: 0, tip: 'Called Queen\'s Necklace at night' },
        { name: 'Dharavi Slum Tour', category: 'Culture', duration: '2h', cost: 1200, tip: 'Eye-opening experience' },
        { name: 'Colaba Causeway Shopping', category: 'Shopping', duration: '3h', cost: 2000, tip: 'Antiques, clothes, street food' },
        { name: 'Bollywood Studio Tour', category: 'Culture', duration: '3h', cost: 1500, tip: 'Book Film City tour in advance' },
        { name: 'Juhu Beach Sunset', category: 'Beach', duration: '2h', cost: 300, tip: 'Try pav bhaji and bhel puri here' },
        { name: 'Street Food Tour - Mohammed Ali', category: 'Food', duration: '2h', cost: 600, tip: 'Nihari, biryani, kebabs' },
        { name: 'Siddhivinayak Temple', category: 'Culture', duration: '1h', cost: 200, tip: 'Tuesday mornings very crowded' },
        { name: 'Haji Ali Dargah', category: 'History', duration: '1h', cost: 100, tip: 'Visit during low tide only' },
        { name: 'Bandra-Worli Sea Link Drive', category: 'Relaxation', duration: '1h', cost: 500, tip: 'Best at night with city lights' },
        { name: 'CST Railway Station Visit', category: 'History', duration: '1h', cost: 0, tip: 'UNESCO Heritage, stunning Gothic architecture' },
        { name: 'Dhobi Ghat View', category: 'Culture', duration: '1h', cost: 0, tip: 'World\'s largest outdoor laundry' },
        { name: 'Tasting Mumbai Food Walk', category: 'Food', duration: '3h', cost: 1200, tip: 'Vada pav, misal pav, cutting chai' },
      ]
    },
    'Delhi': {
      state: 'Delhi',
      description: 'Where History Meets Modernity',
      bestFor: 'Monuments, Street Food, Shopping',
      activities: [
        { name: 'Red Fort & Chandni Chowk', category: 'History', duration: '3h', cost: 200, tip: 'Avoid Mondays, closed for visitors' },
        { name: 'Qutub Minar Complex', category: 'History', duration: '2h', cost: 150, tip: 'UNESCO World Heritage Site' },
        { name: 'India Gate & Rajpath', category: 'Culture', duration: '2h', cost: 0, tip: 'Best at sunset' },
        { name: 'Humayun\'s Tomb', category: 'History', duration: '2h', cost: 150, tip: 'Inspiration for Taj Mahal' },
        { name: 'Lotus Temple', category: 'Culture', duration: '1h', cost: 0, tip: 'Stunning Bahai architecture' },
        { name: 'Akshardham Temple', category: 'Culture', duration: '3h', cost: 0, tip: 'No cameras allowed inside' },
        { name: 'Paharganj Street Food Tour', category: 'Food', duration: '2h', cost: 500, tip: 'Try chole bhature and jalebi' },
        { name: 'Hauz Khas Village', category: 'Nightlife', duration: '3h', cost: 1500, tip: 'Art galleries, cafes, nightlife' },
        { name: 'Lodi Garden Walk', category: 'Nature', duration: '1h', cost: 0, tip: 'Beautiful morning joggers spot' },
        { name: 'Janpath & Connaught Place', category: 'Shopping', duration: '3h', cost: 2000, tip: 'Handicrafts, clothes, souvenirs' },
        { name: 'Jama Masjid', category: 'History', duration: '1h', cost: 300, tip: 'Largest mosque in India' },
        { name: 'Purana Qila & Zoo', category: 'History', duration: '3h', cost: 300, tip: 'Ancient fort with a zoo nearby' },
        { name: 'Dilli Haat', category: 'Shopping', duration: '2h', cost: 100, tip: 'Crafts from all states of India' },
        { name: 'Sarojini Nagar Market', category: 'Shopping', duration: '2h', cost: 500, tip: 'Best budget fashion market' },
      ]
    },
    'Jaipur': {
      state: 'Rajasthan',
      description: 'The Pink City of Rajasthan',
      bestFor: 'Palaces, Forts, Rajasthani Culture',
      activities: [
        { name: 'Amber Fort & Palace', category: 'History', duration: '3h', cost: 300, tip: 'Take elephant ride up the fort' },
        { name: 'Hawa Mahal', category: 'History', duration: '1h', cost: 100, tip: 'Best photos from outside at sunrise' },
        { name: 'City Palace Museum', category: 'Culture', duration: '2h', cost: 500, tip: 'Royal residence still in use' },
        { name: 'Jantar Mantar', category: 'History', duration: '1h', cost: 100, tip: 'UNESCO World Heritage Observatory' },
        { name: 'Johri Bazaar Gems Shopping', category: 'Shopping', duration: '3h', cost: 3000, tip: 'Famous for precious stones and jewelry' },
        { name: 'Nahargarh Fort Sunset', category: 'Nature', duration: '2h', cost: 100, tip: 'Best sunset view of Jaipur' },
        { name: 'Rajasthani Thali Dinner', category: 'Food', duration: '2h', cost: 600, tip: 'Try Choki Dhani for cultural experience' },
        { name: 'Camel Safari', category: 'Adventure', duration: '2h', cost: 800, tip: 'Available near Amber Fort area' },
        { name: 'Block Printing Workshop', category: 'Culture', duration: '2h', cost: 600, tip: 'Learn traditional Rajasthani craft' },
        { name: 'Jal Mahal View', category: 'Nature', duration: '1h', cost: 0, tip: 'Palace in middle of Man Sagar Lake' },
        { name: 'Hot Air Balloon Ride', category: 'Adventure', duration: '1h', cost: 8000, tip: 'Available October to March only' },
        { name: 'Bapu Bazaar Shopping', category: 'Shopping', duration: '2h', cost: 1000, tip: 'Textiles, mojaris, lac bangles' },
        { name: 'Albert Hall Museum', category: 'Culture', duration: '2h', cost: 150, tip: 'Indo-Saracenic architecture' },
      ]
    },
    'Manali': {
      state: 'Himachal Pradesh',
      description: 'Adventure in the Himalayas',
      bestFor: 'Snow, Trekking, Adventure Sports',
      activities: [
        { name: 'Rohtang Pass Snow Adventure', category: 'Adventure', duration: '8h', cost: 2000, tip: 'Permit required, book in advance' },
        { name: 'Solang Valley Activities', category: 'Adventure', duration: '4h', cost: 1500, tip: 'Skiing, zorbing, paragliding' },
        { name: 'Hadimba Temple Visit', category: 'Culture', duration: '1h', cost: 100, tip: '16th century wooden temple' },
        { name: 'Old Manali Cafes & Market', category: 'Food', duration: '2h', cost: 600, tip: 'Try apple wine and local trout fish' },
        { name: 'Beas River Rafting', category: 'Adventure', duration: '2h', cost: 1200, tip: 'Grade 3-4 rapids, thrilling!' },
        { name: 'Vashisht Hot Springs', category: 'Relaxation', duration: '2h', cost: 300, tip: 'Natural sulfur springs, very relaxing' },
        { name: 'Paragliding at Dobhi', category: 'Adventure', duration: '1h', cost: 2500, tip: 'Best views of Kullu valley' },
        { name: 'Naggar Castle Visit', category: 'History', duration: '2h', cost: 200, tip: 'Medieval castle turned hotel' },
        { name: 'Great Himalayan National Park', category: 'Nature', duration: '6h', cost: 1500, tip: 'UNESCO World Heritage Site' },
        { name: 'Mall Road Evening Walk', category: 'Shopping', duration: '2h', cost: 800, tip: 'Woolens, handicrafts, local food' },
        { name: 'Camping Under Stars', category: 'Adventure', duration: '12h', cost: 2500, tip: 'Clear skies, amazing stargazing' },
        { name: 'Apple Orchard Visit', category: 'Nature', duration: '2h', cost: 400, tip: 'Best in summer, pick fresh apples' },
        { name: 'Jogini Waterfall Trek', category: 'Nature', duration: '3h', cost: 0, tip: '3km trek from Vashisht village' },
      ]
    },
    'Ooty': {
      state: 'Tamil Nadu',
      description: 'The Queen of Hill Stations',
      bestFor: 'Tea Gardens, Nature, Toy Train',
      activities: [
        { name: 'Ooty Lake Boating', category: 'Relaxation', duration: '2h', cost: 300, tip: 'Pedal boats and row boats available' },
        { name: 'Botanical Gardens', category: 'Nature', duration: '2h', cost: 100, tip: 'Over 650 plant species' },
        { name: 'Nilgiri Mountain Railway', category: 'Adventure', duration: '3h', cost: 300, tip: 'UNESCO Heritage toy train, book early' },
        { name: 'Doddabetta Peak Trek', category: 'Nature', duration: '3h', cost: 200, tip: 'Highest peak in Nilgiris at 2637m' },
        { name: 'Tea Factory Tour', category: 'Culture', duration: '2h', cost: 200, tip: 'See how Nilgiri tea is processed' },
        { name: 'Rose Garden Visit', category: 'Nature', duration: '1h', cost: 80, tip: 'Best in May during Rose Festival' },
        { name: 'Mudumalai Wildlife Safari', category: 'Adventure', duration: '4h', cost: 1200, tip: 'Spot elephants, deer, leopards' },
        { name: 'Homemade Chocolate Shopping', category: 'Shopping', duration: '1h', cost: 500, tip: 'Ooty is famous for handmade chocolates' },
        { name: 'Avalanche Lake Picnic', category: 'Nature', duration: '6h', cost: 800, tip: 'Hidden gem, trout fishing allowed' },
        { name: 'Toda Tribal Village Visit', category: 'Culture', duration: '2h', cost: 200, tip: 'Learn about ancient Toda tribe' },
        { name: 'Sunset at Needle Rock', category: 'Nature', duration: '2h', cost: 100, tip: 'Breathtaking valley views' },
        { name: 'Emerald Lake Visit', category: 'Nature', duration: '3h', cost: 300, tip: 'Stunning mirror-like lake' },
      ]
    },
    'Agra': {
      state: 'Uttar Pradesh',
      description: 'Home of the Taj Mahal',
      bestFor: 'Mughal Heritage, Architecture',
      activities: [
        { name: 'Taj Mahal Sunrise Visit', category: 'History', duration: '3h', cost: 200, tip: 'Enter at 6am for golden sunrise glow' },
        { name: 'Agra Fort', category: 'History', duration: '2h', cost: 150, tip: 'UNESCO Site, see Taj from here' },
        { name: 'Fatehpur Sikri Day Trip', category: 'History', duration: '5h', cost: 400, tip: 'Abandoned Mughal city, spectacular' },
        { name: 'Mehtab Bagh Taj View', category: 'Nature', duration: '1h', cost: 100, tip: 'Best sunset view of Taj Mahal' },
        { name: 'Kinari Bazaar Shopping', category: 'Shopping', duration: '2h', cost: 1000, tip: 'Marble inlay work, leather goods' },
        { name: 'Mughal-era Food Tour', category: 'Food', duration: '2h', cost: 500, tip: 'Try petha, dalmoth, and mughlai food' },
        { name: 'Itmad-ud-Daula Tomb', category: 'History', duration: '1h', cost: 100, tip: 'Called Baby Taj, stunning marble work' },
        { name: 'Taj Nature Walk', category: 'Nature', duration: '2h', cost: 100, tip: 'Forest trail near Taj Mahal' },
        { name: 'Kalakriti Cultural Show', category: 'Culture', duration: '2h', cost: 800, tip: 'Mughal history show with dinner' },
        { name: 'Marble Inlay Workshop', category: 'Culture', duration: '2h', cost: 500, tip: 'Watch artisans create Taj replicas' },
        { name: 'Taj Museum', category: 'Culture', duration: '1h', cost: 0, tip: 'Inside Taj Mahal complex, free entry' },
      ]
    },
    'Rishikesh': {
      state: 'Uttarakhand',
      description: 'Yoga Capital of the World',
      bestFor: 'Yoga, Rafting, Spiritual Retreats',
      activities: [
        { name: 'Ganga Aarti at Triveni Ghat', category: 'Culture', duration: '1h', cost: 0, tip: 'Every evening at 6pm, unmissable' },
        { name: 'White Water Rafting', category: 'Adventure', duration: '3h', cost: 1200, tip: '16km stretch from Shivpuri to Rishikesh' },
        { name: 'Yoga & Meditation Class', category: 'Relaxation', duration: '2h', cost: 700, tip: 'Many ashrams offer free classes' },
        { name: 'Laxman Jhula & Ram Jhula', category: 'Culture', duration: '2h', cost: 0, tip: 'Iconic suspension bridges over Ganga' },
        { name: 'Bungee Jumping at Mohan Chatti', category: 'Adventure', duration: '2h', cost: 3500, tip: 'Highest bungee in India at 83m' },
        { name: 'Beatles Ashram Visit', category: 'History', duration: '2h', cost: 300, tip: 'Where Beatles stayed in 1968' },
        { name: 'Camping by Ganges', category: 'Adventure', duration: '12h', cost: 2000, tip: 'Bonfire and stargazing included' },
        { name: 'Neelkanth Mahadev Temple', category: 'Culture', duration: '3h', cost: 300, tip: '24km trek or jeep available' },
        { name: 'Ayurvedic Massage & Spa', category: 'Relaxation', duration: '2h', cost: 1200, tip: 'Many certified ayurvedic centers' },
        { name: 'Flying Fox Zip Line', category: 'Adventure', duration: '1h', cost: 1500, tip: 'Over the Ganges, thrilling!' },
        { name: 'Rajaji National Park Safari', category: 'Nature', duration: '4h', cost: 1000, tip: 'Spot elephants and tigers' },
        { name: 'Cafe Hopping in Tapovan', category: 'Food', duration: '2h', cost: 500, tip: 'Many Israeli and continental cafes' },
      ]
    },
    'Udaipur': {
      state: 'Rajasthan',
      description: 'City of Lakes & Palaces',
      bestFor: 'Lakes, Palaces, Romantic Getaway',
      activities: [
        { name: 'City Palace Complex', category: 'History', duration: '3h', cost: 600, tip: 'Largest palace complex in Rajasthan' },
        { name: 'Lake Pichola Boat Ride', category: 'Relaxation', duration: '1h', cost: 800, tip: 'View Jag Mandir & Lake Palace' },
        { name: 'Jag Mandir Island Visit', category: 'History', duration: '2h', cost: 800, tip: 'Island palace in Lake Pichola' },
        { name: 'Saheliyon Ki Bari', category: 'Nature', duration: '1h', cost: 50, tip: 'Garden of maids, fountains & lotus pool' },
        { name: 'Fateh Sagar Lake Sunset', category: 'Nature', duration: '2h', cost: 200, tip: 'Nehru Garden island in the middle' },
        { name: 'Monsoon Palace', category: 'History', duration: '2h', cost: 300, tip: 'Hilltop palace, 360 degree views' },
        { name: 'Vintage Car Museum', category: 'Culture', duration: '1h', cost: 400, tip: 'Royal vintage car collection' },
        { name: 'Rajasthani Puppet Show', category: 'Culture', duration: '1h', cost: 300, tip: 'Traditional Kathputli performance' },
        { name: 'Haldighati Battlefield Tour', category: 'History', duration: '5h', cost: 600, tip: 'Historic battle site of Maharana Pratap' },
        { name: 'Bagore Ki Haveli Museum', category: 'Culture', duration: '2h', cost: 150, tip: 'Evening show of Rajasthani folk dances' },
        { name: 'Shilpgram Craft Village', category: 'Shopping', duration: '2h', cost: 100, tip: 'Traditional crafts of Western India' },
      ]
    },
    'Coimbatore': {
      state: 'Tamil Nadu',
      description: 'Gateway to Nilgiris',
      bestFor: 'Yoga, Temples, Nature Trails',
      activities: [
        { name: 'Isha Yoga Center', category: 'Relaxation', duration: '3h', cost: 0, tip: 'Free entry, stunning Adiyogi statue' },
        { name: 'Marudamalai Temple', category: 'Culture', duration: '2h', cost: 100, tip: 'Hilltop Murugan temple, panoramic views' },
        { name: 'Siruvani Waterfall & Dam', category: 'Nature', duration: '4h', cost: 500, tip: 'Second tastiest water in world' },
        { name: 'Textile Market - Gandhipuram', category: 'Shopping', duration: '3h', cost: 2000, tip: 'Coimbatore is textile capital of India' },
        { name: 'Gass Forest Museum', category: 'Culture', duration: '2h', cost: 50, tip: 'Largest forest museum in Asia' },
        { name: 'Black Thunder Water Park', category: 'Adventure', duration: '6h', cost: 900, tip: 'Largest theme park in South India' },
        { name: 'Perur Pateeswarar Temple', category: 'Culture', duration: '1h', cost: 0, tip: '2000 year old ancient Shiva temple' },
        { name: 'Coimbatore Biryani Trail', category: 'Food', duration: '2h', cost: 400, tip: 'Famous for unique Coimbatore biryani style' },
        { name: 'Dhyanalinga Yoga Temple', category: 'Relaxation', duration: '2h', cost: 0, tip: 'Powerful meditation space' },
        { name: 'Velliangiri Mountains Trek', category: 'Adventure', duration: '8h', cost: 800, tip: 'Sacred hills, 7 hills trek to top' },
        { name: 'Ooty Day Trip', category: 'Nature', duration: '8h', cost: 1200, tip: 'Only 80km, easy day trip' },
      ]
    },
    'Varanasi': {
      state: 'Uttar Pradesh',
      description: 'The Spiritual Capital of India',
      bestFor: 'Ghats, Spirituality, Street Food',
      activities: [
        { name: 'Dashashwamedh Ghat Aarti', category: 'Culture', duration: '1h', cost: 0, tip: 'Attend evening Ganga aarti at 7pm' },
        { name: 'Boat Ride on Ganges at Sunrise', category: 'Relaxation', duration: '2h', cost: 500, tip: 'Book a boat the evening before' },
        { name: 'Kashi Vishwanath Temple', category: 'Culture', duration: '2h', cost: 0, tip: 'One of 12 Jyotirlingas, very sacred' },
        { name: 'Sarnath Buddhist Site', category: 'History', duration: '3h', cost: 200, tip: 'Where Buddha gave his first sermon' },
        { name: 'Banaras Street Food Walk', category: 'Food', duration: '2h', cost: 400, tip: 'Kachori sabzi, lassi, thandai' },
        { name: 'Manikarnika Ghat Visit', category: 'Culture', duration: '1h', cost: 0, tip: 'Sacred cremation ghat, be respectful' },
        { name: 'Silk Weaving Workshop', category: 'Culture', duration: '2h', cost: 300, tip: 'Banarasi silk is world famous' },
        { name: 'Ramnagar Fort', category: 'History', duration: '2h', cost: 100, tip: 'Maharaja\'s residence across the Ganges' },
        { name: 'Vishwanath Lane Shopping', category: 'Shopping', duration: '2h', cost: 1000, tip: 'Silk, rudraksha, brassware' },
        { name: 'Classical Music Concert', category: 'Culture', duration: '2h', cost: 500, tip: 'Varanasi is home to many classical musicians' },
        { name: 'Tulsi Manas Temple', category: 'Culture', duration: '1h', cost: 0, tip: 'Marble temple with Ramcharitmanas inscribed' },
      ]
    },
    'Kolkata': {
      state: 'West Bengal',
      description: 'City of Joy & Culture',
      bestFor: 'Art, Heritage, Street Food',
      activities: [
        { name: 'Victoria Memorial Visit', category: 'History', duration: '2h', cost: 200, tip: 'Beautiful marble monument, great museum inside' },
        { name: 'Howrah Bridge Walk', category: 'Culture', duration: '1h', cost: 0, tip: 'Iconic cantilever bridge over Hooghly' },
        { name: 'Dakshineswar Kali Temple', category: 'Culture', duration: '2h', cost: 0, tip: 'Famous Kali temple on Hooghly banks' },
        { name: 'Park Street Food Crawl', category: 'Food', duration: '2h', cost: 600, tip: 'Kathi rolls, mishti doi, rasgulla' },
        { name: 'College Street Book Market', category: 'Shopping', duration: '2h', cost: 500, tip: 'Largest secondhand book market in Asia' },
        { name: 'Indian Museum', category: 'Culture', duration: '3h', cost: 50, tip: 'Oldest & largest museum in India' },
        { name: 'Kumartuli Potter\'s Quarter', category: 'Culture', duration: '2h', cost: 0, tip: 'Watch artisans make Durga idols' },
        { name: 'Sundarbans Day Trip', category: 'Nature', duration: '8h', cost: 2500, tip: 'Home of Royal Bengal Tiger' },
        { name: 'Tram Ride', category: 'Culture', duration: '1h', cost: 10, tip: 'Only city in India with working trams' },
        { name: 'New Market Shopping', category: 'Shopping', duration: '2h', cost: 1500, tip: 'Everything under one roof since 1874' },
        { name: 'Kalighat Temple', category: 'Culture', duration: '1h', cost: 0, tip: 'One of the 51 Shakti Peethas' },
      ]
    },
    'Mysuru': {
      state: 'Karnataka',
      description: 'City of Palaces',
      bestFor: 'Palaces, Silk, Dasara Festival',
      activities: [
        { name: 'Mysore Palace Illumination', category: 'History', duration: '2h', cost: 200, tip: 'Palace is lit up on Sundays and holidays' },
        { name: 'Chamundi Hills Temple', category: 'Culture', duration: '2h', cost: 0, tip: 'Climb 1000 steps for blessings' },
        { name: 'Brindavan Gardens', category: 'Nature', duration: '2h', cost: 100, tip: 'Musical fountain at night is beautiful' },
        { name: 'Mysore Silk Factory', category: 'Culture', duration: '2h', cost: 0, tip: 'See how Mysore silk sarees are made' },
        { name: 'Devaraja Market', category: 'Shopping', duration: '2h', cost: 500, tip: 'Flowers, spices, sandalwood products' },
        { name: 'St. Philomena\'s Church', category: 'History', duration: '1h', cost: 0, tip: 'Second largest church in India' },
        { name: 'Zoo Visit', category: 'Nature', duration: '3h', cost: 200, tip: 'One of the best zoos in India' },
        { name: 'Somnathpur Temple', category: 'History', duration: '2h', cost: 100, tip: '13th century Hoysala temple, stunning carvings' },
        { name: 'Mysore Pak Tasting', category: 'Food', duration: '1h', cost: 300, tip: 'Original sweet from Mysore, try at Guru Sweet Mart' },
        { name: 'Sand Sculpture Museum', category: 'Culture', duration: '1h', cost: 150, tip: 'Unique sand art museum' },
      ]
    },
    'Shimla': {
      state: 'Himachal Pradesh',
      description: 'Queen of Hill Stations',
      bestFor: 'Snow, Colonial Heritage, Trekking',
      activities: [
        { name: 'The Ridge & Mall Road Walk', category: 'Relaxation', duration: '2h', cost: 0, tip: 'Heart of Shimla, great views' },
        { name: 'Jakhu Temple & Monkey Hill', category: 'Culture', duration: '2h', cost: 100, tip: 'Highest point in Shimla, 8km trek' },
        { name: 'Toy Train to Kalka', category: 'Adventure', duration: '5h', cost: 400, tip: 'UNESCO Heritage narrow gauge railway' },
        { name: 'Kufri Snow Activities', category: 'Adventure', duration: '4h', cost: 1500, tip: 'Skiing and snowboarding in winter' },
        { name: 'Christ Church Visit', category: 'History', duration: '1h', cost: 0, tip: 'Second oldest church in North India' },
        { name: 'Viceregal Lodge', category: 'History', duration: '2h', cost: 100, tip: 'Former British summer capital residence' },
        { name: 'Chadwick Waterfall', category: 'Nature', duration: '3h', cost: 0, tip: '67m waterfall, beautiful in monsoon' },
        { name: 'Lakkar Bazaar Shopping', category: 'Shopping', duration: '2h', cost: 1000, tip: 'Wooden crafts and souvenirs' },
        { name: 'Indira Gandhi Medical College Museum', category: 'Culture', duration: '1h', cost: 50, tip: 'Historical medical museum' },
        { name: 'Ice Skating Rink', category: 'Adventure', duration: '2h', cost: 300, tip: 'Only natural ice skating rink in India' },
      ]
    },
    'Pune': {
      state: 'Maharashtra',
      description: 'Oxford of the East',
      bestFor: 'Forts, Cafes, History',
      activities: [
        { name: 'Shaniwar Wada Fort', category: 'History', duration: '2h', cost: 50, tip: 'Peshwa palace with ghost stories at night show' },
        { name: 'Aga Khan Palace', category: 'History', duration: '2h', cost: 100, tip: 'Where Gandhi was imprisoned by British' },
        { name: 'Sinhagad Fort Trek', category: 'Adventure', duration: '4h', cost: 100, tip: 'Historic fort with panoramic views' },
        { name: 'Osho Ashram', category: 'Relaxation', duration: '3h', cost: 1500, tip: 'World famous meditation center' },
        { name: 'FC Road Cafe Hopping', category: 'Food', duration: '2h', cost: 600, tip: 'Best cafes and street food in Pune' },
        { name: 'Dagdusheth Halwai Temple', category: 'Culture', duration: '1h', cost: 0, tip: 'Famous Ganesh temple in the city' },
        { name: 'Pataleshwar Cave Temple', category: 'History', duration: '1h', cost: 0, tip: '8th century rock-cut cave temple' },
        { name: 'Lonavala Day Trip', category: 'Nature', duration: '8h', cost: 1000, tip: 'Waterfalls and scenic viewpoints' },
        { name: 'Koregaon Park Shopping', category: 'Shopping', duration: '2h', cost: 2000, tip: 'Trendy shops and boutiques' },
        { name: 'Raja Kelkar Museum', category: 'Culture', duration: '2h', cost: 100, tip: 'Rare collection of Indian artifacts' },
      ]
    },
    'Hyderabad': {
      state: 'Telangana',
      description: 'City of Nizams & Biryani',
      bestFor: 'Biryani, Pearls, Charminar',
      activities: [
        { name: 'Charminar Visit', category: 'History', duration: '2h', cost: 100, tip: 'Best visited in the evening with lights' },
        { name: 'Golconda Fort', category: 'History', duration: '3h', cost: 200, tip: 'Amazing sound and light show at night' },
        { name: 'Biryani Trail at Old City', category: 'Food', duration: '2h', cost: 500, tip: 'Try Shadab or Paradise for authentic biryani' },
        { name: 'Laad Bazaar Pearl Shopping', category: 'Shopping', duration: '2h', cost: 2000, tip: 'Famous for pearls and bangles' },
        { name: 'Hussain Sagar Lake Boat Ride', category: 'Relaxation', duration: '2h', cost: 300, tip: 'Visit Buddha statue in the middle' },
        { name: 'Salar Jung Museum', category: 'Culture', duration: '3h', cost: 100, tip: 'One of the largest museums in India' },
        { name: 'Ramoji Film City', category: 'Culture', duration: '6h', cost: 1200, tip: 'Worlds largest film studio complex' },
        { name: 'Chowmahalla Palace', category: 'History', duration: '2h', cost: 100, tip: 'Nizam\'s official residence' },
        { name: 'Irani Chai at Nimrah Cafe', category: 'Food', duration: '1h', cost: 100, tip: 'Iconic Irani chai with Osmania biscuits' },
        { name: 'Snow World', category: 'Adventure', duration: '3h', cost: 800, tip: 'Indoor snow theme park' },
      ]
    },
  };

  const categories = ['All', 'Adventure', 'Beach', 'Culture', 'Food', 'History', 'Nature', 'Nightlife', 'Relaxation', 'Shopping'];

  const categoryColors = {
    'Adventure': '#e17055', 'Beach': '#0984e3', 'Culture': '#6c5ce7',
    'Food': '#fd7900', 'History': '#c9a84c', 'Nature': '#00b894',
    'Nightlife': '#e84393', 'Relaxation': '#00cec9', 'Shopping': '#a29bfe', 'All': accent
  };

  const filteredCities = Object.entries(cityDatabase).filter(([city, data]) =>
    city.toLowerCase().includes(searchCity.toLowerCase()) ||
    data.state.toLowerCase().includes(searchCity.toLowerCase())
  );

  const getFilteredActivities = () => {
    if (!selectedCity) return [];
    const acts = cityDatabase[selectedCity]?.activities || [];
    if (selectedCategory === 'All') return acts;
    return acts.filter(a => a.category === selectedCategory);
  };

  const addToPlan = (activity) => {
    const already = plannedActivities.find(a => a.activityName === activity.name);
    if (already) return;
    setPlannedActivities(prev => [...prev, {
      activityName: activity.name,
      category: activity.category,
      time: '',
      duration: activity.duration,
      cost: activity.cost,
      notes: '',
      completed: false
    }]);
  };

  const removeFromPlan = (index) => {
    setPlannedActivities(prev => prev.filter((_, i) => i !== index));
  };

  const updatePlanActivity = (index, field, value) => {
    setPlannedActivities(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a));
  };

  const totalPlanCost = plannedActivities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);

  // Drag and drop
  const handleDragStart = (index) => setDragItem(index);
  const handleDragEnter = (index) => { dragOverItem.current = index; };
  const handleDragEnd = () => {
    if (dragItem === null || dragOverItem.current === null) return;
    const updated = [...plannedActivities];
    const dragged = updated.splice(dragItem, 1)[0];
    updated.splice(dragOverItem.current, 0, dragged);
    setPlannedActivities(updated);
    setDragItem(null);
    dragOverItem.current = null;
  };

  const savePlan = async () => {
    if (!user?.username) return alert('Please login first');
    if (!selectedCity) return alert('Please select a city first');
    if (!planDate) return alert('Please select a date');
    if (plannedActivities.length === 0) return alert('Add at least one activity');
    setSaving(true);
    try {
      await axios.post('http://localhost:5001/api/dayplan', {
        username: user.username,
        city: selectedCity,
        state: cityDatabase[selectedCity]?.state || '',
        planDate,
        planName,
        activities: plannedActivities,
        totalCost: totalPlanCost
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Save failed, please try again');
    }
    setSaving(false);
  };

  const loadSavedPlans = async () => {
    if (!user?.username) return;
    try {
      const res = await axios.get(`http://localhost:5001/api/dayplan/${user.username}`);
      setSavedPlans(res.data);
      setShowSaved(true);
    } catch (err) {
      alert('Could not load saved plans');
    }
  };

  const deletePlan = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/dayplan/${id}`);
      setSavedPlans(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const inputStyle = {
    padding: '10px 14px', border: `1.5px solid ${theme.cardBorder}`,
    borderRadius: '10px', fontSize: '13px', outline: 'none',
    fontFamily: 'Poppins, sans-serif', color: secondary,
    background: cardBg, width: '100%', boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: '700', color: muted,
    letterSpacing: '1px', marginBottom: '6px', display: 'block'
  };

  return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        .act-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.12) !important; }
        .act-card { transition: all 0.2s; }
        .city-chip:hover { opacity: 0.85; transform: translateY(-1px); }
        .city-chip { transition: all 0.2s; }
        .add-btn:hover { opacity: 0.8; }
        .tab-btn:hover { opacity: 0.85; }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .city-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', background: navBg, borderBottom: `3px solid ${accent}`, position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/feed')}>
          <img src={logoImg} alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
          <h2 style={{ color: navText, margin: 0, fontSize: '18px', fontWeight: '800' }}>TripMates</h2>
        </div>
        <div style={{ fontWeight: '700', fontSize: '15px', color: navText }}>Activities & Day Planner</div>
        <button onClick={() => navigate('/feed')} style={{ background: 'none', border: `2px solid ${navText}`, color: navText, padding: '7px 18px', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>Back to Feed</button>
      </nav>

      {/* Hero */}
      <div style={{ background: theme.coverBg, padding: '40px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '900', color: 'white' }}>
          Explore <span style={{ color: accent }}>Activities</span> & Plan Your Day
        </h1>
        <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
          Browse activities by city, filter by category, and build your perfect day
        </p>

        {/* Tab Toggle */}
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.15)', borderRadius: '30px', padding: '4px', gap: '4px' }}>
          {['browse', 'planner'].map(t => (
            <button key={t} className="tab-btn" onClick={() => setView(t)} style={{
              padding: '8px 24px', borderRadius: '26px', border: 'none', cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '13px',
              background: view === t ? 'white' : 'transparent',
              color: view === t ? accent : 'white', transition: 'all 0.2s'
            }}>
              {t === 'browse' ? 'Browse Activities' : `Day Planner ${plannedActivities.length > 0 ? `(${plannedActivities.length})` : ''}`}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px', boxSizing: 'border-box' }}>

        {/* ── BROWSE VIEW ── */}
        {view === 'browse' && (
          <div>
            {/* Search */}
            <div style={{ background: cardBg, borderRadius: '20px', padding: '24px', marginBottom: '24px', border: `1px solid ${theme.cardBorder}`, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <label style={labelStyle}>SEARCH BY CITY OR STATE</label>
              <input
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
                placeholder="e.g. Goa, Rajasthan, Mumbai, Tamil Nadu..."
                style={{ ...inputStyle, fontSize: '14px', padding: '12px 16px' }}
              />
            </div>

            {/* City Grid */}
            {!selectedCity && (
              <div>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '800', color: muted, letterSpacing: '1px' }}>
                  SELECT A CITY — {filteredCities.length} CITIES
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }} className="city-grid">
                  {filteredCities.map(([city, data]) => (
                    <div key={city} className="city-chip" onClick={() => { setSelectedCity(city); setSelectedCategory('All'); }} style={{
                      background: cardBg, borderRadius: '16px', padding: '18px 16px',
                      border: `1px solid ${theme.cardBorder}`, cursor: 'pointer',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: secondary, marginBottom: '4px' }}>{city}</div>
                      <div style={{ fontSize: '11px', color: accent, fontWeight: '600', marginBottom: '6px' }}>{data.state}</div>
                      <div style={{ fontSize: '11px', color: muted }}>{data.bestFor}</div>
                      <div style={{ marginTop: '10px', fontSize: '11px', fontWeight: '700', color: muted }}>
                        {data.activities.length} activities
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected City Activities */}
            {selectedCity && (
              <div>
                {/* City Header */}
                <div style={{ background: cardBg, borderRadius: '20px', padding: '20px 24px', marginBottom: '20px', border: `1px solid ${theme.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: secondary }}>{selectedCity}</h2>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: accent, background: `${accent}15`, padding: '3px 10px', borderRadius: '20px' }}>
                        {cityDatabase[selectedCity].state}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: muted }}>{cityDatabase[selectedCity].description}</p>
                  </div>
                  <button onClick={() => setSelectedCity(null)} style={{
                    background: 'none', border: `1.5px solid ${theme.cardBorder}`, color: muted,
                    padding: '8px 18px', borderRadius: '20px', fontWeight: '700', cursor: 'pointer',
                    fontSize: '12px', fontFamily: 'Poppins, sans-serif'
                  }}>Change City</button>
                </div>

                {/* Category Filter */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                      padding: '6px 16px', borderRadius: '20px', border: `1.5px solid ${selectedCategory === cat ? categoryColors[cat] : theme.cardBorder}`,
                      background: selectedCategory === cat ? `${categoryColors[cat]}15` : cardBg,
                      color: selectedCategory === cat ? categoryColors[cat] : muted,
                      fontWeight: '700', fontSize: '12px', cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s'
                    }}>{cat}</button>
                  ))}
                </div>

                {/* Activities List */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="main-grid">
                  {getFilteredActivities().map((act, i) => {
                    const isAdded = plannedActivities.some(a => a.activityName === act.name);
                    const catColor = categoryColors[act.category] || accent;
                    return (
                      <div key={i} className="act-card" style={{
                        background: cardBg, borderRadius: '16px', padding: '18px 20px',
                        border: `1px solid ${theme.cardBorder}`, borderLeft: `4px solid ${catColor}`,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: '800', fontSize: '14px', color: secondary }}>{act.name}</span>
                              <span style={{ fontSize: '10px', fontWeight: '700', color: catColor, background: `${catColor}15`, padding: '2px 8px', borderRadius: '10px' }}>
                                {act.category}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '12px', color: muted, fontWeight: '600' }}>{act.duration}</span>
                              <span style={{ fontSize: '12px', fontWeight: '700', color: act.cost === 0 ? '#00b894' : secondary }}>
                                {act.cost === 0 ? 'FREE' : `Rs. ${act.cost.toLocaleString()}`}
                              </span>
                            </div>
                            <div style={{ fontSize: '11px', color: muted }}>
                              <span style={{ color: accent, fontWeight: '600' }}>Tip: </span>{act.tip}
                            </div>
                          </div>
                          <button className="add-btn" onClick={() => addToPlan(act)} disabled={isAdded} style={{
                            background: isAdded ? '#00b894' : btnBg,
                            color: isAdded ? 'white' : btnText,
                            border: 'none', padding: '7px 14px', borderRadius: '10px',
                            fontWeight: '700', fontSize: '12px', cursor: isAdded ? 'default' : 'pointer',
                            fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap', flexShrink: 0
                          }}>
                            {isAdded ? 'Added' : '+ Plan'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {getFilteredActivities().length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: muted, fontSize: '14px', fontWeight: '600' }}>
                    No activities found for this category
                  </div>
                )}

                {/* Float button to go to planner */}
                {plannedActivities.length > 0 && (
                  <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 999 }}>
                    <button onClick={() => setView('planner')} style={{
                      background: btnBg, color: btnText, border: 'none',
                      padding: '14px 24px', borderRadius: '30px', fontWeight: '800',
                      fontSize: '14px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                      boxShadow: `0 8px 25px ${accent}55`
                    }}>
                      View Day Plan ({plannedActivities.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── DAY PLANNER VIEW ── */}
        {view === 'planner' && (
          <div>
            {/* Plan Details */}
            <div style={{ background: cardBg, borderRadius: '20px', padding: '24px', marginBottom: '24px', border: `1px solid ${theme.cardBorder}`, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '800', color: secondary, letterSpacing: '1px' }}>PLAN DETAILS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }} className="main-grid">
                <div>
                  <label style={labelStyle}>PLAN NAME</label>
                  <input value={planName} onChange={e => setPlanName(e.target.value)} placeholder="My Day Plan" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>CITY</label>
                  <input value={selectedCity || ''} readOnly placeholder="Select city from Browse tab" style={{ ...inputStyle, opacity: 0.7 }} />
                </div>
                <div>
                  <label style={labelStyle}>DATE</label>
                  <input type="date" value={planDate} onChange={e => setPlanDate(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Budget Summary */}
            {plannedActivities.length > 0 && (
              <div style={{ background: `${accent}10`, borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', border: `1px solid ${accent}33`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: secondary }}>
                  {plannedActivities.length} activities planned
                </div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: accent }}>
                  Total: Rs. {totalPlanCost.toLocaleString()}
                </div>
              </div>
            )}

            {/* Activities in Planner */}
            {plannedActivities.length === 0 ? (
              <div style={{ background: cardBg, borderRadius: '20px', padding: '60px 40px', textAlign: 'center', border: `1px solid ${theme.cardBorder}` }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗓️</div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: secondary, marginBottom: '8px' }}>No activities added yet</div>
                <div style={{ fontSize: '13px', color: muted, marginBottom: '20px' }}>Go to Browse tab, select a city and add activities to your plan</div>
                <button onClick={() => setView('browse')} style={{
                  background: btnBg, color: btnText, border: 'none',
                  padding: '12px 28px', borderRadius: '30px', fontWeight: '700',
                  cursor: 'pointer', fontSize: '14px', fontFamily: 'Poppins, sans-serif'
                }}>Browse Activities</button>
              </div>
            ) : (
              <div>
                <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '800', color: muted, letterSpacing: '1px' }}>
                  YOUR ACTIVITIES — drag to reorder
                </h3>
                {plannedActivities.map((act, i) => {
                  const catColor = categoryColors[act.category] || accent;
                  return (
                    <div
                      key={i}
                      draggable
                      onDragStart={() => handleDragStart(i)}
                      onDragEnter={() => handleDragEnter(i)}
                      onDragEnd={handleDragEnd}
                      onDragOver={e => e.preventDefault()}
                      style={{
                        background: cardBg, borderRadius: '16px', padding: '16px 20px',
                        marginBottom: '12px', border: `1px solid ${theme.cardBorder}`,
                        borderLeft: `4px solid ${catColor}`,
                        boxShadow: dragItem === i ? `0 8px 25px ${accent}33` : '0 2px 10px rgba(0,0,0,0.04)',
                        opacity: dragItem === i ? 0.7 : 1,
                        cursor: 'grab', transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                            <span style={{ color: muted, fontSize: '16px', cursor: 'grab' }}>&#9776;</span>
                            <span style={{ fontWeight: '800', fontSize: '14px', color: secondary }}>{act.activityName}</span>
                            <span style={{ fontSize: '10px', fontWeight: '700', color: catColor, background: `${catColor}15`, padding: '2px 8px', borderRadius: '10px' }}>
                              {act.category}
                            </span>
                            <span style={{ fontSize: '11px', color: muted }}>{act.duration}</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                            <div>
                              <label style={{ ...labelStyle, marginBottom: '4px' }}>TIME</label>
                              <input
                                value={act.time}
                                onChange={e => updatePlanActivity(i, 'time', e.target.value)}
                                placeholder="e.g. 9:00 AM"
                                style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }}
                              />
                            </div>
                            <div>
                              <label style={{ ...labelStyle, marginBottom: '4px' }}>COST (Rs.)</label>
                              <input
                                type="number"
                                value={act.cost}
                                onChange={e => updatePlanActivity(i, 'cost', e.target.value)}
                                style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }}
                              />
                            </div>
                            <div>
                              <label style={{ ...labelStyle, marginBottom: '4px' }}>NOTES</label>
                              <input
                                value={act.notes}
                                onChange={e => updatePlanActivity(i, 'notes', e.target.value)}
                                placeholder="Any notes..."
                                style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }}
                              />
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeFromPlan(i)} style={{
                          background: '#ff7675', color: 'white', border: 'none',
                          padding: '6px 14px', borderRadius: '10px', fontWeight: '700',
                          cursor: 'pointer', fontSize: '12px', fontFamily: 'Poppins, sans-serif', flexShrink: 0
                        }}>Remove</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Save & Load buttons */}
            {plannedActivities.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <button onClick={savePlan} disabled={saving} style={{
                  background: btnBg, color: btnText, border: 'none',
                  padding: '14px 32px', borderRadius: '14px', fontWeight: '800',
                  fontSize: '15px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                  boxShadow: `0 6px 20px ${accent}44`, opacity: saving ? 0.7 : 1, flex: 1
                }}>
                  {saving ? 'Saving...' : 'Save Day Plan'}
                </button>
                <button onClick={loadSavedPlans} style={{
                  background: cardBg, color: secondary, border: `1.5px solid ${theme.cardBorder}`,
                  padding: '14px 24px', borderRadius: '14px', fontWeight: '700',
                  fontSize: '14px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
                }}>My Saved Plans</button>
              </div>
            )}

            {saveSuccess && (
              <div style={{ marginTop: '14px', background: '#00b89415', border: '1px solid #00b89444', borderRadius: '12px', padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '700', color: '#00b894' }}>
                Day plan saved successfully!
              </div>
            )}

            {/* Saved Plans Modal */}
            {showSaved && (
              <div style={{ marginTop: '24px', background: cardBg, borderRadius: '20px', padding: '24px', border: `1px solid ${theme.cardBorder}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: secondary }}>My Saved Plans</h3>
                  <button onClick={() => setShowSaved(false)} style={{ background: 'none', border: 'none', color: muted, fontSize: '18px', cursor: 'pointer' }}>x</button>
                </div>
                {savedPlans.length === 0 ? (
                  <div style={{ textAlign: 'center', color: muted, padding: '20px', fontSize: '13px' }}>No saved plans yet</div>
                ) : (
                  savedPlans.map(plan => (
                    <div key={plan._id} style={{ background: pageBg, borderRadius: '14px', padding: '16px', marginBottom: '10px', border: `1px solid ${theme.cardBorder}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '14px', color: secondary }}>{plan.planName}</div>
                          <div style={{ fontSize: '12px', color: muted, marginTop: '3px' }}>
                            {plan.city}, {plan.state} — {plan.planDate} — {plan.activities.length} activities — Rs. {plan.totalCost?.toLocaleString()}
                          </div>
                        </div>
                        <button onClick={() => deletePlan(plan._id)} style={{
                          background: '#ff7675', color: 'white', border: 'none',
                          padding: '6px 14px', borderRadius: '8px', fontWeight: '700',
                          cursor: 'pointer', fontSize: '12px', fontFamily: 'Poppins, sans-serif'
                        }}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Load saved plans button when no activities */}
            {plannedActivities.length === 0 && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={loadSavedPlans} style={{
                  background: cardBg, color: secondary, border: `1.5px solid ${theme.cardBorder}`,
                  padding: '12px 24px', borderRadius: '14px', fontWeight: '700',
                  fontSize: '14px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
                }}>View My Saved Plans</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
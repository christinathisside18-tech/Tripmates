import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from './tripmates logo.jpeg';
import { useTheme } from './ThemeContext';

const SmartItinerary = ({ user }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();


  const accent   = theme.accent;
  const navBg    = theme.navBg;
  const navText  = theme.navText;
  const pageBg   = theme.pageBg;
  const cardBg   = theme.cardBg;
  const secondary = theme.secondary;
  const muted    = theme.muted;
  const btnBg    = theme.btnBg;
  const btnText  = theme.btnText;

  const [view, setView] = useState('form'); // 'form' | 'result'
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('Mid-range');
  const [interests, setInterests] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [activeDay, setActiveDay] = useState(0);

  const interestOptions = ['Adventure', 'Culture', 'Food', 'Relaxation', 'Shopping', 'Nature', 'Nightlife', 'History'];

  const toggleInterest = (i) => {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const getDays = () => {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate) - new Date(startDate);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  // ─── ITINERARY DATABASE ───────────────────────────────────────────
  const cityData = {
    'Goa': {
      tagline: 'Sun, Sand & Serenity',
      bestTime: 'October – March',
      weather: 'Sunny & Humid (28–35°C)',
      activities: [
        { name: 'Baga Beach Morning Walk',        type: 'beach',   time: 'Morning',   duration: '2h',  budget: 0,    mid: 200,   luxury: 1500, tip: 'Reach by 7am for sunrise views' },
        { name: 'Calangute Beach Water Sports',   type: 'adventure',time:'Morning',   duration: '3h',  budget: 800,  mid: 1500,  luxury: 3000, tip: 'Parasailing and jet ski available' },
        { name: 'Anjuna Flea Market',             type: 'shopping', time: 'Afternoon', duration: '2h',  budget: 500,  mid: 1500,  luxury: 5000, tip: 'Every Wednesday, bargain hard!' },
        { name: 'Old Goa Churches Tour',          type: 'culture',  time: 'Morning',   duration: '3h',  budget: 50,   mid: 300,   luxury: 800,  tip: 'Basilica of Bom Jesus is a must' },
        { name: 'Dudhsagar Waterfalls Trek',      type: 'nature',   time: 'Full Day',  duration: '8h',  budget: 600,  mid: 1200,  luxury: 3000, tip: 'Best in monsoon season' },
        { name: 'Spice Plantation Tour',          type: 'nature',   time: 'Morning',   duration: '3h',  budget: 400,  mid: 800,   luxury: 1500, tip: 'Lunch included in most tours' },
        { name: 'Sunset Cruise',                  type: 'relaxation',time:'Evening',  duration: '2h',  budget: 500,  mid: 1200,  luxury: 4000, tip: 'Book in advance during peak season' },
        { name: 'Goan Seafood Dinner',            type: 'food',     time: 'Evening',   duration: '2h',  budget: 300,  mid: 800,   luxury: 3000, tip: 'Try fish curry rice at local shacks' },
        { name: 'Nightlife at Tito\'s Lane',      type: 'nightlife',time:'Night',     duration: '3h',  budget: 500,  mid: 2000,  luxury: 5000, tip: 'Starts after 10pm' },
        { name: 'Palolem Beach Kayaking',         type: 'adventure',time:'Morning',   duration: '2h',  budget: 600,  mid: 1000,  luxury: 2500, tip: 'Calm waters, great for beginners' },
        { name: 'Fort Aguada Visit',              type: 'history',  time: 'Afternoon', duration: '2h',  budget: 50,   mid: 200,   luxury: 500,  tip: 'Great views of Arabian Sea' },
        { name: 'Yoga & Meditation Session',      type: 'relaxation',time:'Morning',  duration: '2h',  budget: 300,  mid: 700,   luxury: 2000, tip: 'Many beachside yoga classes available' },
      ],
      hotelCost: { 'Budget': 1200, 'Mid-range': 3500, 'Luxury': 12000 },
      foodCost:  { 'Budget': 400,  'Mid-range': 1000, 'Luxury': 3000  },
      transportCost: { 'Budget': 200, 'Mid-range': 600, 'Luxury': 2000 },
    },
    'Mumbai': {
      tagline: 'The City That Never Sleeps',
      bestTime: 'November – February',
      weather: 'Warm & Coastal (28–32°C)',
      activities: [
        { name: 'Gateway of India',               type: 'history',  time: 'Morning',   duration: '1h',  budget: 0,    mid: 100,   luxury: 500,  tip: 'Take a ferry to Elephanta Caves' },
        { name: 'Elephanta Caves Ferry Tour',     type: 'culture',  time: 'Morning',   duration: '4h',  budget: 200,  mid: 500,   luxury: 1500, tip: 'UNESCO World Heritage Site' },
        { name: 'Marine Drive Stroll',            type: 'relaxation',time:'Evening',  duration: '2h',  budget: 0,    mid: 0,     luxury: 0,    tip: 'Called Queen\'s Necklace at night' },
        { name: 'Dharavi Slum Tour',              type: 'culture',  time: 'Morning',   duration: '2h',  budget: 700,  mid: 1200,  luxury: 2500, tip: 'Eye-opening experience' },
        { name: 'Colaba Causeway Shopping',       type: 'shopping', time: 'Afternoon', duration: '3h',  budget: 500,  mid: 2000,  luxury: 8000, tip: 'Antiques, clothes, street food' },
        { name: 'Bollywood Studio Tour',          type: 'culture',  time: 'Morning',   duration: '3h',  budget: 500,  mid: 1500,  luxury: 5000, tip: 'Book Film City tour in advance' },
        { name: 'Juhu Beach Sunset',              type: 'beach',    time: 'Evening',   duration: '2h',  budget: 100,  mid: 300,   luxury: 1000, tip: 'Try pav bhaji and bhel puri here' },
        { name: 'Street Food Tour - Mohammed Ali',type: 'food',     time: 'Evening',   duration: '2h',  budget: 300,  mid: 600,   luxury: 1500, tip: 'Nihari, biryani, kebabs' },
        { name: 'Siddhivinayak Temple',           type: 'culture',  time: 'Morning',   duration: '1h',  budget: 100,  mid: 200,   luxury: 500,  tip: 'Tuesday mornings very crowded' },
        { name: 'Haji Ali Dargah',                type: 'history',  time: 'Afternoon', duration: '1h',  budget: 50,   mid: 100,   luxury: 300,  tip: 'Visit during low tide only' },
        { name: 'Bandra-Worli Sea Link Drive',    type: 'relaxation',time:'Evening',  duration: '1h',  budget: 75,   mid: 500,   luxury: 2000, tip: 'Best at night with city lights' },
        { name: 'CST Railway Station Visit',      type: 'history',  time: 'Morning',   duration: '1h',  budget: 0,    mid: 0,     luxury: 500,  tip: 'UNESCO Heritage, stunning Gothic architecture' },
      ],
      hotelCost: { 'Budget': 1500, 'Mid-range': 5000, 'Luxury': 18000 },
      foodCost:  { 'Budget': 400,  'Mid-range': 1200, 'Luxury': 4000  },
      transportCost: { 'Budget': 150, 'Mid-range': 800, 'Luxury': 3000 },
    },
    'Delhi': {
      tagline: 'Where History Meets Modernity',
      bestTime: 'October – March',
      weather: 'Cool & Pleasant (15–25°C)',
      activities: [
        { name: 'Red Fort & Chandni Chowk',       type: 'history',  time: 'Morning',   duration: '3h',  budget: 35,   mid: 200,   luxury: 800,  tip: 'Avoid Mondays, closed for visitors' },
        { name: 'Qutub Minar Complex',            type: 'history',  time: 'Morning',   duration: '2h',  budget: 30,   mid: 150,   luxury: 600,  tip: 'UNESCO World Heritage Site' },
        { name: 'India Gate & Rajpath',           type: 'culture',  time: 'Evening',   duration: '2h',  budget: 0,    mid: 0,     luxury: 500,  tip: 'Best at sunset' },
        { name: 'Humayun\'s Tomb',               type: 'history',  time: 'Morning',   duration: '2h',  budget: 30,   mid: 150,   luxury: 600,  tip: 'Inspiration for Taj Mahal' },
        { name: 'Lotus Temple',                   type: 'culture',  time: 'Afternoon', duration: '1h',  budget: 0,    mid: 0,     luxury: 300,  tip: 'Stunning Bahai architecture' },
        { name: 'Akshardham Temple',              type: 'culture',  time: 'Afternoon', duration: '3h',  budget: 0,    mid: 0,     luxury: 0,    tip: 'No cameras allowed inside' },
        { name: 'Paharganj Street Food Tour',     type: 'food',     time: 'Evening',   duration: '2h',  budget: 200,  mid: 500,   luxury: 1500, tip: 'Try chole bhature and jalebi' },
        { name: 'Hauz Khas Village',              type: 'nightlife',time:'Evening',   duration: '3h',  budget: 500,  mid: 1500,  luxury: 5000, tip: 'Art galleries, cafes, nightlife' },
        { name: 'Lodi Garden Walk',               type: 'nature',   time: 'Morning',   duration: '1h',  budget: 0,    mid: 0,     luxury: 0,    tip: 'Beautiful morning joggers\' spot' },
        { name: 'Janpath & Connaught Place',      type: 'shopping', time: 'Afternoon', duration: '3h',  budget: 500,  mid: 2000,  luxury: 8000, tip: 'Handicrafts, clothes, souvenirs' },
        { name: 'Jama Masjid',                    type: 'history',  time: 'Morning',   duration: '1h',  budget: 300,  mid: 300,   luxury: 300,  tip: 'Largest mosque in India' },
        { name: 'Delhi Metro Experience',         type: 'culture',  time: 'Any',       duration: '1h',  budget: 50,   mid: 50,    luxury: 50,   tip: 'Best way to explore the city' },
      ],
      hotelCost: { 'Budget': 1000, 'Mid-range': 4000, 'Luxury': 15000 },
      foodCost:  { 'Budget': 300,  'Mid-range': 900,  'Luxury': 3500  },
      transportCost: { 'Budget': 100, 'Mid-range': 600, 'Luxury': 2500 },
    },
    'Jaipur': {
      tagline: 'The Pink City of Rajasthan',
      bestTime: 'October – March',
      weather: 'Cool & Dry (12–25°C)',
      activities: [
        { name: 'Amber Fort & Palace',            type: 'history',  time: 'Morning',   duration: '3h',  budget: 100,  mid: 300,   luxury: 1500, tip: 'Take elephant ride up the fort' },
        { name: 'Hawa Mahal',                     type: 'history',  time: 'Morning',   duration: '1h',  budget: 50,   mid: 100,   luxury: 300,  tip: 'Best photos from outside at sunrise' },
        { name: 'City Palace Museum',             type: 'culture',  time: 'Afternoon', duration: '2h',  budget: 200,  mid: 500,   luxury: 1500, tip: 'Royal residence still in use' },
        { name: 'Jantar Mantar',                  type: 'history',  time: 'Morning',   duration: '1h',  budget: 50,   mid: 100,   luxury: 300,  tip: 'UNESCO World Heritage Observatory' },
        { name: 'Johri Bazaar Gems Shopping',     type: 'shopping', time: 'Afternoon', duration: '3h',  budget: 500,  mid: 3000,  luxury: 15000,tip: 'Famous for precious stones and jewelry' },
        { name: 'Nahargarh Fort Sunset',          type: 'nature',   time: 'Evening',   duration: '2h',  budget: 50,   mid: 100,   luxury: 500,  tip: 'Best sunset view of Jaipur' },
        { name: 'Rajasthani Thali Dinner',        type: 'food',     time: 'Evening',   duration: '2h',  budget: 200,  mid: 600,   luxury: 2000, tip: 'Try Choki Dhani for cultural experience' },
        { name: 'Camel Safari',                   type: 'adventure',time:'Morning',   duration: '2h',  budget: 400,  mid: 800,   luxury: 2000, tip: 'Available near Amber Fort area' },
        { name: 'Block Printing Workshop',        type: 'culture',  time: 'Afternoon', duration: '2h',  budget: 300,  mid: 600,   luxury: 1500, tip: 'Learn traditional Rajasthani craft' },
        { name: 'Birla Mandir',                   type: 'culture',  time: 'Evening',   duration: '1h',  budget: 0,    mid: 0,     luxury: 0,    tip: 'Beautiful white marble temple' },
        { name: 'Jal Mahal View',                 type: 'nature',   time: 'Evening',   duration: '1h',  budget: 0,    mid: 0,     luxury: 0,    tip: 'Palace in middle of Man Sagar Lake' },
        { name: 'Hot Air Balloon Ride',           type: 'adventure',time:'Morning',   duration: '1h',  budget: 0,    mid: 0,     luxury: 8000, tip: 'Available October to March only' },
      ],
      hotelCost: { 'Budget': 800, 'Mid-range': 3000, 'Luxury': 12000 },
      foodCost:  { 'Budget': 250, 'Mid-range': 700,  'Luxury': 2500  },
      transportCost: { 'Budget': 200, 'Mid-range': 700, 'Luxury': 2500 },
    },
    'Manali': {
      tagline: 'Adventure in the Himalayas',
      bestTime: 'March – June & Oct – Nov',
      weather: 'Cold & Snowy (0–15°C)',
      activities: [
        { name: 'Rohtang Pass Snow Adventure',    type: 'adventure',time:'Full Day',  duration: '8h',  budget: 800,  mid: 2000,  luxury: 5000, tip: 'Permit required, book in advance' },
        { name: 'Solang Valley Activities',       type: 'adventure',time:'Morning',  duration: '4h',  budget: 600,  mid: 1500,  luxury: 4000, tip: 'Skiing, zorbing, paragliding' },
        { name: 'Hadimba Temple Visit',           type: 'culture',  time: 'Morning',   duration: '1h',  budget: 50,   mid: 100,   luxury: 300,  tip: '16th century wooden temple' },
        { name: 'Old Manali Cafes & Market',      type: 'food',     time: 'Afternoon', duration: '2h',  budget: 300,  mid: 600,   luxury: 1500, tip: 'Try apple wine and local trout fish' },
        { name: 'Beas River Rafting',             type: 'adventure',time:'Morning',  duration: '2h',  budget: 600,  mid: 1200,  luxury: 2500, tip: 'Grade 3-4 rapids, thrilling!' },
        { name: 'Vashisht Hot Springs',           type: 'relaxation',time:'Evening', duration: '2h',  budget: 100,  mid: 300,   luxury: 1000, tip: 'Natural sulfur springs, very relaxing' },
        { name: 'Paragliding at Dobhi',           type: 'adventure',time:'Morning',  duration: '1h',  budget: 1500, mid: 2500,  luxury: 4000, tip: 'Best views of Kullu valley' },
        { name: 'Naggar Castle Visit',            type: 'history',  time: 'Afternoon', duration: '2h',  budget: 100,  mid: 200,   luxury: 500,  tip: 'Medieval castle turned hotel' },
        { name: 'Great Himalayan National Park',  type: 'nature',   time: 'Full Day',  duration: '6h',  budget: 500,  mid: 1500,  luxury: 4000, tip: 'UNESCO World Heritage Site' },
        { name: 'Mall Road Evening Walk',         type: 'shopping', time: 'Evening',   duration: '2h',  budget: 300,  mid: 800,   luxury: 3000, tip: 'Woolens, handicrafts, local food' },
        { name: 'Camping Under Stars',            type: 'adventure',time:'Night',    duration: '12h', budget: 1200, mid: 2500,  luxury: 6000, tip: 'Clear skies, amazing stargazing' },
        { name: 'Apple Orchard Visit',            type: 'nature',   time: 'Morning',   duration: '2h',  budget: 200,  mid: 400,   luxury: 1000, tip: 'Best in summer, pick fresh apples' },
      ],
      hotelCost: { 'Budget': 600, 'Mid-range': 2500, 'Luxury': 10000 },
      foodCost:  { 'Budget': 300, 'Mid-range': 700,  'Luxury': 2500  },
      transportCost: { 'Budget': 300, 'Mid-range': 1000, 'Luxury': 3500 },
    },
    'Ooty': {
      tagline: 'The Queen of Hill Stations',
      bestTime: 'April – June & Sept – Nov',
      weather: 'Cool & Misty (10–20°C)',
      activities: [
        { name: 'Ooty Lake Boating',              type: 'relaxation',time:'Morning',  duration: '2h',  budget: 150,  mid: 300,   luxury: 800,  tip: 'Pedal boats and row boats available' },
        { name: 'Botanical Gardens',              type: 'nature',   time: 'Morning',   duration: '2h',  budget: 30,   mid: 100,   luxury: 300,  tip: 'Over 650 plant species' },
        { name: 'Nilgiri Mountain Railway',       type: 'adventure',time:'Morning',  duration: '3h',  budget: 80,   mid: 300,   luxury: 800,  tip: 'UNESCO Heritage toy train, book early' },
        { name: 'Doddabetta Peak Trek',           type: 'nature',   time: 'Morning',   duration: '3h',  budget: 50,   mid: 200,   luxury: 800,  tip: 'Highest peak in Nilgiris at 2637m' },
        { name: 'Tea Factory Tour',               type: 'culture',  time: 'Afternoon', duration: '2h',  budget: 100,  mid: 200,   luxury: 500,  tip: 'See how Nilgiri tea is processed' },
        { name: 'Rose Garden Visit',              type: 'nature',   time: 'Afternoon', duration: '1h',  budget: 30,   mid: 80,    luxury: 200,  tip: 'Best in May during Rose Festival' },
        { name: 'Mudumalai Wildlife Safari',      type: 'adventure',time:'Morning',  duration: '4h',  budget: 500,  mid: 1200,  luxury: 3000, tip: 'Spot elephants, deer, leopards' },
        { name: 'Emerald Lake & Shola Forest',    type: 'nature',   time: 'Morning',   duration: '3h',  budget: 100,  mid: 300,   luxury: 800,  tip: 'Stunning mirror-like lake' },
        { name: 'Homemade Chocolate Shopping',    type: 'shopping', time: 'Afternoon', duration: '1h',  budget: 200,  mid: 500,   luxury: 1500, tip: 'Ooty is famous for handmade chocolates' },
        { name: 'Avalanche Lake Picnic',          type: 'nature',   time: 'Full Day',  duration: '6h',  budget: 300,  mid: 800,   luxury: 2000, tip: 'Hidden gem, trout fishing allowed' },
        { name: 'Toda Tribal Village Visit',      type: 'culture',  time: 'Afternoon', duration: '2h',  budget: 100,  mid: 200,   luxury: 500,  tip: 'Learn about ancient Toda tribe' },
        { name: 'Sunset at Needle Rock',          type: 'nature',   time: 'Evening',   duration: '2h',  budget: 50,   mid: 100,   luxury: 300,  tip: 'Breathtaking valley views' },
      ],
      hotelCost: { 'Budget': 700, 'Mid-range': 2500, 'Luxury': 9000 },
      foodCost:  { 'Budget': 250, 'Mid-range': 600,  'Luxury': 2000 },
      transportCost: { 'Budget': 200, 'Mid-range': 600, 'Luxury': 2000 },
    },
    'Agra': {
      tagline: 'Home of the Taj Mahal',
      bestTime: 'October – March',
      weather: 'Cool & Clear (10–25°C)',
      activities: [
        { name: 'Taj Mahal Sunrise Visit',        type: 'history',  time: 'Morning',   duration: '3h',  budget: 50,   mid: 200,   luxury: 1000, tip: 'Enter at 6am for golden sunrise glow' },
        { name: 'Agra Fort',                      type: 'history',  time: 'Morning',   duration: '2h',  budget: 35,   mid: 150,   luxury: 600,  tip: 'UNESCO Site, see Taj from here' },
        { name: 'Fatehpur Sikri Day Trip',        type: 'history',  time: 'Full Day',  duration: '5h',  budget: 100,  mid: 400,   luxury: 2000, tip: 'Abandoned Mughal city, spectacular' },
        { name: 'Mehtab Bagh Taj View',           type: 'nature',   time: 'Evening',   duration: '1h',  budget: 30,   mid: 100,   luxury: 500,  tip: 'Best sunset view of Taj Mahal' },
        { name: 'Kinari Bazaar Shopping',         type: 'shopping', time: 'Afternoon', duration: '2h',  budget: 300,  mid: 1000,  luxury: 5000, tip: 'Marble inlay work, leather goods' },
        { name: 'Mughal-era Food Tour',           type: 'food',     time: 'Evening',   duration: '2h',  budget: 200,  mid: 500,   luxury: 2000, tip: 'Try petha, dalmoth, and mughlai food' },
        { name: 'Itmad-ud-Daula Tomb',            type: 'history',  time: 'Afternoon', duration: '1h',  budget: 30,   mid: 100,   luxury: 400,  tip: 'Called Baby Taj, stunning marble work' },
        { name: 'Taj Nature Walk',                type: 'nature',   time: 'Morning',   duration: '2h',  budget: 50,   mid: 100,   luxury: 500,  tip: 'Forest trail near Taj Mahal' },
        { name: 'Kalakriti Cultural Show',        type: 'culture',  time: 'Evening',   duration: '2h',  budget: 400,  mid: 800,   luxury: 2000, tip: 'Mughal history show with dinner' },
        { name: 'Marble Inlay Workshop',          type: 'culture',  time: 'Afternoon', duration: '2h',  budget: 200,  mid: 500,   luxury: 1500, tip: 'Watch artisans create Taj replicas' },
      ],
      hotelCost: { 'Budget': 800, 'Mid-range': 3000, 'Luxury': 15000 },
      foodCost:  { 'Budget': 250, 'Mid-range': 700,  'Luxury': 2500  },
      transportCost: { 'Budget': 150, 'Mid-range': 600, 'Luxury': 2500 },
    },
    'Rishikesh': {
      tagline: 'Yoga Capital of the World',
      bestTime: 'September – November & Feb – May',
      weather: 'Pleasant & Breezy (15–30°C)',
      activities: [
        { name: 'Ganga Aarti at Triveni Ghat',   type: 'culture',  time: 'Evening',   duration: '1h',  budget: 0,    mid: 0,     luxury: 0,    tip: 'Every evening at 6pm, unmissable' },
        { name: 'White Water Rafting',            type: 'adventure',time:'Morning',   duration: '3h',  budget: 600,  mid: 1200,  luxury: 3000, tip: '16km stretch from Shivpuri to Rishikesh' },
        { name: 'Yoga & Meditation Class',        type: 'relaxation',time:'Morning', duration: '2h',  budget: 300,  mid: 700,   luxury: 2500, tip: 'Many ashrams offer free classes' },
        { name: 'Laxman Jhula & Ram Jhula',       type: 'culture',  time: 'Afternoon', duration: '2h',  budget: 0,    mid: 0,     luxury: 0,    tip: 'Iconic suspension bridges over Ganga' },
        { name: 'Bungee Jumping at Mohan Chatti',type: 'adventure',time:'Morning',   duration: '2h',  budget: 0,    mid: 0,     luxury: 3500, tip: 'Highest bungee in India at 83m' },
        { name: 'Beatles Ashram Visit',           type: 'history',  time: 'Morning',   duration: '2h',  budget: 150,  mid: 300,   luxury: 800,  tip: 'Where Beatles stayed in 1968' },
        { name: 'Camping by Ganges',             type: 'adventure',time:'Night',     duration: '12h', budget: 1000, mid: 2000,  luxury: 5000, tip: 'Bonfire and stargazing included' },
        { name: 'Neelkanth Mahadev Temple',       type: 'culture',  time: 'Morning',   duration: '3h',  budget: 100,  mid: 300,   luxury: 1000, tip: '24km trek or jeep available' },
        { name: 'Ayurvedic Massage & Spa',        type: 'relaxation',time:'Afternoon',duration: '2h', budget: 500,  mid: 1200,  luxury: 4000, tip: 'Many certified ayurvedic centers' },
        { name: 'Flying Fox Zip Line',            type: 'adventure',time:'Morning',  duration: '1h',  budget: 0,    mid: 1500,  luxury: 3000, tip: 'Over the Ganges, thrilling!' },
        { name: 'Rajaji National Park Safari',    type: 'nature',   time: 'Morning',   duration: '4h',  budget: 400,  mid: 1000,  luxury: 3000, tip: 'Spot elephants and tigers' },
        { name: 'Cafe Hopping in Tapovan',        type: 'food',     time: 'Afternoon', duration: '2h',  budget: 200,  mid: 500,   luxury: 1500, tip: 'Many Israeli and continental cafes' },
      ],
      hotelCost: { 'Budget': 600, 'Mid-range': 2500, 'Luxury': 10000 },
      foodCost:  { 'Budget': 250, 'Mid-range': 600,  'Luxury': 2000  },
      transportCost: { 'Budget': 150, 'Mid-range': 500, 'Luxury': 2000 },
    },
    'Udaipur': {
      tagline: 'City of Lakes & Palaces',
      bestTime: 'September – March',
      weather: 'Pleasant & Sunny (15–28°C)',
      activities: [
        { name: 'City Palace Complex',            type: 'history',  time: 'Morning',   duration: '3h',  budget: 250,  mid: 600,   luxury: 2000, tip: 'Largest palace complex in Rajasthan' },
        { name: 'Lake Pichola Boat Ride',         type: 'relaxation',time:'Evening',  duration: '1h',  budget: 400,  mid: 800,   luxury: 3000, tip: 'View Jag Mandir & Lake Palace' },
        { name: 'Jag Mandir Island Visit',        type: 'history',  time: 'Afternoon', duration: '2h',  budget: 400,  mid: 800,   luxury: 3000, tip: 'Island palace in Lake Pichola' },
        { name: 'Saheliyon Ki Bari',              type: 'nature',   time: 'Morning',   duration: '1h',  budget: 15,   mid: 50,    luxury: 200,  tip: 'Garden of maids, fountains & lotus pool' },
        { name: 'Fateh Sagar Lake Sunset',        type: 'nature',   time: 'Evening',   duration: '2h',  budget: 50,   mid: 200,   luxury: 800,  tip: 'Nehru Garden island in the middle' },
        { name: 'Monsoon Palace',                 type: 'history',  time: 'Afternoon', duration: '2h',  budget: 100,  mid: 300,   luxury: 1000, tip: 'Hilltop palace, 360° views' },
        { name: 'Vintage Car Museum',             type: 'culture',  time: 'Afternoon', duration: '1h',  budget: 250,  mid: 400,   luxury: 800,  tip: 'Royal vintage car collection' },
        { name: 'Shilpgram Craft Village',        type: 'culture',  time: 'Afternoon', duration: '2h',  budget: 30,   mid: 100,   luxury: 300,  tip: 'Traditional crafts of Western India' },
        { name: 'Rajasthani Puppet Show',         type: 'culture',  time: 'Evening',   duration: '1h',  budget: 100,  mid: 300,   luxury: 800,  tip: 'Traditional Kathputli performance' },
        { name: 'Eklingji & Nagda Temple Tour',   type: 'history',  time: 'Morning',   duration: '3h',  budget: 100,  mid: 300,   luxury: 1000, tip: '22km from Udaipur, ancient temples' },
        { name: 'Bagore Ki Haveli Museum',        type: 'culture',  time: 'Afternoon', duration: '2h',  budget: 60,   mid: 150,   luxury: 500,  tip: 'Evening show of Rajasthani folk dances' },
        { name: 'Haldighati Battlefield Tour',    type: 'history',  time: 'Full Day',  duration: '5h',  budget: 200,  mid: 600,   luxury: 2000, tip: 'Historic battle site of Maharana Pratap' },
      ],
      hotelCost: { 'Budget': 700, 'Mid-range': 3000, 'Luxury': 14000 },
      foodCost:  { 'Budget': 250, 'Mid-range': 700,  'Luxury': 2500  },
      transportCost: { 'Budget': 200, 'Mid-range': 700, 'Luxury': 2500 },
    },
    'Coimbatore': {
      tagline: 'Gateway to Nilgiris',
      bestTime: 'October – March',
      weather: 'Warm & Breezy (22–32°C)',
      activities: [
        { name: 'Isha Yoga Center',               type: 'relaxation',time:'Morning',  duration: '3h',  budget: 0,    mid: 0,     luxury: 0,    tip: 'Free entry, stunning Adiyogi statue' },
        { name: 'Marudamalai Temple',             type: 'culture',  time: 'Morning',   duration: '2h',  budget: 50,   mid: 100,   luxury: 300,  tip: 'Hilltop Murugan temple, panoramic views' },
        { name: 'Ooty Day Trip from Coimbatore',  type: 'nature',   time: 'Full Day',  duration: '8h',  budget: 500,  mid: 1200,  luxury: 4000, tip: 'Only 80km, easy day trip' },
        { name: 'Siruvani Waterfall & Dam',       type: 'nature',   time: 'Morning',   duration: '4h',  budget: 200,  mid: 500,   luxury: 1500, tip: 'Second tastiest water in world' },
        { name: 'Textile Market - Gandhipuram',   type: 'shopping', time: 'Afternoon', duration: '3h',  budget: 500,  mid: 2000,  luxury: 8000, tip: 'Coimbatore is textile capital of India' },
        { name: 'Gass Forest Museum',             type: 'culture',  time: 'Morning',   duration: '2h',  budget: 10,   mid: 50,    luxury: 200,  tip: 'Largest forest museum in Asia' },
        { name: 'Black Thunder Water Park',       type: 'adventure',time:'Full Day',  duration: '6h',  budget: 600,  mid: 900,   luxury: 1500, tip: 'Largest theme park in South India' },
        { name: 'Kovai Kondattam Amusement Park', type: 'adventure',time:'Afternoon', duration: '4h',  budget: 500,  mid: 800,   luxury: 1500, tip: 'Good for families with kids' },
        { name: 'Perur Pateeswarar Temple',       type: 'culture',  time: 'Morning',   duration: '1h',  budget: 0,    mid: 0,     luxury: 0,    tip: '2000 year old ancient Shiva temple' },
        { name: 'Coimbatore Biryani Trail',       type: 'food',     time: 'Evening',   duration: '2h',  budget: 150,  mid: 400,   luxury: 1200, tip: 'Famous for unique Coimbatore biryani style' },
        { name: 'Dhyanalinga Yoga Temple',        type: 'relaxation',time:'Morning', duration: '2h',  budget: 0,    mid: 0,     luxury: 0,    tip: 'Powerful meditation space' },
        { name: 'Velliangiri Mountains Trek',     type: 'adventure',time:'Full Day',  duration: '8h',  budget: 300,  mid: 800,   luxury: 2500, tip: 'Sacred hills, 7 hills trek to top' },
      ],
      hotelCost: { 'Budget': 700, 'Mid-range': 2500, 'Luxury': 8000 },
      foodCost:  { 'Budget': 200, 'Mid-range': 500,  'Luxury': 2000 },
      transportCost: { 'Budget': 150, 'Mid-range': 500, 'Luxury': 2000 },
    },
  };

  // ── PACKING LIST DATA ───────────────────────────────────────────
const getPackingList = (destination, days, budget) => {
  const cityInfo = cityData[destination] || {};
  const weather  = cityInfo.weather || '';
  const isCold   = weather.toLowerCase().includes('cold') || weather.toLowerCase().includes('chilly') || weather.toLowerCase().includes('freezing') || ['Manali', 'Spiti Valley', 'Leh', 'Tawang', 'Shimla', 'Dharamshala'].includes(destination);
  const isBeach  = ['Goa', 'Dhanushkodi', 'Puri'].includes(destination);
  const isTrek   = ['Manali', 'Rishikesh', 'Spiti Valley', 'Dzukou Valley', 'Tawang'].includes(destination);
  const isHeritage = ['Agra', 'Hampi', 'Khajuraho', 'Jaipur', 'Udaipur', 'Varanasi'].includes(destination);
  const isMultiDay = days > 3;

  return {
    'Documents & Money': {
      icon: '',
      color: '#0984e3',
      items: [
        { label: 'Aadhaar Card / ID Proof', mandatory: true },
        { label: 'Passport (if required)', mandatory: false },
        { label: 'Travel booking confirmations (flights/hotels)', mandatory: true },
        { label: 'Cash (ATMs may not be available everywhere)', mandatory: true },
        { label: 'Debit/Credit Cards', mandatory: true },
        { label: 'Travel insurance documents', mandatory: false },
        ...(isTrek ? [{ label: 'Inner Line Permit / Trek Permit', mandatory: true }] : []),
      ]
    },
    'Clothing': {
      icon: '',
      color: '#6c5ce7',
      items: [
        { label: `${Math.min(days + 1, 7)} sets of inner wear`, mandatory: true },
        { label: `${Math.min(days, 5)} T-shirts / tops`, mandatory: true },
        { label: isBeach ? 'Swimwear / shorts' : isCold ? 'Thermal inners (2 sets)' : 'Comfortable trousers/jeans', mandatory: true },
        ...(isCold ? [
          { label: 'Heavy woolen jacket / parka', mandatory: true },
          { label: 'Fleece sweater / hoodie', mandatory: true },
          { label: 'Woolen socks (3-4 pairs)', mandatory: true },
          { label: 'Gloves & woolen cap / balaclava', mandatory: true },
          { label: 'Muffler / scarf', mandatory: true },
        ] : [
          { label: 'Light jacket / cardigan (for AC & evenings)', mandatory: true },
          { label: 'Comfortable socks (3-4 pairs)', mandatory: true },
        ]),
        ...(isBeach ? [{ label: 'Flip flops / slippers', mandatory: true }] : []),
        ...(isTrek ? [{ label: 'Trekking pants / quick-dry bottoms', mandatory: true }] : []),
        ...(isHeritage ? [{ label: 'Modest clothing for temples/religious sites', mandatory: true }] : []),
        { label: 'Sleepwear / comfortable night clothes', mandatory: isMultiDay },
        { label: 'Formal outfit (if needed)', mandatory: false },
        { label: 'Laundry bag', mandatory: false },
      ]
    },
    'Footwear': {
      icon: '',
      color: '#fd7900',
      items: [
        ...(isTrek ? [
          { label: 'Trekking boots / waterproof shoes', mandatory: true },
          { label: 'Camp slippers / crocs', mandatory: true },
        ] : isBeach ? [
          { label: 'Waterproof sandals / reef shoes', mandatory: true },
          { label: 'Casual sneakers', mandatory: true },
        ] : [
          { label: 'Comfortable walking shoes', mandatory: true },
          { label: 'Sandals / slippers', mandatory: true },
        ]),
      ]
    },
    'Toiletries & Hygiene': {
      icon: '',
      color: '#00b894',
      items: [
        { label: 'Toothbrush & toothpaste', mandatory: true },
        { label: 'Shampoo & conditioner (travel size)', mandatory: true },
        { label: 'Body wash / soap', mandatory: true },
        { label: 'Deodorant', mandatory: true },
        { label: 'Sunscreen SPF 50+', mandatory: true },
        { label: 'Moisturizer / lip balm', mandatory: isCold },
        { label: 'Sanitizer & wet wipes', mandatory: true },
        { label: 'Tissue packets', mandatory: true },
        { label: 'Razor / shaving kit', mandatory: false },
        { label: 'Hair brush / comb', mandatory: true },
        ...(isBeach ? [{ label: 'After-sun lotion / aloe vera gel', mandatory: true }] : []),
        { label: 'Feminine hygiene products (if needed)', mandatory: false },
        { label: 'Towel (quick-dry preferred)', mandatory: isMultiDay },
      ]
    },
    'Medicines & Health': {
      icon: '',
      color: '#e84393',
      items: [
        { label: 'Personal prescription medicines', mandatory: true },
        { label: 'Paracetamol / fever tablets', mandatory: true },
        { label: 'ORS sachets (for dehydration)', mandatory: true },
        { label: 'Antacid / digestion tablets', mandatory: true },
        { label: 'Anti-diarrheal medicine', mandatory: true },
        { label: 'Band-aids & antiseptic cream', mandatory: true },
        { label: 'Pain relief spray / Volini', mandatory: isTrek },
        { label: 'Motion sickness tablets', mandatory: isTrek || isCold },
        ...(isCold ? [{ label: 'Altitude sickness tablets (Diamox)', mandatory: true }] : []),
        ...(isBeach ? [{ label: 'Anti-fungal powder / cream', mandatory: true }] : []),
        { label: 'Mosquito repellent / patches', mandatory: true },
        { label: 'Thermometer', mandatory: false },
        { label: 'Eye drops', mandatory: false },
      ]
    },
    'Electronics & Gadgets': {
      icon: '',
      color: '#0984e3',
      items: [
        { label: 'Phone + charger', mandatory: true },
        { label: 'Power bank (20,000 mAh recommended)', mandatory: true },
        { label: 'Universal travel adapter', mandatory: isMultiDay },
        { label: 'Earphones / headphones', mandatory: false },
        { label: 'Camera + memory card', mandatory: false },
        { label: 'Laptop / tablet (if needed)', mandatory: false },
        ...(isTrek ? [
          { label: 'Torch / headlamp with extra batteries', mandatory: true },
          { label: 'Offline maps downloaded', mandatory: true },
        ] : []),
        { label: 'Downloaded offline entertainment (movies/music)', mandatory: false },
      ]
    },
    'Bags & Accessories': {
      icon: '',
      color: '#c9a84c',
      items: [
        { label: 'Main travel bag / suitcase', mandatory: true },
        ...(isTrek ? [{ label: 'Trekking backpack (40-60L)', mandatory: true }] : [{ label: 'Day backpack / shoulder bag', mandatory: true }]),
        { label: 'Luggage lock', mandatory: true },
        { label: 'Waterproof bag cover / dry bag', mandatory: isTrek || isBeach },
        { label: 'Neck pillow (for long journeys)', mandatory: false },
        { label: 'Sunglasses', mandatory: true },
        ...(isCold ? [{ label: 'Snow goggles / UV protection glasses', mandatory: true }] : []),
        ...(isTrek ? [{ label: 'Trekking poles', mandatory: false }] : []),
        { label: 'Small umbrella / rain poncho', mandatory: !isCold },
        { label: 'Reusable water bottle (1L+)', mandatory: true },
        ...(isTrek ? [{ label: 'Water purification tablets', mandatory: true }] : []),
        { label: 'Snacks for journey (dry fruits, biscuits)', mandatory: true },
      ]
    },
  };
};

const [packingList, setPackingList] = useState({});
const [checkedItems, setCheckedItems] = useState({});
const [packingProgress, setPackingProgress] = useState(0);

const togglePackingItem = (category, index) => {
  const key = `${category}-${index}`;
  const newChecked = { ...checkedItems, [key]: !checkedItems[key] };
  setCheckedItems(newChecked);
  const totalItems = Object.values(packingList).reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = Object.values(newChecked).filter(Boolean).length;
  setPackingProgress(Math.round((checkedCount / totalItems) * 100));
};

  // ─── GENERATE ITINERARY ───────────────────────────────────────────
  const generateItinerary = () => {
    const days = getDays();
    if (!destination || days === 0) return;

    const cityKey = Object.keys(cityData).find(k =>
      k.toLowerCase() === destination.toLowerCase()
    );

    const data = cityKey ? cityData[cityKey] : null;

    if (!data) {
      // Generic itinerary for unknown cities
      const genericDays = Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        date: new Date(new Date(startDate).getTime() + i * 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
        activities: [
          { name: `Explore ${destination} - Day ${i + 1}`, time: 'Morning', duration: '3h', tip: 'Discover local attractions', cost: budget === 'Budget' ? 500 : budget === 'Mid-range' ? 1500 : 4000 },
          { name: 'Local Food Experience', time: 'Afternoon', duration: '2h', tip: 'Try local cuisine', cost: budget === 'Budget' ? 200 : budget === 'Mid-range' ? 600 : 2000 },
          { name: 'Evening Leisure', time: 'Evening', duration: '2h', tip: 'Relax and explore', cost: budget === 'Budget' ? 100 : budget === 'Mid-range' ? 400 : 1500 },
        ],
        dayCost: budget === 'Budget' ? 2000 : budget === 'Mid-range' ? 6000 : 18000
      }));
      setItinerary({
        destination,
        days,
        budget,
        startDate,
        endDate,
        dayPlans: genericDays,
        totalBudget: genericDays.reduce((s, d) => s + d.dayCost, 0),
        cityInfo: { tagline: `Explore ${destination}`, bestTime: 'Year round', weather: 'Check local forecast' }
      });
      setView('result');
      setActiveDay(0);
      const packing = getPackingList(cityKey || destination, days, budget);
      setPackingList(packing);
      setCheckedItems({});
      setPackingProgress(0);
      return;
    }

    // Filter activities by interests if selected
    let activities = [...data.activities];
    if (interests.length > 0) {
      const filtered = activities.filter(a => interests.map(i => i.toLowerCase()).includes(a.type.toLowerCase()));
      if (filtered.length >= days * 2) activities = filtered;
    }

    // Distribute activities across days (3-4 per day)
    const activitiesPerDay = Math.max(3, Math.min(4, Math.floor(activities.length / days)));
    const shuffled = [...activities].sort(() => Math.random() - 0.5);

    const dayPlans = Array.from({ length: days }, (_, i) => {
      const dayActivities = shuffled.slice(i * activitiesPerDay, (i + 1) * activitiesPerDay);
      const actCost = dayActivities.reduce((sum, a) => {
        const cost = budget === 'Budget' ? a.budget : budget === 'Mid-range' ? a.mid : a.luxury;
        return sum + cost;
      }, 0);
      const hotelCost = data.hotelCost[budget];
      const foodCost = data.foodCost[budget];
      const transportCost = data.transportCost[budget];
      const dayCost = actCost + hotelCost + foodCost + transportCost;

      return {
        day: i + 1,
        date: new Date(new Date(startDate).getTime() + i * 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
        activities: dayActivities.map(a => ({
          ...a,
          cost: budget === 'Budget' ? a.budget : budget === 'Mid-range' ? a.mid : a.luxury
        })),
        hotelCost,
        foodCost,
        transportCost,
        activityCost: actCost,
        dayCost
      };
    });

    setItinerary({
      destination: cityKey,
      days,
      budget,
      startDate,
      endDate,
      dayPlans,
      totalBudget: dayPlans.reduce((s, d) => s + d.dayCost, 0),
      cityInfo: { tagline: data.tagline, bestTime: data.bestTime, weather: data.weather }
    });
    setView('result');
    setActiveDay(0);
    // ── FIX: packing list populate karo known cities ke liye bhi ──
    const packing = getPackingList(cityKey, days, budget);
    setPackingList(packing);
    setCheckedItems({});
    setPackingProgress(0);
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', border: `1.5px solid ${theme.cardBorder}`,
    borderRadius: '10px', fontSize: '14px', outline: 'none',
    fontFamily: 'Poppins, sans-serif', color: secondary,
    background: cardBg, boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: '700', color: muted,
    letterSpacing: '1px', marginBottom: '6px', display: 'block'
  };

  const budgetColors = { 'Budget': '#00b894', 'Mid-range': '#0984e3', 'Luxury': '#c9a84c' };

  // ─── FORM VIEW ────────────────────────────────────────────────────
  if (view === 'form') return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        .int-btn:hover { opacity: 0.85; }
        .budget-btn:hover { opacity: 0.85; }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', background: navBg, borderBottom: `3px solid ${accent}`, position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/feed')}>
          <img src={logoImg} alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
          <h2 style={{ color: navText, margin: 0, fontSize: '18px', fontWeight: '800' }}>TripMates</h2>
        </div>
        <div style={{ fontWeight: '700', fontSize: '15px', color: navText }}>Smart Itinerary</div>
        <button onClick={() => navigate('/feed')} style={{ background: 'none', border: `2px solid ${navText}`, color: navText, padding: '7px 18px', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>Back to Feed</button>
      </nav>

      {/* Hero */}
      <div style={{ background: theme.coverBg, padding: '50px 40px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: '32px', fontWeight: '900', color: 'white' }}>
          Plan Your <span style={{ color: accent }}>Perfect Trip</span>
        </h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>AI-powered day-by-day itinerary with budget tracking</p>
      </div>

      <div style={{ maxWidth: '750px', margin: '0 auto', padding: '30px 20px', boxSizing: 'border-box' }}>
        <div style={{ background: cardBg, borderRadius: '24px', padding: '35px', border: `1px solid ${theme.cardBorder}`, boxShadow: '0 8px 40px rgba(0,0,0,0.08)', marginTop: '-30px', position: 'relative', zIndex: 10 }}>

          {/* Destination */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>DESTINATION</label>
            <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Goa, Manali, Jaipur, Udaipur..." style={inputStyle} />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              {Object.keys(cityData).map(city => (
                <span key={city} onClick={() => setDestination(city)} style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  cursor: 'pointer', background: destination === city ? accent : pageBg,
                  color: destination === city ? theme.accentText : muted,
                  border: `1px solid ${theme.cardBorder}`, transition: 'all 0.2s'
                }}>{city}</span>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }} className="form-grid">
            <div>
              <label style={labelStyle}>START DATE</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>END DATE</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {getDays() > 0 && (
            <div style={{ background: `${accent}15`, border: `1px solid ${accent}44`, borderRadius: '10px', padding: '10px 16px', marginBottom: '20px', fontSize: '13px', fontWeight: '700', color: accent }}>
              {getDays()} Day{getDays() > 1 ? 's' : ''} Trip planned!
            </div>
          )}

          {/* Budget */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>BUDGET TYPE</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {['Budget', 'Mid-range', 'Luxury'].map(b => (
                <button key={b} className="budget-btn" onClick={() => setBudget(b)} style={{
                  padding: '12px', borderRadius: '12px', border: `2px solid ${budget === b ? budgetColors[b] : theme.cardBorder}`,
                  background: budget === b ? `${budgetColors[b]}15` : cardBg,
                  color: budget === b ? budgetColors[b] : muted,
                  fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s'
                }}>
                  {b === 'Budget' ? 'Budget\nRs.2K-5K/day' : b === 'Mid-range' ? 'Mid-range\nRs.5K-15K/day' : 'Luxury\nRs.15K+/day'}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>YOUR INTERESTS (optional)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {interestOptions.map(i => (
                <button key={i} className="int-btn" onClick={() => toggleInterest(i)} style={{
                  padding: '7px 16px', borderRadius: '20px', border: `1.5px solid ${interests.includes(i) ? accent : theme.cardBorder}`,
                  background: interests.includes(i) ? `${accent}15` : cardBg,
                  color: interests.includes(i) ? accent : muted,
                  fontWeight: '600', fontSize: '12px', cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s'
                }}>{i}</button>
              ))}
            </div>
          </div>

          <button onClick={generateItinerary} style={{
           width: '100%', background: btnBg || '#7F77DD', color: btnText || 'white', border: 'none',
           padding: '16px', borderRadius: '14px', fontSize: '16px', fontWeight: '900',
           cursor: (!destination || !startDate || !endDate) ? 'not-allowed' : 'pointer',
           fontFamily: 'Poppins, sans-serif',
           boxShadow: `0 6px 20px ${accent}44`, 
           opacity: (!destination || !startDate || !endDate) ? 0.6 : 1,
           transition: 'opacity 0.2s'
          }}>
            Generate My Itinerary
          </button>
        </div>
      </div>
    </div>
  );

  // ─── RESULT VIEW ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        .day-tab:hover { opacity: 0.85; }
        .act-card:hover { transform: translateX(4px); }
        .act-card { transition: all 0.2s; }
        @media (max-width: 600px) { .budget-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', background: navBg, borderBottom: `3px solid ${accent}`, position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/feed')}>
          <img src={logoImg} alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
          <h2 style={{ color: navText, margin: 0, fontSize: '18px', fontWeight: '800' }}>TripMates</h2>
        </div>
        <div style={{ fontWeight: '700', fontSize: '15px', color: navText }}>{itinerary.destination} Itinerary</div>
        <button onClick={() => setView('form')} style={{ background: 'none', border: `2px solid ${navText}`, color: navText, padding: '7px 18px', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>Modify</button>
      </nav>

      {/* Hero */}
      <div style={{ background: theme.coverBg, padding: '35px 40px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '900', color: 'white' }}>{itinerary.destination}</h1>
        <p style={{ margin: '0 0 12px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{itinerary.cityInfo.tagline}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: '600' }}>
            {itinerary.days} Days • {itinerary.budget}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: '600' }}>
            Best Time: {itinerary.cityInfo.bestTime}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: '600' }}>
            {itinerary.cityInfo.weather}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px', boxSizing: 'border-box' }}>

        {/* Budget Summary */}
        <div style={{ background: cardBg, borderRadius: '20px', padding: '24px', marginBottom: '24px', border: `1px solid ${theme.cardBorder}`, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '800', color: secondary, letterSpacing: '1px' }}>TRIP BUDGET ESTIMATE</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }} className="budget-grid">
            {[
              { label: 'Hotels', amount: itinerary.dayPlans.reduce((s, d) => s + (d.hotelCost || 0), 0), color: '#0984e3' },
              { label: 'Food',   amount: itinerary.dayPlans.reduce((s, d) => s + (d.foodCost || 0), 0),  color: '#00b894' },
              { label: 'Transport', amount: itinerary.dayPlans.reduce((s, d) => s + (d.transportCost || 0), 0), color: '#fd7900' },
              { label: 'Activities', amount: itinerary.dayPlans.reduce((s, d) => s + (d.activityCost || 0), 0), color: '#6c5ce7' },
            ].map((item, i) => (
              <div key={i} style={{ background: pageBg, borderRadius: '12px', padding: '14px', textAlign: 'center', border: `1px solid ${theme.cardBorder}` }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: item.color }}>Rs. {item.amount.toLocaleString()}</div>
                <div style={{ fontSize: '11px', color: muted, fontWeight: '600', marginTop: '3px' }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', background: `${accent}15`, border: `1px solid ${accent}33`, borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '14px', color: secondary }}>Total Estimated Budget</span>
            <span style={{ fontWeight: '900', fontSize: '22px', color: accent }}>Rs. {itinerary.totalBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* Day Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {itinerary.dayPlans.map((day, i) => (
            <button key={i} className="day-tab" onClick={() => setActiveDay(i)} style={{
              padding: '8px 18px', borderRadius: '30px', border: 'none', cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '13px',
              background: activeDay === i ? btnBg : cardBg,
              color: activeDay === i ? btnText : muted,
              boxShadow: activeDay === i ? `0 4px 12px ${accent}44` : '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.2s'
            }}>Day {day.day}</button>
          ))}
        </div>

        {/* Active Day Plan */}
        {itinerary.dayPlans[activeDay] && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: '0 0 3px', fontSize: '20px', fontWeight: '900', color: secondary }}>Day {itinerary.dayPlans[activeDay].day}</h2>
                <p style={{ margin: 0, fontSize: '13px', color: muted }}>{itinerary.dayPlans[activeDay].date}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: accent }}>Rs. {itinerary.dayPlans[activeDay].dayCost.toLocaleString()}</div>
                <div style={{ fontSize: '11px', color: muted }}>Day total</div>
              </div>
            </div>

            {/* Activities */}
            <div style={{ marginBottom: '20px' }}>
              {itinerary.dayPlans[activeDay].activities.map((act, i) => (
                <div key={i} className="act-card" style={{
                  background: cardBg, borderRadius: '16px', padding: '18px 20px',
                  marginBottom: '12px', border: `1px solid ${theme.cardBorder}`,
                  borderLeft: `4px solid ${accent}`, boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '800', fontSize: '15px', color: secondary }}>{act.name}</span>
                        <span style={{ background: `${accent}15`, color: accent, padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{act.time}</span>
                        <span style={{ background: pageBg, color: muted, padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>{act.duration}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: muted, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: accent }}>Tip:</span> {act.tip}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: act.cost === 0 ? '#00b894' : secondary }}>
                        {act.cost === 0 ? 'FREE' : `Rs. ${act.cost.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Day Cost Breakdown */}
            <div style={{ background: cardBg, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.cardBorder}` }}>
              <h4 style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: '800', color: secondary, letterSpacing: '1px' }}>DAY {itinerary.dayPlans[activeDay].day} COST BREAKDOWN</h4>
              {[
                { label: 'Hotel / Stay', amount: itinerary.dayPlans[activeDay].hotelCost, color: '#0984e3' },
                { label: 'Food & Dining', amount: itinerary.dayPlans[activeDay].foodCost, color: '#00b894' },
                { label: 'Local Transport', amount: itinerary.dayPlans[activeDay].transportCost, color: '#fd7900' },
                { label: 'Activities', amount: itinerary.dayPlans[activeDay].activityCost, color: '#6c5ce7' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? `1px solid ${theme.cardBorder}` : 'none' }}>
                  <span style={{ fontSize: '13px', color: muted, fontWeight: '600' }}>{item.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: item.color }}>Rs. {item.amount?.toLocaleString() || 0}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: `2px solid ${theme.cardBorder}` }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: secondary }}>Day Total</span>
                <span style={{ fontSize: '18px', fontWeight: '900', color: accent }}>Rs. {itinerary.dayPlans[activeDay].dayCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button onClick={() => setActiveDay(d => Math.max(0, d - 1))} disabled={activeDay === 0} style={{
                background: cardBg, border: `1.5px solid ${theme.cardBorder}`, color: muted,
                padding: '10px 24px', borderRadius: '30px', fontWeight: '700', cursor: 'pointer',
                fontSize: '13px', fontFamily: 'Poppins, sans-serif', opacity: activeDay === 0 ? 0.4 : 1
              }}>Previous Day</button>
              <button onClick={() => setActiveDay(d => Math.min(itinerary.days - 1, d + 1))} disabled={activeDay === itinerary.days - 1} style={{
                background: btnBg, border: 'none', color: btnText,
                padding: '10px 24px', borderRadius: '30px', fontWeight: '700', cursor: 'pointer',
                fontSize: '13px', fontFamily: 'Poppins, sans-serif', opacity: activeDay === itinerary.days - 1 ? 0.4 : 1
              }}>Next Day</button>
            </div>
            {/* ── PACKING LIST ─────────────────────────────────────────── */}
{Object.keys(packingList).length > 0 && (
  <div style={{ marginTop: '28px' }}>

    {/* Header */}
    <div style={{ background: cardBg, borderRadius: '20px', padding: '22px 24px', marginBottom: '16px', border: `1px solid ${theme.cardBorder}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ margin: '0 0 3px', fontSize: '18px', fontWeight: '900', color: secondary }}>Packing Checklist</h3>
          <p style={{ margin: 0, fontSize: '12px', color: muted }}>Tick karo jaise pack karte jao!</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '22px', fontWeight: '900', color: accent }}>{packingProgress}%</div>
          <div style={{ fontSize: '11px', color: muted }}>Packed</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '10px', background: theme.pageBg, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${theme.cardBorder}` }}>
        <div style={{
          height: '100%', borderRadius: '10px',
          background: packingProgress === 100 ? '#00b894' : theme.progressBg,
          width: `${packingProgress}%`, transition: 'width 0.4s ease'
        }} />
      </div>

      {packingProgress === 100 && (
        <div style={{ marginTop: '12px', background: '#00b89415', border: '1px solid #00b89444', borderRadius: '10px', padding: '10px 14px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#00b894' }}>
          All packed! Have an amazing trip!
        </div>
      )}
    </div>

    {/* Categories */}
    {Object.entries(packingList).map(([category, data]) => {
      const catChecked = data.items.filter((_, idx) => checkedItems[`${category}-${idx}`]).length;
      return (
        <div key={category} style={{ background: cardBg, borderRadius: '18px', padding: '20px', marginBottom: '12px', border: `1px solid ${theme.cardBorder}`, borderLeft: `4px solid ${data.color}`, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>

          {/* Category Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>{data.icon}</span>
              <span style={{ fontWeight: '800', fontSize: '15px', color: secondary }}>{category}</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: catChecked === data.items.length ? '#00b894' : muted }}>
              {catChecked}/{data.items.length}
            </span>
          </div>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.items.map((item, idx) => {
              const key = `${category}-${idx}`;
              const isChecked = checkedItems[key];
              return (
                <div key={idx} onClick={() => togglePackingItem(category, idx)} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  cursor: 'pointer', padding: '8px 10px', borderRadius: '10px',
                  background: isChecked ? `${data.color}08` : 'transparent',
                  transition: 'all 0.15s'
                }}>
                  {/* Checkbox */}
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
                    border: `2px solid ${isChecked ? data.color : theme.cardBorder}`,
                    background: isChecked ? data.color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s'
                  }}>
                    {isChecked && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>

                  {/* Label */}
                  <span style={{
                    fontSize: '13px', fontWeight: item.mandatory ? '600' : '400',
                    color: isChecked ? muted : secondary,
                    textDecoration: isChecked ? 'line-through' : 'none',
                    flex: 1, transition: 'all 0.15s'
                  }}>{item.label}</span>

                  {/* Mandatory badge */}
                  {item.mandatory && !isChecked && (
                    <span style={{ fontSize: '10px', fontWeight: '700', color: data.color, background: `${data.color}15`, padding: '2px 7px', borderRadius: '10px', border: `1px solid ${data.color}33`, whiteSpace: 'nowrap' }}>Must</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartItinerary;
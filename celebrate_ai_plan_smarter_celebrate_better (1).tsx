import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Calendar, DollarSign, CheckCircle2, Clock, Users, MapPin, 
  MessageSquare, Plus, Trash2, Edit3, ChevronRight, AlertTriangle, 
  PartyPopper, Utensils, Music, Camera, Gift, RefreshCw, Send, Check, 
  Filter, Heart, Star, LayoutDashboard, ListTodo, Briefcase, Zap, 
  ChevronDown, HelpCircle, AlertCircle, ArrowUpRight, PieChart, Info
} from 'lucide-react';

// --- INITIAL DEMO PRESETS ---
const DEMO_EVENTS = [
  {
    id: 'demo-1',
    name: 'Aria & Liam\'s Glasshouse Wedding',
    type: 'Wedding',
    date: '2026-11-14',
    location: 'Napa Valley, CA',
    guestCount: 120,
    budget: 35000,
    culturalPref: 'Modern Minimalist & Tuscan',
    theme: 'Ethereal Garden & Warm Terracotta',
    decor: 'Hanging Wisteria, Fairy Light Canopies, Amber Glassware, Cream Linens',
    menu: 'Farm-to-table Tuscan Pasta, Grilled Halibut, Artisan Cheese Boards, Fig & Honey Cake',
    entertainment: 'Acoustic Guitar Duo for Ceremony, 5-Piece Jazz Fusion Band for Reception',
    tasks: [
      { id: 't1', title: 'Book Glasshouse Venue', category: 'Venue', dueDate: '2026-04-15', completed: true, cost: 12000 },
      { id: 't2', title: 'Schedule Catering Tasting', category: 'Catering', dueDate: '2026-06-01', completed: true, cost: 9500 },
      { id: 't3', title: 'Finalize Floral Designs', category: 'Decor', dueDate: '2026-08-10', completed: false, cost: 4500 },
      { id: 't4', title: 'Hire Live Jazz Band', category: 'Entertainment', dueDate: '2026-09-01', completed: true, cost: 3000 },
      { id: 't5', title: 'Send Written Invitations', category: 'Miscellaneous', dueDate: '2026-09-15', completed: false, cost: 800 }
    ],
    vendors: [
      { id: 'v1', name: 'Valley View Glasshouse', category: 'Venue', contact: 'events@glasshouse.com', status: 'Booked', cost: 12000 },
      { id: 'v2', name: 'Artisan Harvest Catering', category: 'Catering', contact: '+1 (555) 234-5678', status: 'Booked', cost: 9500 },
      { id: 'v3', name: 'Lumina Floral Studio', category: 'Decor', contact: 'hello@luminaflorals.com', status: 'Quoted', cost: 4500 },
      { id: 'v4', name: 'Velvet Groove Band', category: 'Entertainment', contact: '+1 (555) 987-6543', status: 'Booked', cost: 3000 }
    ]
  },
  {
    id: 'demo-2',
    name: 'Leo\'s 30th Cyberpunk Neon Party',
    type: 'Birthday',
    date: '2026-08-22',
    location: 'Downtown Loft, Austin, TX',
    guestCount: 60,
    budget: 5000,
    culturalPref: 'Futuristic & Retro Synthwave',
    theme: 'Neon Cyberpunk Arcade',
    decor: 'UV Reactive Streamers, Neon Signs, LED Cocktail Tables, Fog Machines',
    menu: 'Gourmet Slider Bar, Glowing Molecular Cocktails, Custom Pixel Cake',
    entertainment: 'Synthwave DJ, Retro Arcade Cabinets Rental, Photo Booth with Cyber Props',
    tasks: [
      { id: 'tb1', title: 'Reserve Downtown Loft', category: 'Venue', dueDate: '2026-06-01', completed: true, cost: 1800 },
      { id: 'tb2', title: 'Rent Arcade Cabinets', category: 'Entertainment', dueDate: '2026-07-15', completed: true, cost: 1200 },
      { id: 'tb3', title: 'Order Cyberpunk Neon Cake', category: 'Catering', dueDate: '2026-08-01', completed: false, cost: 350 }
    ],
    vendors: [
      { id: 'vb1', name: 'Loft 704 Event Space', category: 'Venue', contact: 'booking@loft704.com', status: 'Booked', cost: 1800 },
      { id: 'vb2', name: 'Arcade Nostalgia Rentals', category: 'Entertainment', contact: 'rent@arcadenostalgia.com', status: 'Booked', cost: 1200 }
    ]
  }
];

// --- FALLBACK AI GENERATOR LOGIC ---
const generateFallbackPlan = (params) => {
  const { type, guestCount, budget, culturalPref } = params;
  const numGuests = parseInt(guestCount) || 50;
  const totalBudget = parseFloat(budget) || 5000;

  const themes = {
    Wedding: ['Bohemian Botanical Elegance', 'Royal Heritage Gold & Crimson', 'Modern Minimalist Glasshouse', 'Coastal Sunset Romance'],
    Birthday: ['Neon Cyberpunk Lounge', 'Vintage 1920s Gatsby Soirée', 'Tropical Sunset Fiesta', 'Enchanted Woodland Fantasy'],
    Anniversary: ['Golden Decades Celebration', 'Silver Sparkle Moonlight Gala', 'Intimate Cellar & Wine Tasting', 'Parisian Romance'],
    Community: ['Eco-Green Sustainable Fair', 'Global Food & Cultural Fest', 'Interactive Innovation Expo', 'Community Arts & Music Jam']
  };

  const selectedTheme = themes[type]?.[Math.floor(Math.random() * themes[type].length)] || 'Contemporary Chic';

  return {
    theme: selectedTheme,
    decor: `Custom lighting array matched to ${selectedTheme.toLowerCase()}, eco-friendly floral centerpieces, ambient candlelit pathways, and tailored welcome signage reflecting ${culturalPref || 'modern accents'}.`,
    menu: `Curated 3-course tasting menu featuring seasonal local ingredients, live interactive appetizer stations, custom signature cocktails, and dietary-tailored dessert flights for ${numGuests} guests.`,
    entertainment: `Live acoustic prelude performance, interactive photobooth with themed instant prints, professional DJ, and personalized light-show climax.`,
    suggestedBudget: {
      Venue: Math.round(totalBudget * 0.35),
      Catering: Math.round(totalBudget * 0.30),
      Decor: Math.round(totalBudget * 0.15),
      Photography: Math.round(totalBudget * 0.10),
      Entertainment: Math.round(totalBudget * 0.07),
      Miscellaneous: Math.round(totalBudget * 0.03)
    }
  };
};

export default function App() {
  // State initialization
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('celebrate_ai_events');
    return saved ? JSON.parse(saved) : DEMO_EVENTS;
  });

  const [activeEventId, setActiveEventId] = useState(() => {
    const saved = localStorage.getItem('celebrate_ai_active_id');
    return saved || 'demo-1';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form State for Event Creation/Edit
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Wedding',
    date: '',
    location: '',
    guestCount: 80,
    budget: 10000,
    culturalPref: ''
  });

  // Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Hello! I'm your Celebrate AI assistant. Need ideas for decor, menu options, or budget tweaks? Ask me anything!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Task & Vendor Modal States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'Venue', dueDate: '', cost: 0 });

  const [showVendorModal, setShowVendorModal] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: '', category: 'Venue', contact: '', status: 'Quoted', cost: 0 });

  // Filter States
  const [taskFilter, setTaskFilter] = useState('all');

  // Active Event Memo
  const currentEvent = useMemo(() => {
    return events.find(e => e.id === activeEventId) || events[0] || null;
  }, [events, activeEventId]);

  // Persist State
  useEffect(() => {
    localStorage.setItem('celebrate_ai_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (activeEventId) {
      localStorage.setItem('celebrate_ai_active_id', activeEventId);
    }
  }, [activeEventId]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- GEMINI API INTEGRATION ---
  const callGeminiAPI = async (prompt, systemInstruction = '') => {
    try {
      const apiKey = ""; // Canvas runtime automatically handles empty API key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
      };

      let response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || null;
    } catch (err) {
      console.warn('Gemini API request failed, utilizing smart AI fallback generator:', err);
      return null;
    }
  };

  // Create or Update Event with AI Plan
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    let planData = null;
    const prompt = `Create an event plan for a ${formData.type} named "${formData.name}" with ${formData.guestCount} guests, budget of $${formData.budget}, located at ${formData.location}, cultural/theme preference: "${formData.culturalPref}". 
    Return JSON format only with keys: theme, decor, menu, entertainment, suggestedBudget (object with keys: Venue, Catering, Decor, Photography, Entertainment, Miscellaneous containing numerical estimated dollar values).`;
    
    const sysPrompt = "You are a top-tier luxury event planner. Respond strictly with valid JSON.";

    const rawResponse = await callGeminiAPI(prompt, sysPrompt);

    if (rawResponse) {
      try {
        const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        planData = JSON.parse(cleaned);
      } catch (e) {
        console.warn('JSON parsing failed from AI output:', e);
      }
    }

    if (!planData) {
      planData = generateFallbackPlan(formData);
    }

    const eventId = editingEvent ? editingEvent.id : `evt-${Date.now()}`;

    // Generate starter tasks based on AI budget allocations
    const categoryCosts = planData.suggestedBudget || {
      Venue: Math.round(formData.budget * 0.35),
      Catering: Math.round(formData.budget * 0.30),
      Decor: Math.round(formData.budget * 0.15),
      Photography: Math.round(formData.budget * 0.10),
      Entertainment: Math.round(formData.budget * 0.07),
      Miscellaneous: Math.round(formData.budget * 0.03)
    };

    const starterTasks = editingEvent ? editingEvent.tasks : [
      { id: `t-${Date.now()}-1`, title: 'Book Main Event Venue', category: 'Venue', dueDate: formData.date, completed: false, cost: categoryCosts.Venue },
      { id: `t-${Date.now()}-2`, title: 'Select Menu & Catering Team', category: 'Catering', dueDate: formData.date, completed: false, cost: categoryCosts.Catering },
      { id: `t-${Date.now()}-3`, title: 'Finalize Lighting & Decor setup', category: 'Decor', dueDate: formData.date, completed: false, cost: categoryCosts.Decor },
      { id: `t-${Date.now()}-4`, title: 'Hire Photographer & Videographer', category: 'Photography', dueDate: formData.date, completed: false, cost: categoryCosts.Photography }
    ];

    const newEvent = {
      ...formData,
      id: eventId,
      theme: planData.theme || 'Elegant Contemporary',
      decor: planData.decor || 'Custom aesthetic styling',
      menu: planData.menu || 'Gourmet selections',
      entertainment: planData.entertainment || 'Curated music and activities',
      tasks: starterTasks,
      vendors: editingEvent ? editingEvent.vendors : [
        { id: `v-${Date.now()}-1`, name: 'Primary Venue Location', category: 'Venue', contact: 'Pending Inquiry', status: 'Quoted', cost: categoryCosts.Venue },
        { id: `v-${Date.now()}-2`, name: 'Master Chef Catering', category: 'Catering', contact: 'Pending Inquiry', status: 'Quoted', cost: categoryCosts.Catering }
      ]
    };

    if (editingEvent) {
      setEvents(events.map(ev => ev.id === editingEvent.id ? newEvent : ev));
      showToast('Event details updated successfully!');
    } else {
      setEvents([newEvent, ...events]);
      setActiveEventId(newEvent.id);
      showToast('AI Plan created and populated!');
    }

    setIsGenerating(false);
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id) => {
    if (events.length <= 1) {
      showToast('You must keep at least one event profile active.', 'error');
      return;
    }
    const filtered = events.filter(e => e.id !== id);
    setEvents(filtered);
    setActiveEventId(filtered[0].id);
    showToast('Event removed successfully.');
  };

  // Task Actions
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!currentEvent) return;
    const taskObj = {
      ...newTask,
      id: `t-${Date.now()}`,
      completed: false,
      cost: parseFloat(newTask.cost) || 0
    };

    const updated = {
      ...currentEvent,
      tasks: [taskObj, ...currentEvent.tasks]
    };

    setEvents(events.map(ev => ev.id === currentEvent.id ? updated : ev));
    setShowTaskModal(false);
    setNewTask({ title: '', category: 'Venue', dueDate: '', cost: 0 });
    showToast('Task added to timeline.');
  };

  const toggleTask = (taskId) => {
    if (!currentEvent) return;
    const updatedTasks = currentEvent.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setEvents(events.map(ev => ev.id === currentEvent.id ? { ...currentEvent, tasks: updatedTasks } : ev));
  };

  const deleteTask = (taskId) => {
    if (!currentEvent) return;
    const updatedTasks = currentEvent.tasks.filter(t => t.id !== taskId);
    setEvents(events.map(ev => ev.id === currentEvent.id ? { ...currentEvent, tasks: updatedTasks } : ev));
    showToast('Task deleted');
  };

  // Vendor Actions
  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!currentEvent) return;
    const vendorObj = {
      ...newVendor,
      id: `v-${Date.now()}`,
      cost: parseFloat(newVendor.cost) || 0
    };

    const updated = {
      ...currentEvent,
      vendors: [vendorObj, ...currentEvent.vendors]
    };

    setEvents(events.map(ev => ev.id === currentEvent.id ? updated : ev));
    setShowVendorModal(false);
    setNewVendor({ name: '', category: 'Venue', contact: '', status: 'Quoted', cost: 0 });
    showToast('Vendor record added.');
  };

  const deleteVendor = (vendorId) => {
    if (!currentEvent) return;
    const updatedVendors = currentEvent.vendors.filter(v => v.id !== vendorId);
    setEvents(events.map(ev => ev.id === currentEvent.id ? { ...currentEvent, vendors: updatedVendors } : ev));
    showToast('Vendor removed.');
  };

  // Chatbot Interaction
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');

    const newChatHistory = [...chatMessages, { role: 'user', text: userMsg }];
    setChatMessages(newChatHistory);
    setChatLoading(true);

    const contextStr = currentEvent 
      ? `Active Event: ${currentEvent.name} (${currentEvent.type}), Guest count: ${currentEvent.guestCount}, Budget: $${currentEvent.budget}, Location: ${currentEvent.location}, Theme: ${currentEvent.theme}.` 
      : '';

    const sysInstruction = `You are Celebrate AI, a friendly, ultra-knowledgeable event assistant. Give concise, creative, high-value advice tailored to the user's event. ${contextStr}`;
    
    const aiText = await callGeminiAPI(userMsg, sysInstruction);

    if (aiText) {
      setChatMessages([...newChatHistory, { role: 'assistant', text: aiText }]);
    } else {
      // Rule-based conversational fallbacks
      let fallbackText = "That's a fantastic idea! For your guest size, I'd suggest focusing heavily on lighting ambiance and signature mocktails to maximize impact while saving costs.";
      if (userMsg.toLowerCase().includes('decor') || userMsg.toLowerCase().includes('theme')) {
        fallbackText = `For a ${currentEvent?.type || 'special event'} theme, try warm fairy lights, custom acrylic welcome signs, and reusable foliage centerpieces!`;
      } else if (userMsg.toLowerCase().includes('budget') || userMsg.toLowerCase().includes('cost')) {
        fallbackText = "Pro tip: Catering and Venue typically consume 65% of your budget. Opting for food stations over formal plated dinners can save up to 20%!";
      }

      setChatMessages([...newChatHistory, { role: 'assistant', text: fallbackText }]);
    }
    setChatLoading(false);
  };

  // Calculations
  const totalSpent = useMemo(() => {
    if (!currentEvent) return 0;
    const taskTotal = currentEvent.tasks.reduce((acc, t) => acc + (t.cost || 0), 0);
    const vendorTotal = currentEvent.vendors.reduce((acc, v) => acc + (v.cost || 0), 0);
    return Math.max(taskTotal, vendorTotal);
  }, [currentEvent]);

  const remainingBudget = currentEvent ? currentEvent.budget - totalSpent : 0;
  const isOverBudget = remainingBudget < 0;

  const completedTasksCount = currentEvent ? currentEvent.tasks.filter(t => t.completed).length : 0;
  const taskProgressPct = currentEvent && currentEvent.tasks.length > 0 
    ? Math.round((completedTasksCount / currentEvent.tasks.length) * 100) 
    : 0;

  // Category breakdown for charts
  const categoryBreakdown = useMemo(() => {
    if (!currentEvent) return {};
    const cats = { Venue: 0, Catering: 0, Decor: 0, Photography: 0, Entertainment: 0, Miscellaneous: 0 };
    currentEvent.tasks.forEach(t => {
      if (cats[t.category] !== undefined) cats[t.category] += (t.cost || 0);
      else cats.Miscellaneous += (t.cost || 0);
    });
    return cats;
  }, [currentEvent]);

  const daysRemaining = useMemo(() => {
    if (!currentEvent || !currentEvent.date) return null;
    const target = new Date(currentEvent.date);
    const now = new Date();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
  }, [currentEvent]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-purple-500 selection:text-white pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 animate-bounce ${
          notification.type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-5 h-5 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
                Celebrate AI
              </h1>
              <p className="text-xs text-purple-400 font-medium tracking-wide">Plan Smarter, Celebrate Better!</p>
            </div>
          </div>

          {/* Event Selector Dropdown & New Event Button */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select 
                value={activeEventId} 
                onChange={(e) => setActiveEventId(e.target.value)}
                className="bg-slate-800/90 border border-slate-700/80 text-slate-200 text-sm rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer transition-all"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id} className="bg-slate-900 text-slate-200">
                    {ev.name} ({ev.type})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            <button
              onClick={() => {
                setEditingEvent(null);
                setFormData({ name: '', type: 'Wedding', date: '', location: '', guestCount: 80, budget: 10000, culturalPref: '' });
                setShowEventModal(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-2 text-sm transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Event</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Active Event Banner Summary */}
        {currentEvent && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/40 border border-purple-500/20 p-6 sm:p-8 mb-8 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    {currentEvent.type}
                  </span>
                  {daysRemaining !== null && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {daysRemaining > 0 ? `${daysRemaining} days away` : daysRemaining === 0 ? 'Today is the Day!' : 'Past Event'}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">{currentEvent.name}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-purple-400" />{currentEvent.date || 'TBD'}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-purple-400" />{currentEvent.location || 'Location TBD'}</div>
                  <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-purple-400" />{currentEvent.guestCount} Guests</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setEditingEvent(currentEvent);
                    setFormData({
                      name: currentEvent.name,
                      type: currentEvent.type,
                      date: currentEvent.date,
                      location: currentEvent.location,
                      guestCount: currentEvent.guestCount,
                      budget: currentEvent.budget,
                      culturalPref: currentEvent.culturalPref || ''
                    });
                    setShowEventModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> Edit Event
                </button>
                <button 
                  onClick={() => handleDeleteEvent(currentEvent.id)}
                  className="px-3 py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-sm font-medium border border-rose-800/40 transition-all"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 space-x-1 sm:space-x-4 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'ai-plan', label: 'AI Blueprint', icon: Sparkles },
            { id: 'budget', label: 'Smart Budget', icon: DollarSign },
            { id: 'timeline', label: 'Timeline & Tasks', icon: ListTodo },
            { id: 'vendors', label: 'Vendors Hub', icon: Briefcase },
            { id: 'assistant', label: 'AI Assistant', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
                  isActive 
                    ? 'border-purple-500 text-purple-400 bg-purple-500/5' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && currentEvent && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Budget</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><DollarSign className="w-5 h-5" /></div>
                </div>
                <div className="text-2xl font-bold text-white">${currentEvent.budget.toLocaleString()}</div>
                <div className="mt-2 text-xs text-slate-400">Allocated limit</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Spent</span>
                  <div className={`p-2 rounded-xl ${isOverBudget ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    <PieChart className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">${totalSpent.toLocaleString()}</div>
                <div className={`mt-2 text-xs font-medium flex items-center gap-1 ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isOverBudget ? (
                    <><AlertTriangle className="w-3.5 h-3.5" /> ${Math.abs(remainingBudget).toLocaleString()} Over Budget</>
                  ) : (
                    <><Check className="w-3.5 h-3.5" /> ${remainingBudget.toLocaleString()} Remaining</>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tasks Done</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><ListTodo className="w-5 h-5" /></div>
                </div>
                <div className="text-2xl font-bold text-white">{completedTasksCount} / {currentEvent.tasks.length}</div>
                <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${taskProgressPct}%` }} />
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Booked Vendors</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400"><Briefcase className="w-5 h-5" /></div>
                </div>
                <div className="text-2xl font-bold text-white">
                  {currentEvent.vendors.filter(v => v.status === 'Booked').length} / {currentEvent.vendors.length}
                </div>
                <div className="mt-2 text-xs text-amber-400/90 font-medium">Active engagements</div>
              </div>
            </div>

            {/* AI Theme & Overview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">AI Vision & Theme Highlights</h3>
                    <p className="text-xs text-slate-400">Generated tailored recommendations</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">Theme Concept</span>
                    <p className="text-white font-medium text-base">{currentEvent.theme}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Utensils className="w-3.5 h-3.5 text-purple-400" /> Dining & Culinary
                      </span>
                      <p className="text-slate-300 text-sm">{currentEvent.menu}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Music className="w-3.5 h-3.5 text-purple-400" /> Entertainment
                      </span>
                      <p className="text-slate-300 text-sm">{currentEvent.entertainment}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Urgent Tasks Panel */}
              <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-400" /> Key Milestones
                    </h3>
                    <button onClick={() => setActiveTab('timeline')} className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center">
                      View all <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentEvent.tasks.slice(0, 4).map(task => (
                      <div key={task.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <button 
                            onClick={() => toggleTask(task.id)}
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              task.completed ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-600 hover:border-purple-400'
                            }`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5" />}
                          </button>
                          <span className={`text-sm truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task.title}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0 font-mono">${task.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('assistant')}
                  className="mt-6 w-full py-3 px-4 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-300 hover:bg-purple-600/20 text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Ask AI Assistant For Advice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI BLUEPRINT */}
        {activeTab === 'ai-plan' && currentEvent && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> GenAI Comprehensive Event Strategy
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">Personalized Creative Blueprint</h2>
                </div>
                <button
                  onClick={async () => {
                    setIsGenerating(true);
                    showToast('Regenerating creative concepts...');
                    const planData = generateFallbackPlan(currentEvent);
                    const updated = {
                      ...currentEvent,
                      theme: planData.theme,
                      decor: planData.decor,
                      menu: planData.menu,
                      entertainment: planData.entertainment
                    };
                    setEvents(events.map(e => e.id === currentEvent.id ? updated : e));
                    setIsGenerating(false);
                    showToast('Blueprint refreshed with new creative ideas!');
                  }}
                  disabled={isGenerating}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate Blueprint
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400"><Sparkles className="w-5 h-5" /></div>
                    <h3 className="text-lg font-semibold text-white">Event Theme & Ambiance</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm">{currentEvent.theme}</p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Gift className="w-5 h-5" /></div>
                    <h3 className="text-lg font-semibold text-white">Decoration & Styling</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm">{currentEvent.decor}</p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Utensils className="w-5 h-5" /></div>
                    <h3 className="text-lg font-semibold text-white">Curated Catering & Menu</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm">{currentEvent.menu}</p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Music className="w-5 h-5" /></div>
                    <h3 className="text-lg font-semibold text-white">Entertainment & Activities</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm">{currentEvent.entertainment}</p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-purple-950/20 border border-purple-800/30 flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-200 leading-relaxed">
                  <strong>AI Disclaimer:</strong> Recommendations are dynamically generated estimates tailored to your specified location ({currentEvent.location}) and budget (${currentEvent.budget.toLocaleString()}). Verified vendor quotes should be logged under the Vendor Hub tab.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SMART BUDGET */}
        {activeTab === 'budget' && currentEvent && (
          <div className="space-y-8 animate-fadeIn">
            {/* Budget Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                <span className="text-xs font-semibold text-slate-400 uppercase">Target Budget</span>
                <div className="text-3xl font-bold text-white mt-2">${currentEvent.budget.toLocaleString()}</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                <span className="text-xs font-semibold text-slate-400 uppercase">Allocated / Logged Spending</span>
                <div className="text-3xl font-bold text-white mt-2">${totalSpent.toLocaleString()}</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                <span className="text-xs font-semibold text-slate-400 uppercase">Remaining Funds</span>
                <div className={`text-3xl font-bold mt-2 ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ${remainingBudget.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Over-budget alert */}
            {isOverBudget && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 flex items-center gap-3 text-rose-200">
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Budget Overrun Alert</h4>
                  <p className="text-xs text-rose-300">You are currently ${Math.abs(remainingBudget).toLocaleString()} over your allocated budget. Consider re-evaluating decor or catering costs in the vendor hub.</p>
                </div>
              </div>
            )}

            {/* Category Breakdown Progress */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-6">Expense Distribution by Category</h3>
              
              <div className="space-y-6">
                {Object.entries(categoryBreakdown).map(([category, amount]) => {
                  const pct = currentEvent.budget > 0 ? Math.round((amount / currentEvent.budget) * 100) : 0;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-200">{category}</span>
                        <span className="text-slate-400">${amount.toLocaleString()} <span className="text-xs text-slate-500">({pct}%)</span></span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500" 
                          style={{ width: `${Math.min(pct, 100)}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TIMELINE & TASKS */}
        {activeTab === 'timeline' && currentEvent && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Actionable Planning Timeline</h2>
                <p className="text-xs text-slate-400">Track task milestones leading up to {currentEvent.date || 'the big event'}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  {['all', 'pending', 'completed'].map(f => (
                    <button
                      key={f}
                      onClick={() => setTaskFilter(f)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                        taskFilter === f ? 'bg-purple-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowTaskModal(true)}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {currentEvent.tasks
                .filter(t => taskFilter === 'all' ? true : taskFilter === 'completed' ? t.completed : !t.completed)
                .map(task => (
                  <div key={task.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                          task.completed ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-600 hover:border-purple-400'
                        }`}
                      >
                        {task.completed && <Check className="w-4 h-4" />}
                      </button>
                      <div className="min-w-0">
                        <h4 className={`text-sm font-medium truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300">{task.category}</span>
                          {task.dueDate && <span>Due: {task.dueDate}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-mono text-slate-300 font-semibold">${task.cost}</span>
                      <button 
                        onClick={() => deleteTask(task.id)} 
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

              {currentEvent.tasks.length === 0 && (
                <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
                  <ListTodo className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No tasks added yet. Click "Add Task" to start building your timeline!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: VENDORS HUB */}
        {activeTab === 'vendors' && currentEvent && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Vendor Management Hub</h2>
                <p className="text-xs text-slate-400">Manage venue rentals, caterers, photographers, and entertainment</p>
              </div>

              <button
                onClick={() => setShowVendorModal(true)}
                className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/20"
              >
                <Plus className="w-4 h-4" /> Add Vendor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentEvent.vendors.map(vendor => (
                <div key={vendor.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 relative group hover:border-slate-700 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {vendor.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2">{vendor.name}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-xl text-xs font-semibold border ${
                      vendor.status === 'Booked' 
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                        : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                    }`}>
                      {vendor.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-400 mb-6">
                    <div>Contact: <span className="text-slate-200">{vendor.contact || 'N/A'}</span></div>
                    <div>Cost: <span className="text-slate-200 font-mono font-semibold">${vendor.cost.toLocaleString()}</span></div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={() => deleteVendor(vendor.id)}
                      className="text-slate-500 hover:text-rose-400 text-xs flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Vendor
                    </button>
                  </div>
                </div>
              ))}

              {currentEvent.vendors.length === 0 && (
                <div className="col-span-full text-center py-12 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
                  <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No vendors recorded yet. Click "Add Vendor" to organize your team!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: AI ASSISTANT CHATBOT */}
        {activeTab === 'assistant' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 h-[550px] flex flex-col justify-between shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Celebrate AI Interactive Assistant</h3>
                  <p className="text-xs text-slate-400">Ask questions regarding theme ideas, budget shifts, or planning tips</p>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-400 rounded-2xl px-4 py-3 text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin text-purple-400" /> AI is thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Input Control */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask for theme alternatives, cocktail ideas, or cost saving tips..."
                  className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendChat}
                  disabled={chatLoading}
                  className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: CREATE / EDIT EVENT */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-scaleUp">
            <h3 className="text-xl font-bold text-white mb-2">
              {editingEvent ? 'Edit Event Setup' : 'Create New AI Event Plan'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">Our GenAI model will generate custom themes, menus, decor, and budget breakdowns based on your inputs.</p>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya & Sam's Sunset Wedding"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Event Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Community">Community Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Guest Count</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Total Budget ($)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Location / City</label>
                <input
                  type="text"
                  placeholder="e.g. Austin, TX"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Theme / Cultural Preferences</label>
                <input
                  type="text"
                  placeholder="e.g. Boho chic, Vintage Gatsby, Rustic Italian..."
                  value={formData.culturalPref}
                  onChange={(e) => setFormData({ ...formData, culturalPref: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30"
                >
                  {isGenerating && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {isGenerating ? 'Generating Plan...' : editingEvent ? 'Update Plan' : 'Generate AI Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD TASK */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Task to Timeline</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule floral consultation"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Decor">Decor</option>
                    <option value="Photography">Photography</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    value={newTask.cost}
                    onChange={(e) => setNewTask({ ...newTask, cost: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-medium text-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD VENDOR */}
      {showVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Vendor Record</h3>
            <form onSubmit={handleAddVendor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Vendor / Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Sound & Lights"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={newVendor.category}
                    onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Decor">Decor</option>
                    <option value="Photography">Photography</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Status</label>
                  <select
                    value={newVendor.status}
                    onChange={(e) => setNewVendor({ ...newVendor, status: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="Quoted">Quoted</option>
                    <option value="Booked">Booked</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Agreed / Quoted Cost ($)</label>
                  <input
                    type="number"
                    value={newVendor.cost}
                    onChange={(e) => setNewVendor({ ...newVendor, cost: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Contact Info</label>
                  <input
                    type="text"
                    placeholder="Email or Phone"
                    value={newVendor.contact}
                    onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowVendorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-medium text-sm"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
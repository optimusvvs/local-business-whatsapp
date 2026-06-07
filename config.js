// Firebase Configuration
// Replace these with your Firebase project credentials
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Business Configuration
const businessConfig = {
    name: "YourBusiness",
    whatsappNumber: "919876543210", // WhatsApp number with country code, no + sign
    phone: "+1 234 567 8900",
    address: "123 Main St, Your City, State 12345",
    hours: "9 AM - 9 PM",
    currency: "₹",
    taxRate: 0.05, // 5% tax
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
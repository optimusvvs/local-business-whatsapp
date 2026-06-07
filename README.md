# 🏪 Local Business Website + WhatsApp Orders

A simple, responsive website template for local businesses (cafés, barber shops, salons, food kiosks) to showcase their menu and accept orders directly via WhatsApp.

## ✨ Features

- 🎨 **Clean, Responsive Design** - Works on desktop, tablet, and mobile
- 📱 **WhatsApp Integration** - Send orders directly to WhatsApp with one click
- 🛒 **Shopping Cart** - Add/remove items and calculate totals automatically
- 💾 **Firebase Real-time Database** - Menu items sync instantly
- 👨‍💼 **Admin Panel** - Manage menu items without coding
- 🎯 **Business Info** - Display hours, address, contact info
- 💱 **Multi-currency Support** - Set your preferred currency

## 📁 Project Structure

```
local-business-whatsapp/
├── index.html          # Main website homepage
├── admin.html          # Admin panel for menu management
├── styles.css          # All CSS styling
├── app.js              # Main website JavaScript
├── admin.js            # Admin panel JavaScript
├── config.js           # Firebase & Business configuration
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## 🚀 Quick Start

### 1. Clone the Repo
```bash
git clone https://github.com/optimusvvs/local-business-whatsapp.git
cd local-business-whatsapp
```

### 2. Set Up Firebase

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable **Realtime Database**
4. Copy your Firebase config credentials
5. Open `config.js` and replace the placeholder values with your credentials

### 3. Configure Your Business

In `config.js`, update the business configuration with your details.

### 4. Set Up Firebase Rules

In Firebase Console, set your Realtime Database rules to allow read/write access to menu items.

### 5. Run Locally

Open `index.html` in your browser, or use a local server:

```bash
python -m http.server 8000
```

## 📝 How to Use

### For Customers
1. Browse menu on homepage
2. Add items to cart
3. Click "Checkout on WhatsApp"
4. Confirm and send order

### For Admin
1. Open `admin.html`
2. Add/manage menu items
3. Changes sync instantly

## 🚢 Deployment

- **Vercel** (Recommended) - Import GitHub repo
- **Netlify** - Connect GitHub repo
- **Firebase Hosting** - Deploy with Firebase CLI

## 📄 License

MIT License - Free to use and modify!

---

**Made for local businesses. By developers, for entrepreneurs.**
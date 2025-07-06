# ReCircle Platform - AI-Powered Circular Supply Chain

![ReCircle Banner](https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=400&dpr=2)

ReCircle is an innovative AI-powered circular supply chain platform designed for Walmart's Sparkathon challenge. The platform enables efficient redistribution of surplus and returned items to partner organizations (NGOs, recyclers, and community groups), creating a sustainable circular economy while tracking environmental and social impact.

## 🌟 Key Features

- **Intelligent Item Matching**: AI-powered system to match surplus items with partner needs
- **Real-time Impact Tracking**: Monitor waste diverted, people helped, and environmental benefits
- **Gamified Leaderboard**: Encourage participation through points and rankings
- **Partner Dashboard**: Comprehensive view of available items and claiming capabilities
- **Advanced Filtering**: Find items by category, location, and availability status
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/recircle-platform.git
   cd recircle-platform
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

3. **Set up the Frontend**
   ```bash
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

### Demo Credentials

- **Partner 1**: Username: `ngo1`, Password: `test`
- **Partner 2**: Username: `ngo2`, Password: `test`

## 🏗️ Architecture

### Backend (FastAPI + SQLite)
- **FastAPI**: Modern Python web framework for building APIs
- **SQLite**: Lightweight database for storing items, partners, and claims
- **Pydantic**: Data validation and serialization
- **CORS**: Cross-origin resource sharing for frontend integration

### Frontend (React + TypeScript)
- **React 18**: Modern React with hooks and context
- **TypeScript**: Type-safe JavaScript for better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful icon library
- **React Router**: Client-side routing

## 📊 API Endpoints

### Authentication
- `POST /api/login` - Partner authentication
- `GET /api/partners` - Get all partners for leaderboard

### Items Management
- `GET /api/listings` - Get all available items (with filtering)
- `POST /api/listings` - Create new surplus item listing
- `POST /api/claim` - Claim an available item
- `GET /api/categories` - Get all item categories
- `GET /api/locations` - Get all locations

### Impact Tracking
- `GET /api/impact/{partner_id}` - Get impact metrics for a partner
- `GET /api/dashboard-stats` - Get overall dashboard statistics

## 🎯 Business Value

### For Walmart
- **Waste Reduction**: Divert surplus items from landfills
- **Brand Enhancement**: Demonstrate commitment to sustainability
- **Cost Savings**: Reduce disposal costs and storage overhead
- **Community Impact**: Strengthen relationships with local communities

### For Partners
- **Resource Access**: Get needed items at no cost
- **Impact Tracking**: Measure and communicate social/environmental impact
- **Efficiency**: Streamlined process for item discovery and claiming
- **Recognition**: Gamified system to showcase contributions

## 🌍 Environmental Impact

The platform tracks key environmental metrics:
- **Waste Diverted**: Calculated as item quantity × 0.5 kg
- **Carbon Footprint Reduction**: Preventing new manufacturing
- **Resource Conservation**: Extending product lifecycle
- **Community Benefit**: People helped through redistribution

## 🏆 Gamification System

- **Points System**: Partners earn 10 points per item claimed
- **Leaderboard**: Real-time rankings based on points
- **Impact Badges**: Recognition for environmental milestones
- **Community Challenges**: Seasonal competitions and goals

## 🔧 Development

### Project Structure
```
recircle/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # SQLite database setup
│   ├── models.py            # Pydantic models
│   ├── routes/              # API route handlers
│   └── data/                # Sample data
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── contexts/           # React contexts
│   └── assets/             # Static assets
└── README.md
```

### Running Tests
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

## 📈 Future Enhancements

- **Machine Learning**: Predictive analytics for demand forecasting
- **Mobile App**: Native mobile application for on-the-go access
- **Blockchain**: Transparent tracking of item lifecycle
- **IoT Integration**: Smart sensors for inventory management
- **Advanced Analytics**: Comprehensive reporting and insights

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built with ❤️ for Walmart's Sparkathon challenge by the ReCircle team.

---

**ReCircle** - Transforming surplus into sustainability, one item at a time. 🌱
# 🩸 Blood Bank Management System

A complete MERN Stack (MongoDB, Express, React, Node.js) Blood Bank Management System.

## ✨ Features

✅ User authentication (Signup/Login)
✅ Donor dashboard with donor list
✅ Blood request submission form
✅ Admin dashboard for management
✅ Add/Update/Delete donors
✅ Approve/Reject blood requests
✅ JWT authentication
✅ Password encryption
✅ Responsive design

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14+) - https://nodejs.org/
- MongoDB Atlas Account - https://www.mongodb.com/cloud/atlas
- VS Code - https://code.visualstudio.com/

### Step 1: Create MongoDB Atlas Database

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up and create a free cluster
3. Create a database user (Database Access)
4. Add 0.0.0.0/0 to Network Access (allows all IPs)
5. Get your connection string (Connection → Connect → Application)

### Step 2: Update Backend .env

Edit `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bloodbank?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
ADMIN_EMAIL=admin@bloodbank.com
ADMIN_PASSWORD=Admin@123
```

Replace the MongoDB URI with your connection string.

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
npm run dev
```

Backend will run on http://localhost:5000

### Step 4: Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will run on http://localhost:3000

## 🔓 Login Credentials

**Admin Login:**
- Email: admin@bloodbank.com
- Password: Admin@123

**User Login:**
- Create new account using Sign Up

## 📁 Project Structure

```
blood-bank-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Donor.js
│   │   └── Request.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── donors.js
│   │   └── requests.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── Login.js
    │   │   ├── SignUp.js
    │   │   ├── DonorDashboard.js
    │   │   ├── AdminDashboard.js
    │   │   └── Pages.css
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── public/
    │   └── index.html
    ├── package.json
    └── .env
```

## 🚀 API Endpoints

**Base URL:** http://localhost:5000/api

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user/admin

### Donors
- `GET /donors` - Get all donors (requires auth)
- `POST /donors` - Add donor (admin only)
- `PUT /donors/:id` - Update donor (admin only)
- `DELETE /donors/:id` - Delete donor (admin only)

### Requests
- `GET /requests` - Get all requests (admin only)
- `POST /requests` - Submit blood request (user)
- `PUT /requests/:id` - Approve/Reject request (admin)

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 already in use | Change PORT in backend/.env |
| MongoDB connection error | Verify connection string and network access |
| CORS error | Ensure backend is running on port 5000 |
| Module not found | Run `npm install` again |

## 📞 Features to Test

### As Regular User:
1. Sign up with email/password
2. View all blood donors
3. Submit blood request
4. Select blood type and category
5. Logout

### As Admin:
1. Login with admin credentials
2. Add new donors
3. Delete donors
4. View all requests
5. Approve/Reject requests
6. See request status
7. Logout

## 📚 Technologies Used

- **Frontend:** React, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT, bcryptjs
- **Styling:** CSS3
- **HTTP Client:** Axios

## 📝 Notes

- Update MongoDB URI in backend/.env before running
- Keep both backend and frontend terminals running
- First time setup takes 5-10 minutes
- All code is production-ready

## 🎉 You're all set!

The Blood Bank Management System is ready to use. Follow the setup instructions above and you'll have a fully functional application in minutes!

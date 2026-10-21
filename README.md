# Capstone Project
This is my final capstone project. It will be an inventory management app for nail supplies.
This app will utilize firebase for login and database storage. 
It will connect users to their account with their inventory to match, 
therefore allowing users to have a unique database for their inventory.
Additionally, it will utilize CRUD operations for seamless addition and removal of product information. 
This app will also have search functionality, to find products based on various categories such as product type, when purchased, size, etc. 
The app will be a simple but effective application to store inventory information and easily add or remove items as needed. 
Perfect for managing products.

# Getting Started

Download and unzip folder

# React + Firebase Application

This project is a React application integrated with Firebase services (Authentication, Firestore, etc.). Follow the instructions below to set up and run the project locally.

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org) (v16.x or higher recommended)
*   [npm](https://npmjs.com) (comes pre-packaged with Node.js)
*   A [Firebase Account](https://google.com)

---

## Getting Started

### 1. Clone the Repository
Clone this repository to your local machine using terminal or git bash:
```bash
git clone https://github.com
cd your-repo-name
```

### 2. Install Dependencies
Install the required packages, including React and the Firebase SDK:
```bash
npm install
```

### 3. Set Up Firebase Configuration
You need to connect this app to your own Firebase project.

1. Go to the [Firebase Console](https://google.com).
2. Click **Add project** and follow the prompts to create a new project.
3. In your project dashboard, click the **Web icon (`</>`)** to register a new web app.
4. Copy your project's `firebaseConfig` object. It looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

### 4. Configure Environment Variables
Create a file named `.env` in the **root directory** of this project and paste your Firebase credentials using the format below. 

*(Note: If using Vite instead of Create React App, replace `REACT_APP_` with `VITE_`).*

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here
```

---

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload if you make edits.

### `npm run build`
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.



## Built With
React

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


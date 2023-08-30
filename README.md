# Connect: Social Media Application

![connect-logo](https://github.com/himzz1234/Social-Mern/assets/99206527/fe1430ee-619e-47c2-b7b3-16bc92962dbf)

Welcome to the Connect project repository! Connect is a dynamic social media application built using the MERN (MongoDB, Express.js, React, Node.js) stack along with Socket.io for real-time messaging functionality. This platform enables users to create accounts, connect with others, view posts, send messages, and much more.

🌐 Visit [Connect: Social Media Application](https://letsconnect3.netlify.app/)

## Screenshots

![cmxmczx](https://github.com/himzz1234/Social-Mern/assets/99206527/2f7d954d-1729-4b28-99d7-6c2da087ca02)

## Features
+ Sign up and log in to your personal account.
+ Set up your profile picture, bio, and other details.
+ Follow other users to see their posts on your feed.
+ Share your thoughts by creating posts and seeing posts from users you follow.
+ Seamlessly communicate with other users in real-time using Socket.io.
+ Receive notifications for new likes and comments.
+ Find other users easily with the search feature.
+ Enjoy Connect on various devices with its responsive UI.

## Technologies Used
+ Frontend: React
+ Backend: Node.js, Express.js, MongoDB (Database)
+ Real-time Communication: Socket.io
+ Styling: TailwindCSS
+ Deployment: Netlify (Frontend), Render (Backend)

## Getting Started
### Prerequisites
+ Node.js and npm (Node Package Manager) installed on your machine.
+ MongoDB Atlas account (for database storage).
+ A modern web browser.

### Installation
1. Clone the repository: ```git clone https://github.com/himzz1234/Social-Mern.git```
2. Install frontend dependencies: ```cd client && npm install```
3. Install backend dependencies: ```cd ../api && npm install```

## Configuration
1. Create a .env file in the api directory for backend configuration.
2. Add the following environment variables:

```
MONGO_URL = your-mongodb-connection-string
JWT_SECRET = your-jwt-secret

CLOUD_NAME = "your-cloudinary-name"
CLOUD_KEY = "your-cloudinary-key"
CLOUD_SECRET = "your-cloudinary-secret"
```

3. Modify the frontend API endpoint in the `client/src/axios.js` file
```
const instance = axios.create({
  baseURL: "http://localhost:5000/api",
}); // Change this to your backend URL
```

## Usage
1. Start the backend server: In the api directory, run nodemon index.js.
2. Start the frontend development server: In the client directory, run npm start.
3. Access the app in your browser at http://localhost:3000.

## Contributing
Contributions to `Connect` are welcome and encouraged! If you find any issues or want to enhance the application, feel free to open pull requests.

1. Fork the project repository.
2. Create a new branch.
3. Make your changes and enhancements.
4. Submit a pull request describing your changes.

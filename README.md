# Connect: Social Media Application

![connect-logo](https://github.com/himzz1234/Social-Mern/assets/99206527/fe1430ee-619e-47c2-b7b3-16bc92962dbf)

Welcome to the Connect project repository! Connect is a dynamic social media application built using the MERN (MongoDB, Express.js, React, Node.js) stack along with Socket.io for real-time messaging functionality. This platform enables users to create accounts, connect with others, view posts, send messages, and much more.

## Features
+ Sign up and log in to your personal account.
+ Set up your profile picture, bio, and other details.
+ Follow other users to see their posts on your feed.
+ Share your thoughts by creating posts and see posts from users you follow.
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
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```


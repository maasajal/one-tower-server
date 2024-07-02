# One Tower Server-Side Project Overview

The One Tower server-side project is a robust backend solution that powers the One Tower Building Management System (BMS). This server-side application is built using modern technologies to ensure secure, efficient, and scalable management of building operations.

### [One Tower Client side Repo Link](https://github.com/maasajal/one-tower-client)

## Key Technologies:

- Node.js: A powerful JavaScript runtime built on Chrome's V8 engine, providing an efficient and scalable platform for server-side development.
- Express: A fast and minimalist web framework for building the server and handling routing.
- MongoDB: A NoSQL database for storing user data, apartment details, payment histories, and maintenance requests.
- JWT (jsonwebtoken): For secure authentication and authorization of users.
  Stripe: Integration for secure and efficient handling of rent payments and transactions.
- CORS: Middleware to enable Cross-Origin Resource Sharing, allowing the frontend to communicate with the backend seamlessly.
- Dotenv: For loading environment variables from a .env file to keep sensitive information secure.

## Main Features:

- User Authentication: Secure login and registration using JWT for token-based authentication.
- Payment Processing: Integration with Stripe for secure handling of rent payments.
- Data Management: CRUD operations for managing apartments, users, and maintenance requests.
- API Endpoints: RESTful API endpoints for frontend communication, supporting various functionalities of the BMS.
- Environment Management: Configuration and management of environment variables using dotenv.

This server-side implementation ensures the One Tower project operates efficiently, securely, and seamlessly, providing a reliable backend for the overall Building Management System.

### Run the project on your Local machine

- Clone: `git clone https://github.com/maasajal/one-tower-server.git.git`
- Change Directory: `cd one-tower-server`
- Install packages: `npm i` or `npm install`
- Run: `nodemon index.js` if you don't have nodemon run `node index.js`

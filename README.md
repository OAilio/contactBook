# Contact Book
### NB! There is currently a problem with the input fields that needs to be fixed

Welcome to the Github repo of my first full-stack-project! This is a simple contact management application built as a Single Page Application (SPA) using React on the frontend and Node.js with Express on the backend. The application allows users to manage their contacts by adding, editing, and deleting them. The frontend communicates with the backend RESTful API to perform these operations. The app is hosted by Render.

Link to the app: https://contactbook-51oi.onrender.com/

<img width="960" alt="image" src="https://github.com/OAilio/contactBook/assets/123802300/6fe22ed4-bf22-49ca-adfd-341662f05535">


## Features
* **Search:** Users can filter contacts by name using the search bar at the top.
* **View Contacts:** Contacts are displayed using the Persons component, fetched from a database using the backend API.
* **Add Contact:** Clicking the "+" button in the top bar opens a form to add a new contact. Name and phone number are mandatory fields, while email is optional.
* **Edit Contact:** Each contact has an edit button represented by a pencil icon. Clicking it opens the same form pre-filled with contact details for editing.
* **Delete Contact:** Each contact also has a delete button represented by a trash can icon. Users are prompted for confirmation before deletion.

## Backend API
The backend is implemented using Node.js and Express, connecting to a MongoDB database using Mongoose. Here's a brief overview of the API routes:

* **GET /api/persons** Retrieve all contacts from the database in JSON format.
* **GET /api/persons/:id** Retrieve a specific contact based on ID in JSON format.
* **POST /api/persons** Add a new contact to the database and return the added contact in JSON format.
* **PUT /api/persons/:id** Update a contact's information based on ID and return the updated contact in JSON format.
* **DELETE /api/persons/:id** Delete a contact from the database. Returns HTTP 204 No Content on success.

## Frontend Components
* **Notification:** Displays temporary messages to the user.
* **SearchFilter:** Provides a search bar to filter contacts by name.
* **Persons:** Displays the list of contacts and handles editing and deletion.
* **FormAddNewContact:** Manages the form for adding and editing contacts.
* **App:** The main component that orchestrates the app's functionality.

**Disclaimer:** As this is my first full-stack application, the layout is lacking some responsiveness on smaller devices. Improving the responsiveness is on the to-do list. 

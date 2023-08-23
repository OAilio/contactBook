import { useState, useEffect } from 'react'
import phonebook from './comms/phonebook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch, faPlus, faPen, faTrashAlt, faCircleUser, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { formatPhoneNumber } from './utils';

/**
 * Notification Component to show messages.
 *
 * @param {Object} props - Component props.
 * @param {string|null} props.message - The message to display.
 * @param {function} props.setMessage - Function to set the message state.
 * @returns {JSX.Element|null} - The rendered Notification component.
 */
const Notification = ({ message, setMessage }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className="message">
            <div className="message-content">
                {message}
            </div>
            <button className="ok-button" onClick={() => setMessage(null)}>
                OK
            </button>
        </div>
    );
};

/**
 * SearchFilter Component for filtering contacts by name.
 *
 * @param {Object} props - Component props.
 * @param {function} props.handleSearchChange - Function to handle search input change.
 * @param {string} props.searchInput - Current search input value.
 * @returns {JSX.Element} - The rendered SearchFilter component.
 */
const SearchFilter = ({ handleSearchChange, searchInput }) => {
    return (
        <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
                type="text"
                placeholder="Name..."
                value={searchInput}
                onChange={handleSearchChange}
				className="search-input"
            />
        </div>
    );
};

/**
 * Persons Component to display contact list.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.contacts - List of contacts to display.
 * @param {function} props.setPersons - Function to set the persons state.
 * @param {function} props.showMessage - Function to show messages.
 * @param {function} props.editContact - Function to edit a contact.
 * @returns {JSX.Element} - The rendered Persons component.
 */
const Persons = ({ contacts, setPersons, showMessage, editContact, handleErrorResponse }) => {
     // Define a state to hold confirmation details when deleting a contact.
    const [confirmation, setConfirmation] = useState(null);

    /**
     * Handles the click event when a delete button is clicked.
     * Sets the confirmation state to show the delete confirmation dialog.
     *
     * @param {number} id - The ID of the contact to be deleted.
     * @param {string} name - The name of the contact to be deleted.
     */
    const handleDelete = (id, name) => {
        setConfirmation({
            id,
            name,
        });
    };

    /**
     * Handles the confirmed deletion of a contact.
     * If confirmation exists, performs the delete operation,
     * updates the persons list, and shows a success message.
     * Clears the confirmation state afterward.
     */
    const handleConfirmDelete = () => {
        // Check if there is a confirmation for deletion.
        if (confirmation) {
            // Extract ID and name from the confirmation.
            const { id, name } = confirmation;

            // Perform the delete operation.
            phonebook
                .deleteOp(id)
                .then(() => {
                    // Update the persons list by filtering out the deleted contact.
                    setPersons((prevPersons) =>
                        prevPersons.filter((contact) => contact.id !== id)
                    );

                    // Show a success message indicating the contact was deleted.
                    showMessage(`${name} was successfully deleted!`);
                })
                .catch((error) => {
                    // Handle errors that might occur during the delete operation.
                    handleErrorResponse(error);
                });

            // Clear the confirmation state to close the confirmation dialog.
            setConfirmation(null);
        }
    };

    console.log("render", contacts.length, "persons");
    const zeroResults = contacts.length === 0;

    return (
        <div className="contacts-flexbox">
            <ul className="contacts-list">
                {zeroResults ? (
                    <li className="contact-not-found">The inquiry provided zero results :-(</li>
                ) : (
                    <>
                        {/* Contact list header */}
                        <li className="contact-icons">
                            <span className="icon-text">Name</span>
                            <FontAwesomeIcon icon={faCircleUser} className="person-icon" />
                            <span className="icon-text">Number</span>
                            <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                            <span className="icon-text">E-mail</span>
                            <FontAwesomeIcon icon={faEnvelope} className="mail-icon" />
                        </li>
                        {/* Display each contact */}
                        {contacts
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((contact) => (
                                <li key={contact.id} className="contact-item">
                                    <span className="contact-name">{contact.name}</span>
                                    <span className="contact-number">
                                        <a href={`tel:${contact.number}`} className="link-style">
                                            {formatPhoneNumber(contact.number)}
                                        </a>
                                    </span>
                                    <span className="contact-email">
                                        <a href={`mailto:${contact.email}`} className="link-style">
                                            {contact.email}
                                        </a>
                                    </span>
                                    {/* Button group for edit and delete */}
                                    <div className="button-group">
                                        {/* Edit button */}
                                        <button
                                            onClick={() => editContact(contact)}
                                            className="edit-button"
                                        >
                                            <FontAwesomeIcon icon={faPen} size="xs" />
                                        </button>
                                        {/* Delete button */}
                                        <button
                                            onClick={() => handleDelete(contact.id, contact.name)}
                                            className="delete-button"
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} size="xs" />
                                        </button>
                                    </div>
                                </li>
                            ))
                        }
                    </>
                )}
            </ul>
            {/* Confirmation dialog */}
            {confirmation && (
                <div className="message">
                    <p>{`Are you sure you want to delete contact ${confirmation.name}?`}</p>
                    <div className="button-group">
                        {/* Cancel button */}
                        <button className="cancel-button" onClick={() => setConfirmation(null)}>
                            Cancel
                        </button>
                        {/* Confirm button */}
                        <button className="ok-button" onClick={handleConfirmDelete}>
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
    
};

/**
 * FormAddNewContact Component for adding or editing contacts.
 *
 * @param {Object} props - Component props.
 * @param {function} props.addContact - Function to add a new contact.
 * @param {Object} props.selectedContact - Contact object being edited.
 * @param {string} props.newName - New contact's name.
 * @param {function} props.handleNameChange - Function to handle name input change.
 * @param {string} props.newNumber - New contact's number.
 * @param {function} props.handleNumberChange - Function to handle number input change.
 * @param {string} props.newEmail - New contact's email.
 * @param {function} props.handleEmailChange - Function to handle email input change.
 * @param {boolean} props.showForm - Flag to display the form.
 * @param {function} props.setShowForm - Function to set showForm state.
 * @param {string} props.task - Task type: 'add' or 'edit'.
 * @param {function} props.clearFields - Function to clear form fields.
 * @param {function} props.clearErrorMessages - Function to clear validation error messages.
 * @param {function} props.saveEditedContact - Function to save edited contact.
 * @param {string} props.nameValidationMessage - Validation message for name.
 * @param {string} props.numberValidationMessage - Validation message for number.
 * @param {string} props.emailValidationMessage - Validation message for email.
 * @returns {JSX.Element} - The rendered FormAddNewContact component.
 */
const FormAddNewContact = ({
    addContact,
    selectedContact,
    newName,
    handleNameChange,
    newNumber,
    handleNumberChange,
    newEmail,
    handleEmailChange,
    showForm,
    setShowForm,
    task,
    clearFields,
    clearErrorMessages,
    saveEditedContact,
    nameValidationMessage,
    numberValidationMessage,
    emailValidationMessage
}) => {
    // Determine if the form is for editing an existing contact
    const isEditTask = task === 'edit';
    
    // Determine the heading text based on the task
    const headingText = isEditTask ? 'Edit contact' : 'Add new contact';
    
    // Set initial values for the form fields if editing
    const initialName = isEditTask ? selectedContact.name : '';
    const initialNumber = isEditTask ? selectedContact.number : '';
    const initialEmail = isEditTask ? selectedContact.email : '';

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (isEditTask) {
            saveEditedContact(event); // Call saveEditedContact function for editing
        } else {
            addContact(event); // Call addContact function for adding new contact
        }
    };

    // Handle form cancellation
    const handleCancel = () => {
        clearFields(); // Clear form fields
        clearErrorMessages(); // Clear error messages
        setShowForm(false); // Hide the form
    };

    return (
        <div className="form-container">
            {showForm && (
                <form onSubmit={handleSubmit} className="form-add-new-contact">
                    <div className="form-heading">{headingText}</div>
                    {/* Form fields for name */}
                    <div className="form-field-container">
                        <div className="form-field">
                            <label htmlFor="name">Name*</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="John Appleseed"
                                value={isEditTask ? initialName : newName}
                                onChange={handleNameChange}
                            />
                        </div>
                        {nameValidationMessage && (
                            <div className="validation-message">{nameValidationMessage}</div>
                        )}
                    </div>
                    {/* Form fields for number */}
                    <div className="form-field-container">
                        <div className="form-field">
                            <label htmlFor="number">Number*</label>
                            <input
                                type="text"
                                id="number"
                                placeholder="040 123 4567"
                                value={isEditTask ? initialNumber : newNumber}
                                onChange={handleNumberChange}
                            />
                        </div>
                        {numberValidationMessage && (
                            <div className="validation-message">{numberValidationMessage}</div>
                        )}
                    </div>
                    {/* Form fields for email */}
                    <div className="form-field-container">
                        <div className="form-field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                placeholder="john@example.com"
                                value={isEditTask ? initialEmail : newEmail}
                                onChange={handleEmailChange}
                            />
                        </div>
                        {emailValidationMessage && (
                            <div className="validation-message">{emailValidationMessage}</div>
                        )}
                    </div>
                    {/* Buttons for form submission and cancellation */}
                    <div className="form-button-group">
                        <button className="cancel-button" onClick={handleCancel}>
                            <b>Cancel</b>
                        </button>
                        <button className="ok-button" type="submit">
                            <b>Save</b>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

const App = () => {
    // State variables
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [message, setMessage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [nameValidationMessage, setNameValidationMessage] = useState('');
    const [numberValidationMessage, setNumberValidationMessage] = useState('');
    const [emailValidationMessage, setEmailValidationMessage] = useState('');

    // Fetch initial data from the server
    useEffect(() => {
        console.log('effect');
        phonebook
            .getAll()
            .then(response => {
                console.log('promise fulfilled', response.data);
                setPersons(response.data);
            });
    }, []);

    // Function to add a new contact
    const addContact = (event) => {
        event.preventDefault();
        // Create a new personObject
        const personObject = {
            name: newName,
            number: newNumber,
            email: newEmail,
            id: persons.length + 1,
        };
        
        // Validate the new contact
        const validationMessage = validateContact(personObject);
    
        if (validationMessage) {
            console.log('Validation failed')
            return; // Validation failed, return
        }
    
        // Check if the contact already exists
        if (persons.some((person) => person.name === newName)) {
            alert(`Contact ${newName} already exists!`);
            return; // Contact already exists, return
        }
        
        // Add the new contact to the server and update the state
        console.log(personObject);
        phonebook
            .add(personObject)
            .then((response) => {
                // Fetch the updated list of contacts from the server
                phonebook.getAll().then((response) => {
                    setPersons(response.data);
                    clearFields();
                    setShowForm(false);
                    showMessage(`${newName} was successfully added to contacts!`);
                });
                console.log(response);
            })
            .catch((error) => {
                handleErrorResponse(error);
            });
    };

    // Validation function for a contact
    const validateContact = (contact) => {
        // Validation messages for different fields
        let nameMessage = '';
        let numberMessage = '';
        let emailMessage = '';

        // Validation logic for name, number, and email
        if (contact.name.length === 0) {
            nameMessage = 'Name is a mandatory field!'
        } else if (contact.name.length < 3) {
            nameMessage = 'Name must be at least 3 characters long!';
        }

        if (contact.number.length === 0) {
            numberMessage = "Number is a mandatory field!";
        } else if (!/^[0-9+\-()\s#*]+$/.test(contact.number)) {
            numberMessage = 'Invalid phone number format!';
        }
    
        if (contact.email && !/^\S+@\S+\.\S+$/.test(contact.email)) {
            emailMessage = 'Invalid email format!';
        }
        
        // Update validation state and return message if validation failed
        setNameValidationMessage(nameMessage);
        setNumberValidationMessage(numberMessage);
        setEmailValidationMessage(emailMessage);
    
        if (nameMessage || numberMessage || emailMessage) {
            return 'Validation failed'; // Return a general validation failure message
        }
    
        return null; // Validation successful
    };

    // Function to set up contact editing
    const editContact = (contact) => {
        setSelectedContact(contact); // Pass the entire contact object
        setShowForm(true); // Show the form when editing
    };

    // Function to save an edited contact
    const saveEditedContact = (event) => {
		event.preventDefault();
	
		// Create an updated contact object with the edited values
        const updatedContact = {
            ...selectedContact,
            name: event.target.name.value,
            number: event.target.number.value,
            email: event.target.email.value,
        };

        // Validate the updated contact
        const validationMessage = validateContact(updatedContact);

        if (validationMessage) {
            return; // Validation failed, return
        }

		console.log(updatedContact.id)

        // Update the contact on the server and update the state
		phonebook
			.saveOp(updatedContact.id, updatedContact)
			.then((data) => {
				// Update the contact in the list of persons
                updatePersonInList(data);
                setSelectedContact(null); // Clear the selected contact
                clearFields(); // Clear the form fields
                setShowForm(false); // Hide the form
                showMessage("Contact saved!"); // Show success message
			})
			.catch((error) => {
				console.log(error);
			});
	};

    // Clears the input fields for name, number, and email
    const clearFields = () => {
        setNewName("");
        setNewNumber("");
        setNewEmail("");
    };
    
    // Clears the error validation messages
    const clearErrorMessages = () => {
        setNameValidationMessage('')
        setNumberValidationMessage('')
        setEmailValidationMessage('')
    }

    // Displays a temporary message to the user
    const showMessage = (message) => {
        setMessage(message); // Set the message to show
        setTimeout(() => {
            setMessage(null); // Clear the message after a timeout
        }, 10000); // Timeout duration: 10 seconds
    };

    // Handles error responses from the server
    const handleErrorResponse = (error) => {
        console.log(error.response.data); // Log the error response data
        showMessage(error.response.data.error); // Show the error message to the user
        clearFields(); // Clear input fields
        setTimeout(() => {
            setMessage(null); // Clear the message after a timeout
        }, 5000); // Timeout duration: 5 seconds
    };

    // Updates a person's information in the list of persons
    const updatePersonInList = (updatedPerson) => {
        setPersons((prevPersons) =>
            prevPersons.map((person) =>
                person.id === updatedPerson.id ? { ...person, ...updatedPerson } : person
            )
        );
    };

    // Handles changes in the name input field
    const handleNameChange = (event) => {
		event.preventDefault();
		console.log(event.target.value);
		
		if (selectedContact) {
			// If editing, update the selectedContact's name
			const updatedContact = { ...selectedContact, name: event.target.value };
			setSelectedContact(updatedContact);
		} else {
			// If adding new contact, update the newName state
			setNewName(event.target.value);
		}
	};
    // Handles changes in the number input field
	const handleNumberChange = (event) => {
		event.preventDefault();
		console.log(event.target.value);
	
		if (selectedContact) {
			// If editing, update the selectedContact's number
			const updatedContact = { ...selectedContact, number: event.target.value };
			setSelectedContact(updatedContact);
		} else {
			// If adding new contact, update the newNumber state
			setNewNumber(event.target.value);
		}
	};

    // Handles changes in the email input field
	const handleEmailChange = (event) => {
		event.preventDefault();
		console.log(event.target.value);
	
		if (selectedContact) {
			// If editing, update the selectedContact's email
			const updatedContact = { ...selectedContact, email: event.target.value };
			setSelectedContact(updatedContact);
		} else {
			// If adding new contact, update the newEmail state
			setNewEmail(event.target.value);
		}
	};

    // Handles changes in the search input field
    const handleSearchChange = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        setSearchInput(event.target.value);
    };

    // Handles a click event to add a new contact
    const handleNewContactClick = () => {
        setSelectedContact(null);
        setShowForm(true);
    };

    // Filter the persons based on search input
    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchInput.toLowerCase()));

    return (
        <>
            {/* Page Header */}
            <h1>CONTACT BOOK</h1>
    
            {/* Search Bar and New Contact Button */}
            <div className="bar-container">
                <div className="bar">
                    <h2>Your contacts</h2>
                    {/* Search Filter Component */}
                    <SearchFilter handleSearchChange={handleSearchChange} searchInput={searchInput}/>
                    {/* Button to Add New Contact */}
                    <button onClick={handleNewContactClick} className="new-button">
                        <FontAwesomeIcon icon={faPlus} size="xs" />
                    </button>
                </div>
            </div>
    
            {/* Contact List */}
            <div className="content">
                {/* Render the Persons Component */}
                <Persons
                    contacts={filteredPersons}
                    setPersons={setPersons}
                    showMessage={showMessage}
                    editContact={editContact}
                    handleErrorResponse={handleErrorResponse}
                />
            </div>
    
            {/* New Contact Form */}
            {showForm && (
                <div className={`container ${showForm ? 'dimmed-background' : ''}`}>
                    {/* Render the FormAddNewContact Component */}
                    <FormAddNewContact
                        addContact={addContact}
                        selectedContact={selectedContact}
                        newName={newName}
                        handleNameChange={handleNameChange}
                        newNumber={newNumber}
                        handleNumberChange={handleNumberChange}
                        newEmail={newEmail}
                        handleEmailChange={handleEmailChange}
                        showForm={showForm}
                        setShowForm={setShowForm}
                        task={selectedContact ? 'edit' : 'add'}
                        clearFields={clearFields}
                        clearErrorMessages={clearErrorMessages}
                        saveEditedContact={saveEditedContact}
                        nameValidationMessage={nameValidationMessage}
                        numberValidationMessage={numberValidationMessage}
                        emailValidationMessage={emailValidationMessage}
                    />
                </div>
            )}
    
            {/* Notification Component */}
            <Notification 
                message={message}
                setMessage={setMessage}
            />
        </>
    );
};

export default App;

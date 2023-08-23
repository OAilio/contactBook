/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/api/persons';

// Fetches all contacts from the server.
const getAll = () => {
	return axios.get(baseUrl);
};

// Adds a new contact to the server.
const add = newObject => {
	const request = axios.post(baseUrl, newObject);
	return request.then(response => response.data);
};

// Deletes a contact with the specified id from the server.
const deleteOp = (id) => {
	const request = axios.delete(`${baseUrl}/${id}`);
	return request.then(response => response.data);
};

// Updates a contact's information on the server.
const saveOp = (id, updatedContact) => {
	const request = axios.put(`${baseUrl}/${id}`, updatedContact);
	return request.then(response => response.data);
};

// Exports the functions as an object for use in other modules.
export default {
	getAll: getAll,
	add: add,
	deleteOp: deleteOp,
	saveOp: saveOp
};
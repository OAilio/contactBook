import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
	return axios.get(baseUrl)
}

const add = newObject => {
	const request = axios.post(baseUrl, newObject)
	return request.then(response => response.data)
}

const deleteOp = (id) => {
	const request = axios.delete(`${baseUrl}/${id}`)
	return request.then(response => response.data)
}

export default {
	getAll: getAll,
	add: add,
	deleteOp : deleteOp
}
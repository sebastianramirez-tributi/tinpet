import axios from '../../config/axios-api'

export const getPersons = () => axios.get('/persons')

export const postPerson = (person) => axios.post('/persons', person)

export const putPerson = ({ id, ...person }) =>
  axios.put(`/persons/${id}`, person)

export const deletePerson = (id) => axios.delete(`/persons/${id}`)

export const postFiling = (filing) => axios.post('/filings', filing)

export const patchFiling = ({ id, ...body }) =>
  axios.patch(`/filings/${id}`, body)

export const patchProFiling = ({ id, ...body }) =>
  axios.patch(`/filings/${id}/pro-data`, body)

export const deleteFiling = (id) => axios.delete(`/filings/${id}`)

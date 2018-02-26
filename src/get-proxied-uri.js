import axios from 'axios';
export default async function (uri) {
  return axios.get(`https://cors-anywhere.herokuapp.com/${uri}`);
}
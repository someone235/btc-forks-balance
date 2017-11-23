import axios from 'axios';
export default async function (uri) {
  return axios.get(`https://galvanize-cors-proxy.herokuapp.com/${uri}`);
}
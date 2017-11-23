import axios from 'axios';
export default async function (uri) {
  const encodedUri = encodeURIComponent(uri);
  const { data: { body } } = await axios.get(`http://cors-proxy.htmldriven.com/?url=${encodedUri}`);
  return { data: JSON.parse(body) };
}
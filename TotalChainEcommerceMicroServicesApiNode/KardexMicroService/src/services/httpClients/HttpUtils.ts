import axios from 'axios';
export function getAuthHeaders() {
  const token = process.env.JWT_KEY || '';
  return { headers: { Authorization: `Bearer ${token}` } };
}
export { axios };

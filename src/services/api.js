import axios from 'axios'

const BASE_URL = 'https://api.oluwasetemi.dev'

export async function fetchPosts() {
  const res = await axios.get(`${BASE_URL}/posts`)
  return Array.isArray(res.data) ? res.data : res.data?.data || []
}

export async function fetchPostById(id) {
  const res = await axios.get(`${BASE_URL}/posts/${id}`)
  return res.data
}
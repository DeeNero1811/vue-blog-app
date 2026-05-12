import axios from 'axios'

const BASE_URL = 'https://api.oluwasetemi.dev'

export async function fetchPosts() {
  try {
    const res = await axios.get(`${BASE_URL}/posts`)
    return Array.isArray(res.data) ? res.data : res.data?.data || []
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function fetchPostById(id) {
  try {
    const res = await axios.get(`${BASE_URL}/posts/${id}`)
    return res.data
  } catch (err) {
    console.error(err)
    return null
  }
}
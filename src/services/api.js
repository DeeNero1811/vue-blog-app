const BASE_URL = 'https://api.oluwasetemi.dev'

export async function fetchPosts() {
  const res = await fetch(`${BASE_URL}/posts`)

  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }

  return res.json()
}

export async function fetchPost(idOrSlug) {
  const res = await fetch(`${BASE_URL}/posts/${idOrSlug}`)

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.message || 'Post not found')
  }

  return data
}
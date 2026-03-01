// Make API Request

// create typescript interface for user
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  totalLikes: number;
  totalRead: number;
}

export interface Forum {
  id: string;
  slug: string;
  description: string;
}

const API_URL = 'https://awf-api.lvl99.dev';
const USERNAME = 'ksandhu1054';
const PASSWORD = '8821054';
// Authenticate first and store JWT Token
export function authenticate() {
  // log authentication
  console.log('Authenticating...');
  // /auth/login
  return fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  })
    .then(response => response.json())
    .then(data => {
      if (!data.error) {
        console.log('Authentication successful');
        localStorage.setItem('token', data.access_token);
      } else {
        console.log('Authentication failed');
      }
    });
}


// Helper function to handle auth and automatic retries
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  // Try authenticating if there is no token
  if (!localStorage.getItem('token')) {
    await authenticate();
  }

  // Construct headers recursively 
  const getHeaders = () => ({
    ...options.headers,
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  let response = await fetch(url, { ...options, headers: getHeaders() });

  // If token is expired or unauthorized, automatically re-authenticate and retry!
  if (response.status === 401) {
    console.log('Token expired or invalid. Re-authenticating...');
    localStorage.removeItem('token');
    await authenticate();
    // Retry the exact same request with the fresh token
    response = await fetch(url, { ...options, headers: getHeaders() });
  }

  return response;
}

export async function getUserProfile(): Promise<User> {
  return fetchWithAuth(`${API_URL}/auth/profile`)
    .then(response => response.json())
    .then(data => {
      if (data.error || data.statusCode === 401) {
        throw new Error('Failed to fetch user profile');
      }
      
      console.log('User profile fetched successfully');
      return data as User;
    });
}


export async function getPostsBySlug(slug: string, sortBy: string, limit: number): Promise<Post[]> {
  console.log('Fetching posts...');

  const url = `${API_URL}/forums/${slug}?sortBy=${sortBy}&limit=${limit}`;
  
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return fetchWithAuth(url, options)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error('Failed to fetch posts');
      }
      
      console.log(`Posts fetched successfully`);
      
      // Ensure we always return an array (Promise<Post[]>)
      return data as Post[];
    }); 
}


export async function getForums(): Promise<Forum[]> {
  console.log('Fetching forums...');

  const url = `${API_URL}/forums`;
  
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return fetchWithAuth(url, options)
    .then(response => response.json())
    .then(data => {
      if (data.error || !Array.isArray(data)) {
        throw new Error(data.message || 'Failed to fetch forums');
      }
      
      console.log(`Forums fetched successfully`);
      
      // Ensure we always return an array (Promise<Forum[]>)
      return data as Forum[];
    }); 
}

export async function getPosts(ids: string[]): Promise<Post[]> {
  if (!ids || ids.length === 0) return [];
  console.log('Fetching posts by IDs...', ids);

  const isSingle = ids.length === 1;
  const url = isSingle ? `${API_URL}/posts/${ids[0]}` : `${API_URL}/posts`;
  
  const options: RequestInit = {
    method: isSingle ? 'GET' : 'POST',
    headers: {
      ...(!isSingle && { 'Content-Type': 'application/json' })
    },
    ...(!isSingle && { body: JSON.stringify({ ids }) })
  };

  return fetchWithAuth(url, options)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error('Failed to fetch posts');
      }
      
      console.log(`Post${isSingle ? '' : 's'} fetched successfully`);
      
      return (isSingle ? [data] : data) as Post[];
    });
}

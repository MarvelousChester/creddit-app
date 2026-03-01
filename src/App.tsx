import './App.css'
import { useEffect } from 'react'
import { getUserProfile } from './api/requests'
import { useState } from 'react'
import type { User, Post } from './api/requests'
import { Header } from './components/Header'
import { ForumView } from './components/ForumView'
import { FavouritesView } from './components/FavouritesView'
import { ForumPosts } from './components/ForumPosts'
import { getPostsBySlug } from './api/requests'
function App() {

  // Fetch User profile and pass to header
  const [user, setUser] = useState<User>({} as User);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserProfile();
        setUser(fetchedUser);
        console.log('Fetched User:', fetchedUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    
    fetchUser();
  }, []);

  const [favouritePostIds, setFavouritePostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('favouritePostIds');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavourite = (postId: string) => {
    setFavouritePostIds(prev => {
      let newFavourites;
      if (prev.includes(postId)) {
        newFavourites = prev.filter(id => id !== postId);
      }
      else {
        newFavourites = [...prev, postId];
      }
      localStorage.setItem('favouritePostIds', JSON.stringify(newFavourites));
      return newFavourites;
    });
  };
  // SetViewForum would then call getPostsBySlug and set the posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [viewForum, setViewForum] = useState<string | null>(null);

  useEffect(() => {
    if (viewForum) {
      getPostsBySlug(viewForum, 'hot', 10)
        .then(fetchedPosts => {
          setPosts(fetchedPosts);
          console.log('Fetched Posts:', fetchedPosts);
        })
        .catch(error => {
          console.error('Failed to fetch posts:', error);
        });
    }
  }, [viewForum]);

  return (
    <div className="app-container">
      <Header firstName={user?.firstName || "not-authenticated"} lastName={user?.lastName || ""} />
    
      <main className="app-content">
        {viewForum ? (
          <div className="forum-posts-container">
            <button onClick={() => setViewForum(null)}>Back to Forums</button>
            <ForumPosts slug={viewForum} posts={posts} favouritePostIds={favouritePostIds} onToggleFavourite={toggleFavourite} />
          </div>
        ) : (
          <>
            <div className="forum-column">
              <ForumView onSelectForum={setViewForum} />
            </div>
            <div className="favourites-sidebar">
              <FavouritesView favouritePostIds={favouritePostIds} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App

import './FavouritesView.css';
import { useState, useEffect } from 'react';
import { getPosts, type Post } from '../api/requests';

export function FavouritesView({ favouritePostIds }: { favouritePostIds: string[] }) {
  const [favouritePosts, setFavouritePosts] = useState<Post[]>([]);

  useEffect(() => {
    let active = true;
    if (favouritePostIds && favouritePostIds.length > 0) {
      getPosts(favouritePostIds)
        .then(posts => {
          if (active) setFavouritePosts(posts);
        })
        .catch(err => console.error('Failed to fetch favourite posts', err));
    } else {
      Promise.resolve().then(() => {
        if (active) setFavouritePosts([]);
      });
    }
    return () => {
      active = false;
    };
  }, [favouritePostIds]);

  return (
    <div className="favourites-view">
      <h2>Favourites</h2>
      {favouritePosts && favouritePosts.length > 0 ? (
        <ul>
          {favouritePosts.map((post: Post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      ) : (
        <p>Add a post to favourite to see it here!</p>
      )}
    </div>
  );
}

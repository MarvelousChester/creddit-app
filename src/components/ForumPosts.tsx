import type { Post } from '../api/requests';

export function ForumPosts({ slug, posts, favouritePostIds, onToggleFavourite }: { slug: string, posts: Post[], favouritePostIds: string[], onToggleFavourite: (postId: string) => void }) {
  return (
    <div className="forum-posts">
      <h2>Posts for {slug} sorted by hot</h2>
      {/* map through posts and display them */}
      {posts.map(post => (
        <div key={post.id} className="post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>Likes: {post.totalLikes}</p>
          <p>Read: {post.totalRead}</p>
          <p>Author: {post.author}</p>
          <p>Created At: {post.createdAt}</p>
          {favouritePostIds.includes(post.id) ? (
            <button onClick={() => onToggleFavourite(post.id)}>Remove from Favourites</button>
          ) : (
            <button onClick={() => onToggleFavourite(post.id)}>Add to Favourites</button> 
          )}
        </div>
      ))}
    </div>
  );
}
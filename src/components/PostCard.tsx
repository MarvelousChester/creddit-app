import './PostCard.css';
import type { Post } from '../api/requests';

export function PostCard({ post }: { post: Post }) {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>Likes: {post.totalLikes}</p>
      <p>Read: {post.totalRead}</p>
      <p>Author: {post.author}</p>
      <p>Created At: {post.createdAt}</p>
    </div>
  );
}

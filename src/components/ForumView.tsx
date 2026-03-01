import './ForumView.css';
import { useEffect } from 'react';
import { getForums } from '../api/requests';
import { useState } from 'react';
import type { Forum } from '../api/requests';

export function ForumView({ onSelectForum }: { onSelectForum: (slug: string) => void }) {

  const [forums, setForums] = useState<Forum[]>([]);
  // get forum
  useEffect(() => {
    getForums()
      .then(fetchedForums => {
        if (Array.isArray(fetchedForums)) {
          setForums(fetchedForums);
        }
        console.log('Fetched Forums:', fetchedForums);
      })
      .catch(error => {
        console.error('Error fetching forums:', error);
      });
  }, []);
  
  return (
    <div className="forum-view">
       {/* map through forums and display them */}
       {forums.map(forum => (
         <div key={forum.id} className="forum">
           <h2>{forum.slug}</h2>
           <p>{forum.description}</p>
           <button onClick={() => onSelectForum(forum.slug)}>View Forum</button>
         </div>
       ))}
    </div>
  );
}

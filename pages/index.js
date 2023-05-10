import PostFeed from '../components/PostFeed';
import Loader from '../components/Loader';
import { firestore, fromMillis, postToJSON } from '../lib/firebase';

import { useState } from 'react';

// Max post to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = firestore
  // Get subcollection records as well
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  // Set as state as might fetch other posts
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    // Needs to be a firestore timestamp if it is a number
    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
      <main>
        <PostFeed posts={posts} />

        {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

        <Loader show={loading} />

        {postsEnd && 'You have reached the end!'}
      </main>
  );
}
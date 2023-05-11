import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

import ImageUploader from '../../components/ImageUploader';

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
        <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  // See if is preview or not
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
  const [post] = useDocumentData(postRef);

  return (
    <main className={styles.container}>
      {/* See if post is ready */}
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
          <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  // When on Change, will re-render
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    formState, 
  } = useForm({ defaultValues, mode: 'onChange' });

  const { isValid, isDirty, errors } = formState;
  // Update the form in Firestore
  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!')
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      {/* See if we are in Preview Mode or not */}
      <div className={preview ? styles.hidden : styles.controls}>

        <ImageUploader />
  
      <textarea name="content" {...register("content", {
            required: true
          })}>
      </textarea>
      {errors.content && <p className="text-danger">{errors.content.message}</p>}

        <fieldset>
          <input className={styles.checkbox} name="published" type="checkbox" {...register('published')} />
          <label>Published</label>
        </fieldset>

        <button type="submit" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  );
}
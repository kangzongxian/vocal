// Index.js is the content to render for /admin route in this case
import AuthCheck from '../../components/AuthCheck';


export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>

      </AuthCheck>
    </main>
  );
}
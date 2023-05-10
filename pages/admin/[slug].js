// Using [slug] means it is dynamic

import Metatags from "@/components/Metatags";

// E.g Can render /admin/hello or /admin/tesla
export default function AdminPostEdit({ }) {
  return (
    <main>
      <Metatags title="admin page" />
      <h1>Edit Post</h1>
    </main>
  )
}
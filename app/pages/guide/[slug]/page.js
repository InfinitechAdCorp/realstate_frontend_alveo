"use client"
import Directory from "../../pathDirectory"; // Assuming this is a correct path

export default function BlogPost({ params }) {
  const { slug } = params; // Extract slug from params

  const posts = {
    alveobuyingguide: {
      title: "ABOUT ALVEO",
      content: "ALVEOLAND",
      layout: <div>Your custom layout for CommTalk</div>,
      currentLocation: 'GUIDE',
      specificLocation: ''
    },
    terms: {
      title: "CommTalk Service",
      content: "Details about the CommTalk service.",
      layout: <div>Your custom layout for CommTalk</div>,
      currentLocation: 'GUIDE',
      specificLocation: 'TERMS AND CONDITION'
    },
    privacy: {
      title: "Contact Us",
      content: "Reach out to us through our contact form.",
      layout: <div>Your custom layout for Contact Us</div>,
      currentLocation: 'GUIDE',
      specificLocation: 'PRIVACY POLICY'
    },
  };

  const post = posts[slug] || { title: "Post Not Found", content: "This post does not exist." };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <Directory currentLocation={post.currentLocation} specificLocation={post.specificLocation} />
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {post.layout}
    </div>
  );
}

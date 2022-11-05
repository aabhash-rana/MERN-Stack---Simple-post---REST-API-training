import React, { useState } from "react";
import { useEffect } from "react";
import "./App.css";

function App() {
  // Data of Text Area
  const [posts, setPosts] = useState("");
  // Refresh state
  const [refresh, setRefresh] = useState(false);
  // Data from the backend
  const [data, setData] = useState([]);

  // Text area change handler
  const onChangeHandler = (e) => {
    const { value } = e.target;
    setPosts(value);
  };

  // Button click handler
  const clickHandler = async () => {
    // Send a POST request to the backend
    const response = await fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: posts }),
    });

    if (response.status === 200) {
      // If the post was created successfully, refresh the page
      setRefresh(!refresh);
    }

    // Clear the text area
    setPosts("");
  };

  // Delete post handler
  const handleDelete = async (e) => {
    // Get the id of the post
    const id = e.target.parentElement.parentElement.id;

    // Send a DELETE request to the backend
    const response = await fetch(`http://localhost:3001/posts/${id}`, {
      method: "DELETE",
    });

    if (response.status === 200) {
      // If the post was deleted successfully, refresh the page
      setRefresh(!refresh);
    }
  };

  // Get all posts from the backend
  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts");
    const data = await response.json();
    setData(data.data);
  };

  useEffect(() => {
    getPosts();
  }, [refresh]);

  return (
    <div className="react-app-component text-center">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Enter your post</label>

                  <textarea
                    className="form-control"
                    id="post-content"
                    rows="3"
                    onChange={onChangeHandler}
                    value={posts}
                  ></textarea>

                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      onClick={clickHandler}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {data.map((post) => (
              <div
                className="card text-white bg-dark my-3 text-start"
                id={post._id}
              >
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">
                    {new Date(post.createdAt.split("R")[0]).toLocaleString(
                      "en-US"
                    )}
                  </h6>
                  <p className="card-text">{post.content}</p>
                  <a href="#" className="card-link" onClick={handleDelete}>
                    Delete
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

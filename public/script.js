const API_URL = "https://ssvt-media.onrender.com";


// Upload new media
async function uploadMedia() {
  const url = document.getElementById("url").value.trim();
  const type = document.getElementById("type").value;

  if (!url) return alert("Please enter a valid URL");

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, type }),
  });

  const data = await res.json();
  alert(data.message);
  fetchMedia();
}

// Fetch media for both uploader & viewer
async function fetchMedia() {
  const res = await fetch(`${API_URL}/media`);
  const media = await res.json();
  const container = document.getElementById("mediaList");

  container.innerHTML = "";

  media.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("media-item");

    if (item.type === "image") {
      const img = document.createElement("img");
      img.src = item.url;
      div.appendChild(img);
    } else {
      const video = document.createElement("video");
      video.src = item.url;
      video.controls = true;
      div.appendChild(video);
    }

    // Delete button only on uploader page
    if (window.location.pathname.includes("uploader.html")) {
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.className = "delete-btn";
      del.onclick = () => deleteMedia(item._id);
      div.appendChild(del);
    }

    container.appendChild(div);
  });
}

// Delete media
async function deleteMedia(id) {
  if (!confirm("Are you sure you want to delete this media?")) return;

  const res = await fetch(`${API_URL}/media/${id}`, { method: "DELETE" });
  const data = await res.json();
  alert(data.message);
  fetchMedia();
}

fetchMedia();


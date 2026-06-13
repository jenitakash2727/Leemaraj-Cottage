import React, { useEffect, useState } from "react";
import "./Practics.css";

function Practics() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const API_BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/gallery/`)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.log(err));
  }, []);

  // FILTER LOGIC
  const filteredImages =
    filter === "all"
      ? images
      : images.filter((img) => img.category === filter);

  return (
    <div className="page">

      {/* TITLE */}
      <h1 className="heading">Cottage Gallery</h1>

      {/* CATEGORY BUTTONS */}
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("bedroom")}>Bedroom</button>
        <button onClick={() => setFilter("kitchen")}>Kitchen</button>
        <button onClick={() => setFilter("lounge")}>Lounge</button>
        <button onClick={() => setFilter("dining")}>Dining</button>
        <button onClick={() => setFilter("parking")}>Parking</button>
      </div>

      {/* GALLERY */}
      <div className="gallery">
        {filteredImages.map((img, index) => (
          <div className="card" key={index} onClick={() => setSelected(img)}>
            <img src={img.url.startsWith("http") ? img.url : `${API_BASE_URL}${img.url}`} alt={img.title} />
            <p>{img.display_category}</p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <div className="modal-left">
              <img src={selected.url.startsWith("http") ? selected.url : `${API_BASE_URL}${selected.url}`} alt="" />
            </div>

            <div className="modal-right">
              <h2>{selected.title}</h2>

              <p><b>Category:</b> {selected.display_category}</p>
              <p><b>Description:</b> {selected.description}</p>
              <p><b>Size:</b> {selected.size}</p>
              <p><b>Capacity:</b> {selected.capacity}</p>
              <p><b>Price:</b> {selected.price}</p>

              <div>
                <b>Features:</b>
                <ul>
                  {selected.features?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <button onClick={() => setSelected(null)}>Close</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Practics;
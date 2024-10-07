import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import PanoramaViewer from "../../components/viewPanoramic/PanoramaViewer";
import "./panoramicPage.scss"; // Add this line to include your styling

const PanoramicPage = () => {
  const { id } = useParams();
  const [panoramics, setPanoramics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanoramics = async () => {
      try {
        const response = await apiRequest.get(`/panoramic/${id}/images`); // Adjust endpoint as needed
        setPanoramics(response.data.panoramics); // Adjust according to your API response
      } catch (error) {
        console.error("Error fetching panoramics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPanoramics();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="panoramicPage">
      <h1>360° Panoramic Images</h1>
      <div className="panoramicContainer">
        {panoramics.length === 0 ? (
          <p>No panoramic images available for this house.</p>
        ) : (
          panoramics.map((panoramic, index) => (
            <div key={index} className="panoramicWrapper">
              {/* Directly show the PanoramaViewer without needing a click */}
              <PanoramaViewer panoramicUrl={panoramic} />
              <p>Panoramic View {index + 1}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PanoramicPage;

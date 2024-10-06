import "./modelPage.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import ModelViewer from "../../components/viewModel/ModelViewer";
import { QRCodeCanvas } from "qrcode.react";

const ModelsPage = () => {
  const { id } = useParams();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const localIpUrl = "http://192.168.0.203:8800";

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await apiRequest.get(`/models/${id}/models`); // Update the endpoint here
        setModels(response.data.models);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="modelsPage">
        <h1>3D Models for the House</h1>
        <div className="modelsContainer">
          {models.length === 0 ? (
            <p>No models available for this house.</p>
          ) : (
            models.map((model, index) => (
              <div key={index} className="modelWrapper">
                <ModelViewer modelUrl={model} />
                <p>Model {index + 1}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div>
      <div className="qrCodeContainer" style={{ textAlign: "center" }}>
        <QRCodeCanvas value={localIpUrl} size={128} />
        <p>Scan the QR code to view in AR</p>
      </div>
      </div>
     
    </>
  );
};

export default ModelsPage;

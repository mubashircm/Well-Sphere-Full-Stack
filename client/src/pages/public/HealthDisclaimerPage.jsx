import Breadcrumb from "../../components/ui/Breadcrumb.jsx";

function HealthDisclaimerPage() {
  return (
    <section className="page-section page-section--narrow">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Health Disclaimer" }]} />
      <p className="eyebrow">Important information</p>
      <h1>Health disclaimer</h1>
      <p>
        WellSphere provides general health education and evidence-aware wellness guidance only. It does not diagnose medical conditions, provide individualized clinical prescriptions, replace professional consultation with a licensed doctor, or offer emergency medical treatment.
      </p>
      <p>
        If you believe you are experiencing a medical emergency or severe, worsening symptoms, please seek immediate assistance from a qualified physician or your local emergency health service.
      </p>
    </section>
  );
}

export default HealthDisclaimerPage;

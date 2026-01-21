// ExpiryAlert.jsx
export default function ExpiryAlert({ product }) {
  return (
    <div style={{ color: "red", border: "1px solid red", padding: 10 }}>
      ⚠️ {product.name} – Expiring Soon
    </div>
  );
}

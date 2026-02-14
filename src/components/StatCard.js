function StatCard({ title, value }) {
  return (
    <div style={{
      background:"#fff",
      padding:"20px",
      borderRadius:"12px",
      boxShadow:"0 5px 15px rgba(0,0,0,0.1)",
      flex:1,
      margin:"10px"
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default StatCard;

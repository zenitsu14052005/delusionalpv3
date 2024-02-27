import { ClusterManager } from "discord-hybrid-sharding";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const manager = new ClusterManager(`./src/cold.js`, {
  totalShards: "auto",
  shardsPerClusters: 2,
  totalClusters: "auto",
  mode: 'process',
  token: 'token',
});
manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn({ timeout: -1 });
app.get('/', (req, res) => {
  const message = `Delusional Prime is online and ready to serve`;
  res.send(message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

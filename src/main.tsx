
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import ExternalLinksEffect from "./app/lib/ExternalLinksEffect";

  createRoot(document.getElementById("root")!).render(
    <>
      <ExternalLinksEffect />
      <App />
    </>
  );
  
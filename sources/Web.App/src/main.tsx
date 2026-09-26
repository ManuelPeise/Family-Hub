import { createRoot } from "react-dom/client";
import AppStart from "src/lib/appStart/AppStart";
import "src/lib/localization/i18n";
import "src/root.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found.");
}

createRoot(rootElement).render(<AppStart />);

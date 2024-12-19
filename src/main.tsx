import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import App from "./App.tsx";
import "./index.css";

// Initialize PostHog
posthog.init(import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY as string, {
    api_host:
        import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST ||
        "https://us.i.posthog.com",
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PostHogProvider client={posthog}>
            <App />
        </PostHogProvider>
    </StrictMode>
);

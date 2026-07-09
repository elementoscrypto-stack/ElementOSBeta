import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.jsx";

/**
 * ElementOS production-safe React entrypoint.
 *
 * If the site flashes and then goes blank, Vite probably built successfully
 * but React crashed in the browser. This runtime guard replaces the blank page
 * with the exact error message and stack trace.
 */

const ELEMENTOS_BOOT_VERSION = "ElementOS Runtime Guard v1.0";

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getFriendlyErrorMessage(errorLike) {
  if (!errorLike) return "Unknown runtime error";
  if (typeof errorLike === "string") return errorLike;
  if (errorLike?.message) return errorLike.message;

  try {
    return JSON.stringify(errorLike, null, 2);
  } catch {
    return String(errorLike);
  }
}

function getStack(errorLike) {
  return errorLike?.stack || errorLike?.error?.stack || "";
}

function renderElementOSCrashScreen({ title, message, stack, source }) {
  const mount = document.getElementById("root") || document.body;

  mount.innerHTML = `
    <main style="
      min-height:100vh;
      margin:0;
      padding:28px;
      background:
        radial-gradient(circle at 20% 10%, rgba(34,211,238,.16), transparent 32%),
        radial-gradient(circle at 80% 20%, rgba(168,85,247,.16), transparent 30%),
        linear-gradient(135deg, #020617, #0f172a 55%, #020617);
      color:#e5e7eb;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    ">
      <section style="
        max-width:1100px;
        margin:0 auto;
        border:1px solid rgba(248,113,113,.35);
        background:rgba(127,29,29,.18);
        border-radius:28px;
        padding:24px;
        box-shadow:0 30px 100px rgba(0,0,0,.45);
        backdrop-filter:blur(18px);
      ">
        <div style="
          display:inline-flex;
          gap:8px;
          align-items:center;
          border:1px solid rgba(248,113,113,.35);
          background:rgba(248,113,113,.12);
          color:#fecaca;
          border-radius:999px;
          padding:8px 12px;
          font-size:12px;
          font-weight:900;
          letter-spacing:.16em;
          text-transform:uppercase;
        ">
          ElementOS runtime guard
        </div>

        <h1 style="
          margin:18px 0 8px;
          font-size:clamp(32px, 6vw, 72px);
          line-height:.95;
          letter-spacing:-.06em;
          color:#fff;
        ">
          ${escapeHTML(title)}
        </h1>

        <p style="
          max-width:850px;
          color:#fecaca;
          font-size:16px;
          line-height:1.7;
        ">
          Your app loaded, then crashed in the browser. This usually means a React runtime error,
          missing environment variable, broken import, or unsafe Supabase call.
        </p>

        <div style="margin-top:18px;display:grid;gap:14px;">
          <div style="
            border:1px solid rgba(255,255,255,.12);
            background:rgba(2,6,23,.72);
            border-radius:20px;
            padding:16px;
          ">
            <div style="font-size:12px;color:#67e8f9;font-weight:900;text-transform:uppercase;letter-spacing:.18em;">
              Error message
            </div>
            <pre style="
              white-space:pre-wrap;
              overflow:auto;
              margin:12px 0 0;
              color:#fca5a5;
              font-size:14px;
              line-height:1.6;
            ">${escapeHTML(message)}</pre>
          </div>

          <div style="
            border:1px solid rgba(255,255,255,.12);
            background:rgba(2,6,23,.72);
            border-radius:20px;
            padding:16px;
          ">
            <div style="font-size:12px;color:#67e8f9;font-weight:900;text-transform:uppercase;letter-spacing:.18em;">
              Stack trace
            </div>
            <pre style="
              white-space:pre-wrap;
              overflow:auto;
              max-height:360px;
              margin:12px 0 0;
              color:#cbd5e1;
              font-size:12px;
              line-height:1.6;
            ">${escapeHTML(stack || "No stack trace was provided by the browser.")}</pre>
          </div>

          <div style="
            border:1px solid rgba(255,255,255,.12);
            background:rgba(2,6,23,.72);
            border-radius:20px;
            padding:16px;
            color:#cbd5e1;
            font-size:14px;
            line-height:1.7;
          ">
            <strong style="color:white;">Next move:</strong>
            copy the error message and stack trace above and send it back.
            If your App.jsx uses Supabase, check that
            <code style="color:#67e8f9;"> src/supabaseClient.js </code>,
            <code style="color:#67e8f9;"> VITE_SUPABASE_URL </code>, and
            <code style="color:#67e8f9;"> VITE_SUPABASE_ANON_KEY </code> exist.
            <br />
            <span style="color:#94a3b8;">Source: ${escapeHTML(source)} · ${escapeHTML(ELEMENTOS_BOOT_VERSION)}</span>
          </div>
        </div>
      </section>
    </main>
  `;
}

function installRuntimeCrashGuards() {
  window.addEventListener("error", (event) => {
    renderElementOSCrashScreen({
      title: "ElementOS hit a runtime error.",
      message: event.message || getFriendlyErrorMessage(event.error),
      stack: getStack(event.error),
      source: `${event.filename || "unknown file"}:${event.lineno || "?"}:${event.colno || "?"}`,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    renderElementOSCrashScreen({
      title: "ElementOS hit an async runtime error.",
      message: getFriendlyErrorMessage(event.reason),
      stack: getStack(event.reason),
      source: "Unhandled Promise rejection",
    });
  });
}

function renderMissingRootScreen() {
  document.body.innerHTML = `
    <main style="
      min-height:100vh;
      display:grid;
      place-items:center;
      background:#020617;
      color:white;
      font-family:system-ui, sans-serif;
      padding:24px;
    ">
      <section style="
        max-width:760px;
        border:1px solid rgba(248,113,113,.35);
        background:rgba(127,29,29,.18);
        border-radius:24px;
        padding:24px;
      ">
        <h1 style="margin:0 0 12px;font-size:36px;">ElementOS could not start.</h1>
        <p style="color:#fecaca;line-height:1.7;">
          The page is missing <code>&lt;div id="root"&gt;&lt;/div&gt;</code> in <code>index.html</code>.
        </p>
      </section>
    </main>
  `;
}

function bootElementOS() {
  installRuntimeCrashGuards();

  const rootElement = document.getElementById("root");

  if (!rootElement) {
    renderMissingRootScreen();
    return;
  }

  try {
    createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    console.info(`[${ELEMENTOS_BOOT_VERSION}] React mounted successfully.`);
  } catch (error) {
    renderElementOSCrashScreen({
      title: "ElementOS failed during React boot.",
      message: getFriendlyErrorMessage(error),
      stack: getStack(error),
      source: "createRoot().render()",
    });
  }
}

bootElementOS();

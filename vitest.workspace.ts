import { defineWorkspace } from "vitest/config";

// https://vitest.dev/guide/workspace.html

export default defineWorkspace([
  "admin_backend",
  "frontend",
  "url_retriever_backend",
]);

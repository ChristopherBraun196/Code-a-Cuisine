# n8n workflows

Exported n8n workflows for the recipe-generation backend.

- `code-a-cuisine.json` — main workflow: receives the recipe request, validates it, checks/increments quota, calls Gemini, saves recipes to Firebase, and responds.
- `code-a-cuisine-error-handler.json` — error workflow, wired as the main workflow's "Error Workflow" setting. Triggered automatically whenever the main workflow fails, sends an email notification.

## Importing

In n8n: **Workflows → Import from File**, select the JSON file.

## Credentials

Node credentials (Google Gemini, SMTP for error emails) are **not** included in these exports — n8n stores credentials separately and encrypted, so you'll need to set up your own and attach them to the relevant nodes after import (Google Gemini Chat Model, Send Email).

The Firebase Web API key used for anonymous sign-in (quota tracking, saving recipes) has been replaced with the placeholder `YOUR_FIREBASE_WEB_API_KEY` in the two "Sign In..." nodes — replace it with your own Firebase project's Web API key from the Firebase Console before running the workflow.

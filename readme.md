# 🏡 Gram's House Hub

## Project Description
A collaborative family organization app designed to manage caregiving for Gram, track household projects, log pet/baby activities, and centralize shared responsibilities in a multi-generational home. This application uses the Gemini API to introduce powerful, intelligent features that simplify family coordination and improve quality of care.

## ✨ Key Features & AI Integration

The application is structured into several views, with the Gemini API providing core intelligence to simplify management tasks.

| View | Feature | AI Integration |
| :--- | :--- | :--- |
| **Dashboard** | **Weekly Check-in Generator** | Uses Gemini to summarize weekly events, care logs, project status, and shopping needs into a friendly, shareable newsletter. |
| **Dashboard** | **AI Meal Planner** | Generates a healthy, 3-day meal plan based on specific dietary queries (e.g., "soft foods," "low-sodium"). |
| **Dashboard** | **Family Harmony Assistant** | Provides grounded advice and external resources from Google Search on topics like dementia care, communication, and setting boundaries. |
| **Dashboard** | **Hockey Score Tracker** | Fetches live sports scores using the Gemini API's search grounding capability. |
| **Memories** | **Story Generator** | Accepts an image and a user prompt, then uses the Gemini multimodal model to generate a nostalgic, heartfelt story for the family photo album. |
| **Care Circle** | **Wellness Log & Team Chat** | Central hub for calendar shifts, medication tracking, wellness updates, and real-time team communication. |
| **Projects** | **Kanban Board & Chores** | Manages household projects (e.g., renovations) with a Kanban-style board and tracks recurring chores and the shared shopping list. |
| **Vault** | **Secure Shared Info** | A password-protected area for shared logins (Wi-Fi, streaming) and important documents (insurance, warranties). |
| **Pet & Baby Log** | **Timeline & Checklists** | Tracks pet activities (Luna's Log) and preparation tasks for the new baby (Harper Prep). |

## 🛠️ Tech Stack

* **Framework:** React
* **Language:** TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS (via CDN)
* **AI Backend:** `@google/genai` SDK

## ⚙️ Getting Started

### Prerequisites

* Node.js (LTS version recommended)
* A Gemini API Key

### Installation and Local Setup

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    cd copy-of-gram's-house-hub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure API Key:**
    Open the file `.env.local` and replace the placeholder with your actual Gemini API Key:
    ```
    # .env.local
    GEMINI_API_KEY=AIzaSyAcVc7L0NEmCJL531l5KFjqySWwlnThHNs
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The application will be available at the address shown in your terminal (typically `http://localhost:3000`).

## 🎨 Design System
The application uses a custom Tailwind CSS configuration to ensure a consistent, warm, and inviting family feel.

| Color Variable | Hex Value | Purpose |
| :--- | :--- | :--- |
| `brand-primary` | `#4A90E2` | Main interactive color (Buttons, active tabs) |
| `brand-secondary` | `#F5A623` | Highlight and warning color (e.g., Vault lock) |
| `brand-accent` | `#7ED321` | Success and positive action color (e.g., Memory generation) |
| `brand-bg` | `#F8F9FA` | Light background for the overall app wrapper |
| `brand-text` | `#333333` | Primary text color |
| `brand-subtle` | `#A0AEC0` | Secondary/hint text color |

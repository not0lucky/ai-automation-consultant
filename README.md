# 🤖 Automation Consultant

> **Transform manual workflows into intelligent automation blueprints—powered by AI.**

Automation Consultant is an AI-powered React dashboard that helps businesses architect automation workflows. Simply describe your manual process, and our AI Agent delivers a complete technical blueprint including a visual node graph, recommended tech stack, and step-by-step logic.

---

## ✨ Features

- **📝 Interactive Intake Form** – Capture industry, role, manual tasks, tools, triggers, and goals in a clean, intuitive interface.
- **🧠 AI Architect Agent** – Powered by Google Gemini via n8n, the AI analyzes your input and generates a custom automation blueprint.
- **🔗 Visual Node Graph** – See your workflow as a step-by-step visual diagram with tools, actions, and descriptions.
- **🛠️ Smart Tech Stack** – Get tailored SaaS tool recommendations with connection types (native, API, webhook).
- **📋 One-Click Copy** – Export the entire blueprint to your clipboard for easy sharing or documentation.

---

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js v18+** – [Download here](https://nodejs.org/)
- **n8n Instance** – Self-hosted or cloud instance with Google Gemini integration

---

## 🚀 Setup Guide

### **Backend (n8n)**

1. **Import the Workflow**
   - Open your n8n instance
   - Navigate to **Workflows** → **Import from File**
   - Select `workflow.json` from this repository

2. **Configure Google Gemini Credentials**
   - In the imported workflow, locate the **Google Gemini** node
   - Click **Credentials** → **Create New**
   - Enter your **Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))
   - Save the credentials

3. **Activate the Workflow**
   - Click the **Active** toggle in the top-right corner
   - Ensure the workflow status shows as **Active**

4. **Copy the Production Webhook URL**
   - Click on the **Webhook** node (first node in the workflow)
   - Copy the **Production URL** (e.g., `https://your-n8n-instance.com/webhook/consultant`)
   - You'll need this for the frontend setup

---

### **Frontend (React)**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/ai-automation-consultant.git
   cd ai-automation-consultant
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Update API Endpoint**
   - Open `src/App.tsx`
   - Locate line 32:
     ```typescript
     const API_ENDPOINT = 'https://n8n.agramprojectss.xyz/webhook/consultant';
     ```
   - Replace with your **Production Webhook URL** from Step 4 above

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:5173](http://localhost:5173) in your browser

---

## 🧪 How to Test

Try this sample scenario to see the AI in action:

**Industry:** Real Estate  
**Role:** Property Manager  
**Manual Task:**  
> "Every time a rental application is submitted via email, I manually extract the applicant's details (name, phone, income), run a credit check, and create a task in Trello to schedule a property viewing."

**Current Tools:** Gmail, Excel, Trello  
**Trigger:** New email with subject "Rental Application"  
**Desired Goal:** Automatically create a Trello card with applicant details and credit score

**Expected Output:**
- A visual workflow showing: Gmail Trigger → Extract Data → Credit Check API → Trello Card Creation
- Recommended tools: Gmail (Native), Make/Zapier (Webhook), Trello (API)
- Step-by-step automation logic

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework for building the interactive dashboard |
| **Vite** | Lightning-fast build tool and dev server |
| **TypeScript** | Type-safe development |
| **Framer Motion** | Smooth animations and transitions |
| **Lucide React** | Beautiful, consistent icons |
| **clsx** | Conditional CSS class management |
| **n8n** | Workflow automation backend |
| **Google Gemini** | AI model for blueprint generation |

---

## 📂 Project Structure

```
ai-automation-consultant/
├── src/
│   ├── components/
│   │   └── SkeletonLoader.tsx    # Loading state component
│   ├── App.tsx                    # Main application logic
│   ├── types.ts                   # TypeScript type definitions
│   ├── utils.ts                   # Helper functions (parsing, formatting)
│   └── index.tsx                  # React entry point
├── workflow.json                  # n8n workflow template
├── package.json                   # Dependencies and scripts
├── vite.config.ts                 # Vite configuration
└── README.md                      # You are here!
```

---

## 🎨 Design Philosophy

This project follows modern web design principles:
- **Minimalist Aesthetic** – Clean white backgrounds with subtle gradients
- **Indigo & Blue Palette** – Professional, trustworthy color scheme
- **Micro-Animations** – Framer Motion for delightful interactions
- **Responsive Design** – Mobile-first approach with Tailwind-inspired utilities

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` for details.

---

## 🙏 Acknowledgments

- **Google Gemini** for powering the AI architecture
- **n8n** for the flexible workflow automation platform
- **Framer Motion** for beautiful animations

---

## 📧 Support

Need help? Reach out:
- 📧 Email: support@yourcompany.com
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ai-automation-consultant/issues)

---

<div align="center">
  <strong>Built with ❤️ by automation enthusiasts</strong>
</div>

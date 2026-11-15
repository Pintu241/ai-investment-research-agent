# AI Investment Research Agent

A full-stack AI-powered web application that researches a company,
analyzes multiple investment factors, and produces an explainable
**INVEST**, **WATCH**, or **PASS** recommendation with a confidence
score and reasoning.

> **Disclaimer:** This project is for educational and demonstration
> purposes only. AI-generated output may be inaccurate and must not be
> treated as professional financial advice.

------------------------------------------------------------------------

## Table of Contents

-   [Overview](#overview)
-   [What the Application Does](#what-the-application-does)
-   [Key Features](#key-features)
-   [Tech Stack](#tech-stack)
-   [System Architecture](#system-architecture)
-   [How the AI Workflow Works](#how-the-ai-workflow-works)
-   [Project Structure](#project-structure)
-   [Prerequisites](#prerequisites)
-   [Local Setup](#local-setup)
-   [Environment Variables](#environment-variables)
-   [API Documentation](#api-documentation)
-   [Deployment on Vercel](#deployment-on-vercel)
-   [Automated CI/CD Pipeline (Jenkins & AWS EC2)](#automated-cicd-pipeline-jenkins--aws-ec2)
-   [Connecting Frontend and Backend](#connecting-frontend-and-backend)
-   [Example Runs](#example-runs)
-   [Key Decisions and Trade-offs](#key-decisions-and-trade-offs)
-   [Current Limitations](#current-limitations)
-   [What I Would Improve With More
    Time](#what-i-would-improve-with-more-time)
-   [AI Usage During Development](#ai-usage-during-development)
-   [Troubleshooting](#troubleshooting)
-   [Security Notes](#security-notes)
-   [Interview Explanation](#interview-explanation)
-   [Author](#author)

------------------------------------------------------------------------

## Overview

The **AI Investment Research Agent** is an end-to-end AI application
where a user enters a company name and receives a structured investment
research report.

For example, a user can enter:

``` text
Tata Motors
```

The application sends the request from the React frontend to the Express
backend. The backend starts a multi-stage AI workflow built with
**LangGraph.js** and powered by **Google Gemini**. Different nodes focus
on different parts of the analysis before a final decision is produced.

The main goal is not simply to ask an LLM:

> "Should I invest in this company?"

Instead, the application breaks the problem into specialized stages:

``` text
Company Input
    |
    v
Research Analysis
    |
    v
Financial Analysis
    |
    v
News / Development Analysis
    |
    v
Risk Analysis
    |
    v
Final Decision
```

This makes the workflow more modular, explainable, and easier to extend.

------------------------------------------------------------------------

## What the Application Does

A user enters a company name in the web interface.

The application then:

1.  Receives the company name in the React frontend.
2.  Sends it to the Node.js/Express backend through Axios.
3.  Starts a LangGraph workflow.
4.  Performs company research.
5.  Evaluates financial context.
6.  Reviews important developments/news context.
7.  Identifies major risks.
8.  Combines previous outputs into a final decision.
9.  Returns a structured report to the frontend.
10. Displays the result in a readable investment research interface.
11. Can persist research data in MongoDB depending on the current
    implementation.

Typical output includes:

-   Company name
-   Company overview
-   Research summary
-   Financial analysis
-   News/development analysis
-   Strengths
-   Risks
-   Final decision
-   Confidence score
-   Final reasoning

Possible decisions:

``` text
INVEST
WATCH
PASS
```

------------------------------------------------------------------------

## Key Features

-   Company-name-based research input
-   AI-powered investment analysis
-   Multi-step LangGraph workflow
-   Specialized AI nodes
-   Shared state between workflow stages
-   Structured final recommendation
-   Confidence score
-   Explainable reasoning
-   Strength and risk summaries
-   React-based responsive interface
-   Express REST API
-   MongoDB integration
-   Gemini LLM integration
-   Separate frontend and backend deployments
-   Environment-variable-based configuration
-   **User Authentication (Login & Signup)**: JWT-based authorization, bcrypt password hashing, and complete data isolation (users only access their own reports).
-   **Fully Functional Dashboard Buttons**: Reset buttons, history listings, saved bookmarks filters, and user profile menus.
-   **Report Actions**: Quick inline bookmarking and report deletion with interactive confirm dialogs.
-   **Graph Analysis Card**: Visual CSS bar charts rendering LLM-evaluated scores for Business Strength, Financial Health, News Sentiment, and Risk Level.

------------------------------------------------------------------------

## Tech Stack

### Frontend

-   **React** --- component-based user interface
-   **Vite** --- frontend development and build tool
-   **Axios** --- HTTP requests to the backend
-   **CSS** --- custom interface styling

### Backend

-   **Node.js** --- JavaScript runtime
-   **Express.js** --- REST API server
-   **MongoDB** --- document database
-   **Mongoose** --- MongoDB object modeling

### AI and Agent Workflow

-   **LangChain.js** --- LLM application integration
-   **LangGraph.js** --- stateful multi-step AI workflow
-   **Google Gemini** --- large language model

### Validation, Security, and Utilities

-   **jsonwebtoken** --- secure JSON Web Token authentication sessions
-   **bcryptjs** --- password hashing with salt configuration
-   **Zod** --- structured schema validation where used
-   **dotenv** --- environment-variable loading
-   **CORS** --- frontend/backend cross-origin communication

### Deployment

-   **Vercel** --- frontend and backend deployment
-   **MongoDB Atlas** --- cloud MongoDB database

------------------------------------------------------------------------

## System Architecture

``` text
+----------------------+
|        User          |
+----------+-----------+
           |
           | Enters company name
           v
+----------------------+
| React + Vite Client  |
| Frontend             |
+----------+-----------+
           |
           | Axios POST request
           | /api/research
           v
+----------------------+
| Node.js + Express    |
| Backend API          |
+----------+-----------+
           |
           | Starts workflow
           v
+----------------------+
| LangGraph.js         |
| Shared Agent State   |
+----------+-----------+
           |
           v
+----------------------+
| Research Node        |
+----------+-----------+
           |
           v
+----------------------+
| Financial Node       |
+----------+-----------+
           |
           v
+----------------------+
| News Node            |
+----------+-----------+
           |
           v
+----------------------+
| Risk Node            |
+----------+-----------+
           |
           v
+----------------------+
| Decision Node        |
+----------+-----------+
           |
           | Uses Gemini
           v
+----------------------+
| Final Report         |
+----------+-----------+
           |
           +--------------------+
           |                    |
           v                    v
+------------------+   +------------------+
| React UI Result  |   | MongoDB          |
+------------------+   +------------------+
```

------------------------------------------------------------------------

## How the AI Workflow Works

### Why LangGraph?

A normal application could make one LLM call and ask for a complete
investment decision. This project uses LangGraph because the problem
naturally contains multiple stages.

LangGraph helps define:

-   Nodes
-   Edges
-   Shared state
-   Execution order
-   Multi-step reasoning flow

Conceptually:

``` text
START
  |
  v
Research Node
  |
  v
Financial Node
  |
  v
News Node
  |
  v
Risk Node
  |
  v
Decision Node
  |
  v
END
```

### Shared State

Each node can read information already generated by previous nodes and
add its own output.

A simplified conceptual state may look like:

``` js
{
  company: "Tata Motors",
  research: "...",
  financial: "...",
  news: "...",
  risk: "...",
  decision: "...",
  confidence: 70
}
```

The exact state schema depends on the current implementation.

### 1. Research Node

Focuses on business fundamentals such as:

-   Business model
-   Products and services
-   Industry
-   Market position
-   Competitive advantages
-   Growth opportunities

### 2. Financial Node

Focuses on financial context such as:

-   Revenue trends
-   Profitability
-   Debt
-   Cash flow
-   Capital intensity
-   Financial stability
-   Growth indicators

### 3. News Node

Focuses on developments such as:

-   Major announcements
-   Strategic initiatives
-   Management developments
-   Industry changes
-   Market sentiment
-   Important company events

### 4. Risk Node

Identifies risks such as:

-   High debt
-   Competitive pressure
-   Regulatory exposure
-   Market volatility
-   Execution risk
-   Industry cyclicality
-   Operational complexity

### 5. Decision Node

Combines the previous outputs and produces:

-   Final decision
-   Confidence score
-   Strengths
-   Risks
-   Reasoning

This node acts as the final synthesis stage.

------------------------------------------------------------------------

## Project Structure

The project uses a frontend/backend structure similar to:

``` text
ai-investment-research-agent/
|
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CompanySearch.jsx
│   │   │   ├── CompanySearch.css
│   │   │   └── Auth.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
|
├── server/
│   ├── ai/
│   │   ├── graph/
│   │   │   └── investmentGraph.js
│   │   ├── nodes/
│   │   │   ├── researchNode.js
│   │   │   ├── financialNode.js
│   │   │   ├── newsNode.js
│   │   │   ├── riskNode.js
│   │   │   └── decisionNode.js
│   │   └── langchainModel.js
│   |
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── researchController.js
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Research.js
│   │   └── User.js
│   ├── routes/
│   │   ├── researchRoutes.js
│   │   └── authRoutes.js
│   ├── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
|
├── .gitignore
└── README.md
```

> The exact folders may vary slightly from the current codebase. The
> structure above explains the intended responsibilities.

------------------------------------------------------------------------

## Prerequisites

Before running the project, install or create access to:

-   Node.js 20+ recommended
-   npm
-   Git
-   MongoDB Atlas account or MongoDB instance
-   Google Gemini API key

You should also have basic knowledge of:

-   JavaScript
-   React
-   Node.js
-   REST APIs
-   Environment variables

------------------------------------------------------------------------

## Local Setup

### 1. Clone the Repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ai-investment-research-agent
```

### 2. Configure the Backend

Move to the server folder:

``` bash
cd server
```

Install dependencies:

``` bash
npm install
```

Create:

``` text
server/.env
```

Add:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

``` bash
npm run dev
```

Expected local backend:

``` text
http://localhost:5000
```

The root health endpoint should return a response similar to:

``` json
{
  "success": true,
  "message": "AI Investment Research API is running"
}
```

### 3. Configure the Frontend

Open a second terminal from the project root:

``` bash
cd client
```

Install dependencies:

``` bash
npm install
```

Create:

``` text
client/.env
```

Add:

``` env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

``` bash
npm run dev
```

Vite usually starts at:

``` text
http://localhost:5173
```

Open that address in the browser.

### 4. Test the Full Flow

1.  Make sure the backend is running.
2.  Make sure the frontend is running.
3.  Open the frontend.
4.  Enter a company name.
5.  Click the research button.
6.  Wait for the multi-step AI workflow.
7.  Review the generated report.

------------------------------------------------------------------------

## Environment Variables

### Backend Variables

File:

``` text
server/.env
```

Example:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend Variables

File:

``` text
client/.env
```

For local development:

``` env
VITE_API_URL=http://localhost:5000/api
```

For production, configure the value in the frontend hosting environment:

``` env
VITE_API_URL=https://your-real-backend-domain.vercel.app/api
```

### Important Vite Rule

Frontend environment variables exposed to Vite code must begin with:

``` text
VITE_
```

Therefore:

``` text
VITE_API_URL
```

is correct.

------------------------------------------------------------------------

## API Documentation

### 1. Authentication Endpoints

#### Signup User
* **Method**: `POST`
* **Route**: `/api/auth/signup`
* **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@company.com",
    "password": "password123"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "_id": "user_id_string",
      "name": "John Doe",
      "email": "john@company.com",
      "token": "signed_jwt_token_string"
    }
  }
  ```

#### Login User
* **Method**: `POST`
* **Route**: `/api/auth/login`
* **Body**:
  ```json
  {
    "email": "john@company.com",
    "password": "password123"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "_id": "user_id_string",
      "name": "John Doe",
      "email": "john@company.com",
      "token": "signed_jwt_token_string"
    }
  }
  ```

#### Get Current User Profile
* **Method**: `GET`
* **Route**: `/api/auth/me`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id_string",
      "name": "John Doe",
      "email": "john@company.com"
    }
  }
  ```

### 2. Research Endpoints (Protected by JWT)

All research calls require the `Authorization` header populated with `Bearer <JWT_TOKEN>`.

#### Create Company Research
* **Method**: `POST`
* **Route**: `/api/research`
* **Body**:
  ```json
  {
    "company": "Tata Motors"
  }
  ```
* **Response**: Returns the compiled LangGraph object mapped to MongoDB:
  ```json
  {
    "success": true,
    "message": "Investment research completed",
    "data": {
      "_id": "report_id_string",
      "company": "tata motors",
      "status": "completed",
      "decision": "WATCH",
      "confidence": 70,
      "reasoning": "Synthesis reasoning...",
      "businessScore": 75,
      "financialScore": 60,
      "newsScore": 65,
      "riskScore": 40,
      "user": "user_id_string"
    }
  }
  ```

#### Get User's Research History
* **Method**: `GET`
* **Route**: `/api/research`
* **Response**: Array of reports compiled by the authenticated user.

#### Get Report Detail by ID
* **Method**: `GET`
* **Route**: `/api/research/:id`
* **Response**: Detailed research document if it belongs to the logged-in user.

#### Delete Report by ID
* **Method**: `DELETE`
* **Route**: `/api/research/:id`

#### Toggle Save / Bookmark Status
* **Method**: `PATCH`
* **Route**: `/api/research/:id/toggle-save`
* **Response**: Toggles saved boolean and returns updated bookmark details.

------------------------------------------------------------------------

## Frontend API Connection

A typical Axios service is:

``` js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const createResearch = async (company) => {
  const response = await api.post("/research", {
    company
  });

  return response.data;
};

export default api;
```

With:

``` env
VITE_API_URL=http://localhost:5000/api
```

this call:

``` js
api.post("/research")
```

becomes:

``` text
POST http://localhost:5000/api/research
```

In production, if:

``` env
VITE_API_URL=https://your-backend.vercel.app/api
```

the same code becomes:

``` text
POST https://your-backend.vercel.app/api/research
```

------------------------------------------------------------------------

## Deployment on Vercel

The repository contains separate frontend and backend directories. They
can be deployed as two projects from the same GitHub repository.

``` text
GitHub Repository
       |
       +---------------------+
       |                     |
       v                     v
Frontend Project       Backend Project
Root: client           Root: server
React + Vite           Node + Express
```

### Backend Deployment

Create/import a Vercel project from the repository.

Set:

``` text
Root Directory: server
```

Use the detected Express/Node configuration appropriate to the deployed
project.

Add backend environment variables:

``` text
MONGO_URI
GEMINI_API_KEY
```

Do not commit real secrets to GitHub.

After deployment, test:

``` text
https://your-backend-domain.vercel.app/
```

Expected:

``` json
{
  "success": true,
  "message": "AI Investment Research API is running"
}
```

### Frontend Deployment

Create another Vercel project from the same repository.

Set:

``` text
Root Directory: client
Framework Preset: Vite
```

Add:

``` text
Key:
VITE_API_URL
```

``` text
Value:
https://your-real-backend-domain.vercel.app/api
```

Redeploy the frontend after changing `VITE_API_URL` because Vite
environment variables are included during the build.

------------------------------------------------------------------------

## Automated CI/CD Pipeline (Jenkins & AWS EC2)

This project includes an enterprise-grade Continuous Integration and Continuous Deployment (CI/CD) pipeline built with **Jenkins**, **Docker Compose**, and **AWS EC2**. Every push to the `main` branch triggers an automated build, validation, containerization, and zero-downtime deployment.

```text
+------------------+         Push          +------------------------+
|  Developer Push  | --------------------> |   GitHub Repository    |
+------------------+                       +------------------------+
                                                       |
                                            Webhook    | (POST /github-webhook/)
                                                       v
                                           +------------------------+
                                           |      Jenkins CI        |
                                           |  - Checkout            |
                                           |  - Install Deps        |
                                           |  - Lint Frontend       |
                                           |  - Validate Backend    |
                                           |  - Build React App     |
                                           |  - Docker Compose Test |
                                           +------------------------+
                                                       |
                                           SSH & Rsync | (Secure Credentials)
                                                       v
                                           +------------------------+
                                           |      AWS EC2 Host      |
                                           |  - Inject Secrets      |
                                           |  - docker compose up   |
                                           |  - Health Verification |
                                           +------------------------+
```

---

### 1. Jenkins Architecture & Pipeline Overview

The declarative pipeline is defined in [`Jenkinsfile`](./Jenkinsfile) and executes the following sequential stages:

1. **Checkout Source**: Retrieves the latest repository revision using Git SCM.
2. **Install Dependencies**: Runs clean package installations (`npm ci || npm install`) across both `client` and `server`.
3. **Lint & Code Quality**: Executes ESLint on the React frontend (`npm run lint`).
4. **Backend Validation & Tests**: Performs syntax validation and module checks across all backend files (`npm test`).
5. **Build Frontend**: Compiles production-optimized client assets (`npm run build`).
6. **Docker Image Build**: Builds and validates Docker images via `docker compose build --pull`.
7. **Deploy to AWS EC2**:
   - Securely opens an SSH session to the EC2 host using Jenkins credentials.
   - Synchronizes application code and Docker configurations via `rsync`.
   - Generates a production `.env` file on the remote host with restricted permissions (`chmod 600`).
   - Restarts containers using `docker compose up -d --build --remove-orphans`.
   - Executes [`scripts/healthcheck.sh`](./scripts/healthcheck.sh) to verify `HTTP 200` on both backend (`:5000/`) and frontend (`:5173/`).

---

### 2. Jenkins Prerequisites & Plugins

#### A. Host Requirements for Jenkins Server
- **OS**: Ubuntu 22.04 LTS / Debian 12 / Amazon Linux 2023 (or running in Docker).
- **Java**: OpenJDK 17 or 21 (`sudo apt install openjdk-17-jdk`).
- **Node.js**: v20.x (`nvm install 20` or NodeSource PPA).
- **Docker**: Docker Engine 24+ & Docker Compose v2 (`docker-compose-plugin`).
- **CLI Utilities**: `git`, `rsync`, `curl`, `ssh`.

#### B. Required Jenkins Plugins
Install the following plugins via **Manage Jenkins** > **Plugins** > **Available plugins**:
- **Pipeline** (`workflow-aggregator`) - Core declarative pipeline support.
- **GitHub Integration Plugin** (`github`) - GitHub webhook listener and push notifications.
- **SSH Agent Plugin** (`ssh-agent`) - Enables SSH key authentication without writing keys to disk.
- **Credentials Binding Plugin** (`credentials-binding`) - Secure injection of secrets into shell environments.
- **AnsiColor** (`ansicolor`) - Renders ANSI color codes in console output.

---

### 3. Jenkins Credentials Configuration

Navigate to **Manage Jenkins** > **Credentials** > **System** > **Global credentials (unrestricted)** > **Add Credentials**. Add the following items:

| Credential ID | Kind | Value / Format | Description |
| :--- | :--- | :--- | :--- |
| `ec2-ssh-key` | **SSH Username with private key** | Username: `ubuntu` (or `ec2-user`), Key: paste private `.pem` key | SSH private key to authenticate to AWS EC2 |
| `EC2_HOST` | **Secret text** | e.g. `54.210.120.45` | Public IP or DNS of the AWS EC2 instance |
| `MONGO_URI` | **Secret text** | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/dbname` | MongoDB Atlas production connection string |
| `GEMINI_API_KEY` | **Secret text** | `AIzaSy...` | Google Gemini API key for LangGraph reasoning |
| `JWT_SECRET` | **Secret text** | e.g. `super_secure_jwt_random_secret_string_32chars` | Secret key used for signing user auth tokens |
| `VITE_API_URL` | **Secret text** | e.g. `http://54.210.120.45:5000/api` | Public backend endpoint accessed by client browsers |

> [!SECURITY]
> All credentials managed via `withCredentials` in Jenkins are masked in console output as `****` to prevent secret leakage.

---

### 4. GitHub Webhook Setup

1. Open your GitHub repository in your browser: `https://github.com/Pintu241/ai-investment-research-agent`.
2. Navigate to **Settings** > **Webhooks** > **Add webhook**.
3. Configure the fields:
   - **Payload URL**: `http://<YOUR_JENKINS_PUBLIC_IP>:8080/github-webhook/`
   - **Content type**: `application/json`
   - **Secret**: *(Leave blank or supply matching secret if configured)*
   - **Which events would you like to trigger this webhook?**: Select **Just the push event**.
   - Check **Active**.
4. Click **Add webhook**. A green checkmark indicates a successful handshake.

---

### 5. AWS EC2 Setup & Provisioning

#### A. Recommended Instance Specifications
- **Instance Type**: `t3.medium` or `t3.large` (2 vCPU, 4GB+ RAM recommended for running parallel Docker builds and AI Node services).
- **Operating System**: Ubuntu 22.04 LTS (HVM) or Amazon Linux 2023.
- **Storage**: Minimum 20 GB gp3 SSD.

#### B. EC2 Security Group Configuration
In the AWS Management Console under **EC2** > **Security Groups**, configure the inbound rules:

| Type | Protocol | Port Range | Source | Description |
| :--- | :--- | :--- | :--- | :--- |
| **SSH** | TCP | `22` | `<Your_Jenkins_IP>/32` (or Admin IP) | Secure remote deployment access |
| **Custom TCP** | TCP | `5000` | `0.0.0.0/0` | Backend API (Express.js REST endpoints) |
| **Custom TCP** | TCP | `5173` | `0.0.0.0/0` | Frontend Web UI (React + Vite) |
| **HTTP** *(optional)* | TCP | `80` | `0.0.0.0/0` | HTTP traffic (if running Nginx reverse proxy) |

#### C. Initial Server Preparation on EC2
Log in to your EC2 instance once to configure Docker permissions:

```bash
# 1. Update and install Docker + Docker Compose + rsync
sudo apt update -y && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release rsync

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update -y
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 2. Grant ubuntu user non-root Docker privileges
sudo usermod -aG docker ubuntu
newgrp docker

# 3. Create target deployment directory
mkdir -p /home/ubuntu/ai-investment-research-agent
```

> [!IMPORTANT]
> Ensure your EC2 Elastic/Public IP is added to the **MongoDB Atlas Network Access IP Whitelist** so the backend container can reach the database.

---

### 6. Executing the Pipeline

#### Automatic Trigger
1. Commit and push any code change to the `main` branch:
   ```bash
   git add .
   git commit -m "feat: enhance investment risk analysis"
   git push origin main
   ```
2. GitHub sends a webhook POST request to Jenkins.
3. Jenkins automatically initiates a new build and reports live status.

#### Manual Trigger
1. In Jenkins, open the **AI-Investment-Research-Agent** pipeline job.
2. Click **Build with Parameters** in the left sidebar.
3. Specify parameters:
   - `BRANCH_NAME`: `main`
   - `DEPLOY_TO_EC2`: `true`
   - `EC2_DEPLOY_PATH`: `/home/ubuntu/ai-investment-research-agent`
4. Click **Build**.

---

### 7. Verification & Health Checks

After deployment, the pipeline automatically executes [`scripts/healthcheck.sh`](./scripts/healthcheck.sh) on the EC2 host. You can also manually test:

```bash
# Test Express Backend health endpoint
curl -i http://<EC2_PUBLIC_IP>:5000/

# Expected response:
# HTTP/1.1 200 OK
# {"success":true,"message":"AI Investment Research API is running"}

# Test Frontend HTTP status
curl -i http://<EC2_PUBLIC_IP>:5173/
```

Access the full UI in your browser: `http://<EC2_PUBLIC_IP>:5173`

---

### 8. Troubleshooting Guide

#### Problem 1: `Host key verification failed` during SSH
- **Cause**: Jenkins does not recognize the EC2 SSH host key fingerprint.
- **Solution**: The pipeline uses `-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null`. If connecting manually, run `ssh-keyscan -H <EC2_HOST> >> ~/.ssh/known_hosts` on the Jenkins agent.

#### Problem 2: `Permission denied (publickey)`
- **Cause**: Incorrect SSH username or key format in `ec2-ssh-key`.
- **Solution**: Ensure the credential username matches the OS AMI (`ubuntu` for Ubuntu, `ec2-user` for Amazon Linux) and the private `.pem` key begins with `-----BEGIN OPENSSH PRIVATE KEY-----` or `-----BEGIN RSA PRIVATE KEY-----`.

#### Problem 3: Backend container exits with `MongooseServerSelectionError`
- **Cause**: MongoDB Atlas blocked the connection.
- **Solution**: Go to MongoDB Atlas > **Network Access** > **Add IP Address** > Add your EC2 Public IP (`<EC2_HOST>/32`).

#### Problem 4: `GEMINI_API_KEY` missing error
- **Cause**: Credential was not bound or is empty in Jenkins.
- **Solution**: Check Jenkins Credentials to verify `GEMINI_API_KEY` is present as a Secret Text and matches the Google AI Studio key.

#### Problem 5: Frontend shows `Network Error` or cannot connect to backend
- **Cause**: `VITE_API_URL` is pointing to `localhost` instead of the public EC2 address, or port 5000 is blocked in the AWS Security Group.
- **Solution**: Set Jenkins credential `VITE_API_URL=http://<EC2_PUBLIC_IP>:5000/api` and confirm inbound TCP port 5000 is open in the AWS Security Group.

------------------------------------------------------------------------

## Connecting Frontend and Backend

This is the complete production connection:

``` text
User
 |
 v
React Frontend on Vercel
 |
 | Axios
 v
VITE_API_URL
 |
 v
Express Backend on Vercel
 |
 v
POST /api/research
 |
 v
LangGraph Workflow
 |
 v
Gemini
 |
 v
MongoDB
```

### Correct Configuration

Frontend Vercel environment variable:

``` text
Key:
VITE_API_URL
```

``` text
Value:
https://your-real-backend-domain.vercel.app/api
```

Do not paste the key and value as one URL.

Wrong:

``` text
VITE_API_URL=https://your-backend.vercel.app/api
```

when the Vercel interface is asking for separate **Key** and **Value**
fields.

Also do not leave placeholder text such as:

``` text
https://your-backend-vercel-url.vercel.app/api
```

Replace it with the actual backend domain.

------------------------------------------------------------------------

## CORS Configuration

During simple development, the backend may use:

``` js
import cors from "cors";

app.use(cors());
```

For a stricter production setup:

``` js
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL
    ]
  })
);
```

Then configure the backend environment:

``` env
FRONTEND_URL=https://your-real-frontend-domain.vercel.app
```

This limits browser access to expected frontend origins.

------------------------------------------------------------------------

## Example Runs

### Example 1: Tata Motors

**Input**

``` text
Tata Motors
```

**Illustrative output**

``` text
Decision: WATCH
Confidence: 70%

Strengths:
- Strong brand presence
- Diversified automotive portfolio
- Long-term growth opportunities

Risks:
- Capital-intensive operations
- Competitive pressure
- Cyclical market exposure

Reasoning:
The company has meaningful long-term strengths but also faces
financial, competitive, and industry-specific risks.
```

### Example 2: Infosys

**Input**

``` text
Infosys
```

**Illustrative output**

``` text
Decision: INVEST or WATCH

Key Factors:
- Strong IT services position
- Global client base
- Digital transformation opportunities
- Exposure to global technology spending cycles
```

### Example 3: Another Public Company

A user can enter another company name and the same graph workflow is
executed:

``` text
Company
   |
   v
Research
   |
   v
Financial
   |
   v
News
   |
   v
Risk
   |
   v
Decision
```

> AI-generated results may vary between runs.

------------------------------------------------------------------------

## Key Decisions and Trade-offs

### Why React?

React was selected because:

-   Reusable components
-   Strong ecosystem
-   Easy state-driven interfaces
-   Good fit for dashboards and reports
-   Existing developer familiarity

### Why Node.js and Express?

They were selected because:

-   JavaScript across frontend and backend
-   Simple REST API development
-   Easy integration with AI libraries
-   Large ecosystem

### Why LangGraph.js?

The key architectural decision was to use a graph workflow instead of
one giant LLM prompt.

Benefits:

-   Clear stages
-   Shared state
-   Modular nodes
-   Easier debugging
-   Better extensibility
-   More explainable architecture

Trade-offs:

-   More code
-   More LLM calls
-   Higher latency
-   Potentially higher API cost
-   More failure points

### Why Multiple AI Nodes?

Each node has a specialized responsibility.

Benefits:

-   Better separation of concerns
-   Smaller prompts
-   Easier testing
-   Easier future replacement of individual stages

Trade-off:

Sequential nodes can make the user wait longer.

### Why Gemini?

Gemini was selected as the LLM provider for AI analysis and structured
reasoning.

The architecture can later be extended to other providers such as:

-   OpenAI
-   Anthropic Claude

### Why MongoDB?

AI reports naturally contain:

-   Nested objects
-   Arrays
-   Long text
-   Variable-length sections

MongoDB's document model is a practical fit for this structure.

### Why Separate Frontend and Backend Deployments?

Benefits:

-   Independent deployments
-   Clear separation
-   Easier environment configuration
-   Frontend and backend can scale/change separately

Trade-off:

-   Requires API URL configuration
-   Requires CORS handling
-   Two deployment projects must be maintained

------------------------------------------------------------------------

## Current Limitations

The current application has important limitations:

-   AI output can be inaccurate or hallucinated.
-   The system is not a licensed financial advisor.
-   Research quality depends on model context and available data.
-   Financial information may not be real-time.
-   News analysis may not always use live verified news sources.
-   Multiple sequential LLM calls increase response time.
-   Confidence scores are AI-generated unless backed by a formal scoring
    model.
-   A final recommendation should not be used as the only basis for
    investing.
-   Production-grade retries and fallbacks may be limited.
-   Source citations can be improved.

------------------------------------------------------------------------

## What I Would Improve With More Time

### Data Quality

-   Live stock market API
-   Verified financial statements
-   Real-time news APIs
-   Search tools
-   Source citations
-   Source timestamps

### Agent Architecture

-   Parallel execution for independent nodes
-   Planner node
-   Tool-calling agents
-   Retry logic
-   Fallback LLM provider
-   Human approval stage
-   Better state validation

### Investment Methodology

-   Formal weighted scoring
-   Valuation metrics
-   Peer comparison
-   Sector-specific criteria
-   Historical trend analysis
-   Explainable confidence calculation

### Product Features

-   Authentication
-   Saved reports
-   User dashboard
-   Company comparison
-   Watchlist
-   PDF export
-   Shareable reports
-   Search history
-   Streaming responses

### Engineering

-   Unit tests
-   Integration tests
-   End-to-end tests
-   Structured logging
-   Monitoring
-   Rate limiting
-   Request caching
-   Queue-based long-running jobs
-   Better error handling

------------------------------------------------------------------------

## Future Architecture

A more advanced design could run independent research tasks in parallel:

``` text
                    Company Input
                          |
                          v
                  Research Planner
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
   Financial Agent    News Agent     Market Agent
          |               |               |
          +---------------+---------------+
                          |
                          v
                     Risk Agent
                          |
                          v
                   Decision Agent
                          |
                          v
              Final Investment Report
```

This can reduce total response time when tasks are independent.

------------------------------------------------------------------------

## AI Usage During Development

AI usage was an intentional part of the development process.

AI assistance was used for:

-   Understanding LangChain.js concepts
-   Understanding LangGraph.js concepts
-   Designing the multi-node workflow
-   Planning shared state
-   Debugging import/export errors
-   Debugging LangGraph node/state naming conflicts
-   Improving prompts
-   Explaining Axios frontend/backend communication
-   Debugging HTTP 404 errors
-   Debugging deployment configuration
-   Debugging Vercel environment variables
-   Debugging frontend/backend URL configuration
-   Improving UI ideas
-   Creating and reviewing documentation

### Important Development Principle

AI-generated suggestions were not treated as automatically correct.

The development process included:

1.  Generate or discuss an approach.
2.  Read the code.
3.  Test locally.
4.  Inspect errors.
5.  Debug the actual failure.
6.  Understand the final implementation.
7.  Document decisions and trade-offs.

### LLM Chat Logs

For assignment submission, AI chat transcripts can be included in a
separate folder:

``` text
docs/
└── ai-chat-logs/
    ├── architecture-discussion.pdf
    ├── langgraph-debugging.pdf
    ├── deployment-debugging.pdf
    └── ui-discussion.pdf
```

Alternatively:

``` text
docs/
└── AI_USAGE.md
```

The logs help demonstrate:

-   Thought process
-   Iteration
-   Debugging
-   Architecture decisions
-   Responsible AI-assisted development

> Remove API keys, passwords, database credentials, tokens, and other
> secrets before submitting any transcript.

------------------------------------------------------------------------

## Troubleshooting

### 1. Frontend Gets 404

Check the browser Network tab.

If the frontend sends:

``` text
POST https://backend.vercel.app/research
```

but Express expects:

``` text
POST /api/research
```

then configure:

``` env
VITE_API_URL=https://backend.vercel.app/api
```

### 2. Frontend Calls a Placeholder Domain

Wrong:

``` text
https://your-backend-vercel-url.vercel.app/api/research
```

Fix the frontend environment variable with the actual backend domain and
redeploy.

### 3. Environment Variable Appears Inside the URL

Wrong result:

``` text
/VITE_API_URL=https://...
```

This usually means the environment variable was entered incorrectly.

Use separate fields:

``` text
Key: VITE_API_URL
Value: https://backend.vercel.app/api
```

### 4. Vite Still Uses an Old URL

Vite variables are build-time variables.

After changing:

``` text
VITE_API_URL
```

redeploy the frontend and hard refresh the browser.

### 5. CORS Error

Confirm:

-   The request uses the real backend URL.
-   The backend is actually reachable.
-   The backend CORS middleware allows the frontend origin.
-   The frontend URL is configured correctly.

### 6. Backend Root Returns 404

Check:

-   Correct Vercel project
-   Correct deployment URL
-   Root Directory is `server`
-   Latest deployment logs
-   Express application detection
-   Health route exists

### 7. Gemini Key Error

Check:

``` text
GEMINI_API_KEY
```

in the backend environment.

Never expose this key in the frontend.

### 8. MongoDB Connection Error

Check:

-   `MONGO_URI`
-   MongoDB Atlas network access
-   Database user credentials
-   Correct connection string

### 9. LangGraph State/Node Naming Error

Avoid using the same name for both a state channel and a graph node if
the library rejects that conflict.

For example, if state contains:

``` text
research
```

use a distinct node name such as:

``` text
researchNode
```

when required by the graph implementation.

------------------------------------------------------------------------

## Security Notes

Never commit:

``` text
.env
node_modules/
```

Recommended `.gitignore` entries:

``` gitignore
node_modules/
.env
.env.*
!.env.example
dist/
build/
*.log
```

Create safe example files instead.

### Example `server/.env.example`

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

### Example `client/.env.example`

``` env
VITE_API_URL=http://localhost:5000/api
```

Additional production improvements:

-   Rate limiting
-   Input validation
-   Request size limits
-   Secure CORS allowlist
-   Secret rotation
-   Logging without sensitive data
-   API abuse protection

------------------------------------------------------------------------

## Interview Explanation

### 30-Second Explanation

> I built an AI Investment Research Agent using React, Node.js, Express,
> MongoDB, LangChain.js, LangGraph.js, and Gemini. A user enters a
> company name, the frontend sends it to the backend, and a LangGraph
> workflow processes it through specialized research, financial, news,
> risk, and decision nodes. The nodes share state, and the final node
> combines previous analysis into an INVEST, WATCH, or PASS
> recommendation with confidence and reasoning.

### 1-Minute Explanation

> The project is a full-stack AI application. The frontend is built with
> React and Vite, and it communicates with a Node.js/Express API using
> Axios. On the backend, I use LangGraph.js to model investment research
> as a multi-step workflow rather than one large LLM prompt. The
> workflow has specialized nodes for company research, financial
> analysis, news or developments, risk analysis, and final
> decision-making. Each node contributes to shared state, and the final
> decision node synthesizes the earlier outputs. Gemini powers the LLM
> analysis, MongoDB is used for flexible document-style storage, and the
> frontend and backend are deployed separately. One trade-off is that
> multiple sequential model calls improve modularity but increase
> latency, so with more time I would parallelize independent nodes and
> add verified real-time financial and news sources.

### Why Not Just One Gemini Call?

> A single call is simpler and faster, but it mixes all responsibilities
> into one prompt. I used LangGraph to make the workflow explicit,
> modular, easier to debug, and easier to extend. The trade-off is
> additional latency and complexity.

### What Was a Major Technical Challenge?

> One challenge was connecting independently deployed frontend and
> backend applications. Locally the frontend called localhost, but in
> production I used a Vite environment variable for the backend base
> URL, configured the correct `/api` prefix, redeployed because Vite
> variables are injected at build time, and handled cross-origin
> communication through Express CORS middleware.

------------------------------------------------------------------------

## Assignment Requirements Mapping

This project addresses the assignment goals as follows:

  -----------------------------------------------------------------------
  Assignment Requirement              Implementation
  ----------------------------------- -----------------------------------
  Company name input                  React form

  Research a company                  AI research workflow

  Decide invest or pass               Final decision node

  Explain reasoning                   Structured final reasoning

  React or Next.js frontend           React + Vite

  Node.js or Next.js backend          Node.js + Express

  LangChain.js / LangGraph.js         LangGraph workflow with AI
                                      integration

  AI usage mandatory                  Gemini-powered analysis and
                                      AI-assisted development

  Deployment bonus                    Separate Vercel deployments

  README overview                     Included

  How to run                          Included

  How it works                        Included

  Architecture                        Included

  Key decisions/trade-offs            Included

  Example runs                        Included

  Future improvements                 Included

  AI chat logs bonus                  Recommended in `docs/ai-chat-logs/`
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Submission Checklist

Before submitting:

-   [ ] Application works locally
-   [ ] Frontend deployment works
-   [ ] Backend deployment works
-   [ ] Frontend calls the real backend URL
-   [ ] MongoDB connection works
-   [ ] Gemini API key is configured
-   [ ] No secrets are committed
-   [ ] README matches actual implementation
-   [ ] Example runs are added
-   [ ] Deployment links are added
-   [ ] GitHub repository link is added
-   [ ] AI chat transcripts are sanitized and included if desired
-   [ ] Code is understood and explainable
-   [ ] Final end-to-end test is completed

------------------------------------------------------------------------

## Live Demo

Add the final deployed links here:

``` text
Frontend:
https://your-frontend-domain.vercel.app

Backend:
https://your-backend-domain.vercel.app

GitHub:
https://github.com/your-username/your-repository
```

Replace all placeholders before submission.

------------------------------------------------------------------------

## Disclaimer

This application is an educational AI research prototype.

It does not provide professional financial advice. AI-generated content
may contain errors, outdated information, unsupported assumptions, or
hallucinations. Users should verify information using reliable primary
sources and consult qualified professionals where appropriate.

------------------------------------------------------------------------

## Author

**Pintu Kumar**

B.Tech --- Computer Science and Engineering

------------------------------------------------------------------------

## License

This project is intended for educational, assignment, demonstration, and
portfolio purposes.

# Client Discovery Questionnaire – Autonomous / AI-Powered System

Use this questionnaire to gather all necessary information from a client before writing their Product Requirements Document (PRD) or pitch-style spec.  
Each section maps directly to a section in the `AutoLogix AI` example.

---

## 1. Project Overview & Problem Statement

- What is the **name** of the system/project?
- In **one paragraph**, what does it do?
- What **manual process** does it replace or automate?
- What are the **top 3 problems** with the current way of working?
- What **quantifiable benefits** do you expect (e.g., reduce workload by X%, save Y hours/day)?

---

## 2. Core Value Proposition

List 3–5 bullet points that describe the **primary value** for the customer. Example:

- Reduce operational cost by \_\_\_%
- Automate decision X
- Improve metric Y by \_\_\_%

---

## 3. Target Customers

Who are the **ideal early adopters**? (e.g., e-commerce, 3PLs, distributors, manufacturers)  
Any **specific company sizes** (SMB, mid-market, enterprise)?  
Any **must-have integrations** (ERP, courier APIs, warehouse systems)?

---

## 4. System Components (High-Level)

What are the **main modules**? (Example from AutoLogix AI: Order Intake, Routing Engine, Dispatch, Monitoring, Exception Handling, Predictive Intelligence)  
For each module, describe in 1–2 sentences what it does.

---

## 5. Architecture & Technical Preferences

- **Frontend:** Preferred tech (React, Angular, S3+CloudFront, etc.)
- **Backend:** Preferred language/framework (Node.js, Python, Java, etc.)
- **Compute:** Serverless, containers (ECS, Kubernetes), or VMs?
- **Database:** SQL (which one?) or NoSQL (MongoDB, DynamoDB)?
- **Cache:** Redis, Memcached, or none?
- **Storage:** Data lake, blob storage (S3, GCS)?
- **Event-driven:** Do you need queues / pub-sub (SQS, Kafka, RabbitMQ)?
- **AI Layer:** Separate agents? LLMs? Classical optimization models? Rules engine?

---

## 6. MVP Features (Phase 1)

What **must** work at launch? (Be ruthless – cut non-essentials)  
Example:

- Order intake via API only (no email/file yet)
- Rules-based routing (no AI)
- Manual dispatch fallback
- Basic tracking dashboard

What **limitations** are acceptable in the MVP?

- No predictive analytics
- Manual exception handling
- Limited courier integrations

---

## 7. Development Phases & Timeline

For each phase (typically 3–6 months each), define:

- **Duration** (e.g., 0–2 months)
- **Key deliverables**
- **Success criteria** (what does “done” look like?)

How many phases do you envision? (Suggest 3–4: Foundation → Automation → Full autonomy → Intelligence)

---

## 8. Billing & Commercial Model

How do you plan to charge clients at each phase?

- **Phase 1 (MVP):** One-time setup fee? Milestone-based? Range?
- **Phase 2 (Automation):** Monthly retainer? Suggest $\_\_\_/month
- **Phase 3 (Full autonomy):** Higher retainer + performance incentives?
- **Phase 4 (Intelligence/Scale):** SaaS + usage-based (per order, per delivery)?

Would you consider **hybrid models** (e.g., setup + small per-transaction fee)?

---

## 9. Long-Term Vision (6–18 months)

- Will this remain a **single-client** system or become multi-tenant / multi-client?
- Do you plan to **sell** the platform or use it internally?
- What **data moat** can you build (proprietary logistics data, unique algorithms)?
- What **enterprise features** might be needed later (SSO, audit logs, SLA dashboards)?

---

## 10. Key Differentiators (vs Competitors)

What makes your system **unique** compared to existing logistics software?  
Examples from AutoLogix AI:

- Full automation (not just assistance)
- Event-driven, scalable architecture
- AI decision-making at every step
- Data moat

List at least 3 differentiators.

---

## 11. Risks & Constraints

- What are the **top technical risks** (e.g., courier API reliability, AI accuracy)?
- Any **compliance or security** requirements (PII, GDPR, SOC2)?
- What **integration pain points** do you already know?
- What is the **budget range** for Phase 1 (development only)?

---

## 12. Existing Assets

- Is there **any existing code**, prototypes, or vendor tools already in use?
- Do you have **designs** (Figma, mockups)?
- Do you have **data** to train AI models (historical orders, delivery logs)?
- Any **preferred vendors** (AWS, MongoDB, Twilio, etc.)?

---

## 13. Success Metrics (KPIs)

How will you measure success after launch?  
Examples:

- % reduction in manual touches per order
- Delivery success rate improvement
- Average time from order to dispatch
- Cost per delivery

---

## Summary

After completing this questionnaire, you will have all the inputs needed to write a **structured PRD** similar to the `AutoLogix AI` document, including:

- Overview & value prop
- Target customers
- System components & architecture
- Phased roadmap + billing strategy
- Long-term vision & differentiators

---

**Instructions for the interviewer:**

- Ask open-ended questions first, then refine with multiple-choice options.
- Keep each section to 5–10 minutes of discussion.
- Record answers verbatim – they become the raw material for your markdown spec.

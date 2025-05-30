---
title: "Migrating to Linear 101"
date: 2023-01-01T11:00:00Z
author: "Phoenix Baker"
tags: ["Design", "Research", "Product"]
image: "https://picsum.photos/seed/linear-101/1200/800"
description: "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get started."
---

So, your team's decided to make the switch to **Linear**? Great choice! Linear has rapidly become a favorite for product and engineering teams thanks to its speed, clean interface, and focus on developer experience. But, like any migration, moving your existing workflows and data can feel a bit daunting.

Don't sweat it. This guide, "Migrating to Linear 101," will walk you through the essential steps to ensure a smooth transition. We'll cover everything from preparation to data import, getting your team onboard, and making the most of Linear's powerful features.

---

## Why Linear? A Quick Refresher

Before diving into the "how," let's briefly touch on the "why" Linear is such a popular choice:

* **Blazing Fast:** Designed for keyboard-first navigation and efficiency.
* **Beautiful UI/UX:** Clean, intuitive, and a joy to use daily.
* **Opinionated Workflow:** Encourages clear processes for issue tracking and project management.
* **Integrations:** Seamlessly connects with GitHub, Slack, Figma, and more.
* **Focus on Engineering Teams:** Built with developers in mind, offering features like issue branching, pull request linking, and automated workflows.

---

## Phase 1: Preparation is Key

A successful migration starts long before you touch the "import" button.

### 1. **Audit Your Current Workflow**

* **Understand Your "Why":** Why are you moving from your current tool (Jira, Asana, Trello, etc.)? What are its pain points? What do you hope Linear will solve?
* **Identify Key Data:** What information *must* come over? (e.g., issue titles, descriptions, assignees, statuses, priorities, due dates).
* **Review Current Processes:** How do you currently manage sprints, roadmaps, bugs, and features? Document these. Linear has its own way of doing things, and you'll need to adapt.

### 2. **Clean Up Your Old Data**

This is crucial. Don't import old, irrelevant, or messy data.

* **Archive/Delete Old Issues:** Get rid of anything no longer needed.
* **Consolidate Duplicates:** Merge similar issues.
* **Standardize Fields:** Ensure consistency in labels, priorities, and statuses. This will make mapping much easier.

### 3. **Define Your Linear Space**

Linear's structure (Workspaces, Teams, Cycles, Roadmaps) might be different from what you're used to.

* **Workspace:** This is your top-level organization (e.g., your company name).
* **Teams:** How will you split your work? By product area, functional team, or cross-functional groups? This is where issues live.
* **Status Workflow:** This is paramount. Design your ideal issue lifecycle (e.g., Backlog > Todo > In Progress > In Review > Done > Canceled). Linear's statuses are highly customizable.
* **Labels & Priorities:** Define a clear taxonomy. Keep it minimal and consistent.
* **Templates:** Consider creating templates for common issue types (bugs, features, improvements).

---

## Phase 2: The Migration Itself

Linear offers robust import tools.

### 1. **Utilize Linear's Import Features**

Linear supports imports from many popular tools directly.

* **Built-in Importers:** Check if Linear has a direct importer for your current tool (e.g., Jira, Asana, GitHub Issues, Trello). This is usually the easiest path.
* **CSV Import:** For other tools or more control, CSV import is your go-to.
    * **Export from Old Tool:** Export your selected, cleaned data to a CSV file.
    * **Map Fields:** Linear's CSV importer will guide you through mapping columns from your CSV to Linear fields (title, description, status, assignee, labels, etc.). Pay close attention here!
    * **Test Small:** Don't import everything at once. Do a small test import with a handful of issues to ensure the mapping works as expected.

### 2. **Consider Your Data Scope**

* **Historical Data:** Decide how much historical data you need to import. Often, only active or recent issues are necessary. Older, completed issues might be better archived in your old tool or simply referenced.
* **Attachments & Comments:** These can sometimes be tricky. Check if your chosen import method supports them. For critical attachments, you might need to re-upload manually.

---

## Phase 3: Onboarding Your Team

The best tool is useless if your team doesn't adopt it.

### 1. **Internal Communication is Key**

* **Announce the Migration:** Clearly communicate *when* the switch will happen and *why* you're moving to Linear. Highlight the benefits for the team.
* **Set Expectations:** Explain that there will be a learning curve.
* **Designate Champions:** Identify early adopters or "Linear champions" within your team who can help others.

### 2. **Training & Resources**

* **Basic Workshop:** Conduct a short, hands-on workshop covering Linear's basics:
    * Creating issues.
    * Assigning issues.
    * Using keyboard shortcuts (this is a big Linear strength!).
    * Understanding Cycles and Roadmaps.
    * Filtering and searching.
* **Create Internal Documentation:** A simple FAQ or quick-start guide with your team-specific workflows (e.g., "How we use Linear for bugs," "Our sprint process in Linear").
* **Linear's Documentation:** Point your team to Linear's excellent official documentation and video tutorials.

### 3. **Embrace Linear's Workflow**

* **Cycles instead of Sprints (or equivalent):** Linear's **Cycles** are powerful for managing time-boxed work. Get familiar with them.
* **Roadmaps:** Use **Roadmaps** for higher-level planning and visualizing your long-term goals.
* **Views & Filters:** Teach your team how to create custom views and filters to see only what's relevant to them.
* **Hotkeys:** Encourage the use of keyboard shortcuts. This is where Linear truly shines for speed.

---

## Phase 4: Post-Migration & Continuous Improvement

The migration isn't over when the data's in.

### 1. **Monitor and Adjust**

* **Gather Feedback:** Regularly check in with your team. What's working well? What's confusing?
* **Iterate on Workflows:** Your initial status workflow or label system might not be perfect. Be open to adjusting it based on real-world usage.
* **Utilize Analytics:** Linear offers insights into team performance and issue progress. Use these to identify bottlenecks or areas for improvement.

### 2. **Integrate and Automate**

* **GitHub/GitLab/Bitbucket:** Connect your repositories to link branches, pull requests, and commits directly to Linear issues.
* **Slack:** Set up notifications for issue updates in relevant channels.
* **Figma, Sentry, Zendesk:** Integrate other tools in your stack to streamline workflows.
* **Linear Automations:** Explore setting up custom automations to reduce manual tasks (e.g., automatically close issues when a PR merges).

---

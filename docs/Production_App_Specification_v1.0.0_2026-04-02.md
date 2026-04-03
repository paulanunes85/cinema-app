---
title: "Production Bible App, Functional Specification"
description: "Collaborative web and mobile platform for audiovisual pre-production management, designed from the perspective of an Assistant Director"
author: "Sofia Silva"
date: "2026-04-02"
version: "1.0.0"
status: "draft"
tags: ["product-spec", "audiovisual", "pre-production", "collaboration", "react", "react-native"]
---

# Production Bible App, Functional Specification

> A collaborative web and mobile platform designed specifically for audiovisual pre-production management, replacing fragmented workflows with a single, structured, role-based environment.

## Change Log

| Version | Date       | Author      | Changes         |
|---------|------------|-------------|-----------------|
| 1.0.0   | 2026-04-02 | Sofia Silva | Initial version |

## Table of Contents

- [Production Bible App, Functional Specification](#production-bible-app-functional-specification)
  - [Change Log](#change-log)
  - [Table of Contents](#table-of-contents)
  - [1. Origin Story](#1-origin-story)
  - [2. Purpose and Vision](#2-purpose-and-vision)
  - [3. Target Users and Roles](#3-target-users-and-roles)
    - [3.1 Primary User Roles](#31-primary-user-roles)
    - [3.2 Role Characteristics](#32-role-characteristics)
  - [4. Supported Platforms](#4-supported-platforms)
  - [5. Authentication and User Profile](#5-authentication-and-user-profile)
    - [5.1 Authentication](#51-authentication)
    - [5.2 User Profile Setup](#52-user-profile-setup)
  - [6. Core Concepts and Data Model](#6-core-concepts-and-data-model)
    - [6.1 Project](#61-project)
    - [6.2 Department Spaces](#62-department-spaces)
    - [6.3 Objectives (Core Unit)](#63-objectives-core-unit)
  - [7. Objective Lifecycle and Status](#7-objective-lifecycle-and-status)
    - [7.1 In Progress Behavior](#71-in-progress-behavior)
    - [7.2 Completed Behavior](#72-completed-behavior)
  - [8. Objective Detail View](#8-objective-detail-view)
    - [8.1 Objective Overview](#81-objective-overview)
    - [8.2 "What Is Normally Done" Summary](#82-what-is-normally-done-summary)
    - [8.3 Director's Creative Vision](#83-directors-creative-vision)
    - [8.4 Defined Decisions](#84-defined-decisions)
    - [8.5 Document and Link Area](#85-document-and-link-area)
    - [8.6 Comments and Collaboration](#86-comments-and-collaboration)
  - [9. Templates](#9-templates)
  - [10. Checklists and Progress Tracking](#10-checklists-and-progress-tracking)
    - [10.1 Department Checklist](#101-department-checklist)
    - [10.2 Progress Calculation](#102-progress-calculation)
  - [11. Supervision Mode (Director and AD)](#11-supervision-mode-director-and-ad)
  - [12. Permissions and Governance](#12-permissions-and-governance)
  - [13. Real-Time Collaboration and Auto-Save](#13-real-time-collaboration-and-auto-save)
  - [14. Functional Requirements](#14-functional-requirements)
    - [14.1 Authentication and User Management](#141-authentication-and-user-management)
    - [14.2 Project Management](#142-project-management)
    - [14.3 Department Spaces](#143-department-spaces)
    - [14.4 Objectives](#144-objectives)
    - [14.5 Comments and Collaboration](#145-comments-and-collaboration)
    - [14.6 Templates](#146-templates)
    - [14.7 Supervision Mode](#147-supervision-mode)
    - [14.8 Real-Time and Auto-Save](#148-real-time-and-auto-save)
    - [14.9 Interface and Personalization](#149-interface-and-personalization)
  - [15. UI/UX Principles](#15-uiux-principles)
    - [15.1 Design Guidelines](#151-design-guidelines)
    - [15.2 Color Palette (UX-Friendly, Pastel)](#152-color-palette-ux-friendly-pastel)
  - [16. Non-Goals (Out of Scope for MVP)](#16-non-goals-out-of-scope-for-mvp)
  - [17. Key Differentiators](#17-key-differentiators)

---

## 1. Origin Story

Hi, my name is Sofia, I'm 21 and I study cinema at Belas Artes. On my projects I work as an assistant director, which basically means I'm the person who has to keep track of everything that's happening across all departments during a production. I've been through enough projects now to realize that the way we manage pre-production is kind of a mess. Everything is scattered across Google Drive folders, WhatsApp groups, random documents, and it's honestly exhausting trying to find what was decided about a specific scene or who's doing what. So I came up with this idea for an app that would fix all of that and make the whole process way more organized and accessible for everyone on the crew.

Help me create a web application, it can also be mobile, to access an app or site where the main function is to create a space for each department of an audiovisual production to see what is being asked of their area, like next steps, stages, objectives.

I work as an AD on audiovisual productions and I want to create a space to see how each area is progressing, where the director can follow whether the vision for their project is being followed and all that. Like a community space.

For example, a director of photography logs in and sees that they still need to make the light map for a certain location during pre-production and the date they need to do it based on the schedule, and right there they have the director's vision for that scene and a summary of what has already been discussed about it.

Basically an app that works as an interactive online production bible, where you can have spaces for each part of pre-production divided by area, and if two or more areas share the same objective they can collaborate, like art and cinematography. It can store mood boards, spreadsheets, summaries and all that.

But the most important thing is being able to see what the next steps are, consulting what has been defined so far so you don't have to dig through ten thousand different documents.

The app has a simple interface, it's well organized between functions, with a clean aesthetic, and has an area to put your own documents in the form of links. When you log in you indicate your role and the app shows you the goals for it, and if you have more than one role it shows more than one checklist.

If another person in your area already completed a task, it shows up on your app too marked as done, and you can open it, check it out, leave suggestions in the comments and everything.

There's a central part with a checklist of goals for your area. If you click on one, a summary comes up of what is normally done for that type of document, a summary of what the director had in mind for it, and a space to put the link to where your research or graphic or map or whatever is.

When you're done you just mark it as complete and the task shows up as finished on the central checklist.

On the checklist you can mark things as in progress or done. When you mark something as in progress your icon shows up next to it so people know you're working on it. If a colleague joins in, their icon shows up too so you know who has the most context in case you need help. When you mark it as done, the task gets more transparent and changes color. And the progress percentage for your area goes up.

We're going to use the best stack for this. For the web app we'll use React and for the mobile version on the App Store we'll use React Native, using the most modern solutions for this kind of app. Same database and everything else needed for the app to work on both web and mobile.

For login we'll use SSO with Google or Apple ID on mobile. On the web app we'll have login via SSO with Gmail and on mobile the options are Google or Apple.

When you fill out your profile you select your role and put your name. For the director and assistant director roles there's a different version from the others, kind of like a supervision mode where you can see all the checklists and a progress percentage for each area. But you can only access the documents that were posted when an area marks them as done, so there's real-time collaboration. Auto-save happens as you use the app. If you and other members are working on the same objective at the same time, the icons of whoever is responsible show up next to the objective so you know who to talk to if you have questions or need help.

Basically the director and AD can see everything and also jump in and help on objectives. The other roles can choose between helping other areas or just seeing their own objectives so the interface doesn't get too cluttered with stuff that's not relevant to them.

Light color palette with good contrasts but in pastel tones. White background. Suggest colors that are UX friendly and follow best practices for what our app does.

---

## 2. Purpose and Vision

This application is a collaborative web and mobile platform designed specifically for audiovisual pre-production management. Its goal is to centralize tasks, creative decisions, documents, and progress tracking into a single, structured, and role-based environment, replacing fragmented workflows spread across Google Drive, WhatsApp, emails, and disconnected documents.

The platform works as an **interactive production bible**, focused on process, visibility, and collaboration, rather than just file storage.

## 3. Target Users and Roles

### 3.1 Primary User Roles

- **Director** , overall creative lead with supervision access
- **Assistant Director (AD)** , production coordination with supervision access
- **Department Heads** , e.g. Cinematography, Art, Sound, Costume, Production Design
- **Department Team Members** , crew within a specific department

### 3.2 Role Characteristics

- Users can have one or multiple roles.
- The interface adapts dynamically based on assigned roles.
- Director and AD roles grant access to Supervision Mode (see [Section 11](#11-supervision-mode-director-and-ad)).

## 4. Supported Platforms

| Platform | Technology   | Auth Methods          |
|----------|--------------|-----------------------|
| Web      | React        | Google SSO (Gmail)    |
| Mobile   | React Native | Google SSO, Apple ID  |

Both platforms share the same backend and database to ensure a unified experience.

## 5. Authentication and User Profile

### 5.1 Authentication

- **Web:** Google SSO (Gmail)
- **Mobile:** Google SSO or Apple ID SSO

### 5.2 User Profile Setup

Upon first login, the user must:

1. Enter their display name
2. Select one or more production roles
3. Optionally select departments they belong to

The system uses this information to personalize visible objectives, checklists, and permissions.

## 6. Core Concepts and Data Model

### 6.1 Project

A **project** represents a single audiovisual production. Each project contains departments, objectives, tasks, documents, and collaborators.

### 6.2 Department Spaces

Each production department has its own dedicated space, containing objectives, checklists, documents, comments, and progress tracking. Departments are isolated visually but connected through shared objectives.

### 6.3 Objectives (Core Unit)

An **objective** represents a concrete pre-production deliverable. Examples include:

- Lighting map for a location
- Moodboard for a scene
- Sound reference research
- Costume concept for a character

Each objective belongs to a primary department and can optionally be shared with one or more additional departments for cross-area collaboration.

## 7. Objective Lifecycle and Status

Each objective progresses through the following states:

| State       | Visual Indicator                                    |
|-------------|-----------------------------------------------------|
| Not Started | Default style, no collaborator icons                |
| In Progress | Pastel yellow highlight, active collaborator avatars |
| Completed   | Soft green, increased transparency, color shift      |

### 7.1 In Progress Behavior

When a user marks an objective as "In Progress," their avatar/icon appears next to the objective. If multiple users are working on the same objective, all active collaborators are shown. This provides real-time context awareness, so crew members know who to talk to for questions or help.

### 7.2 Completed Behavior

When marked as "Completed," the task becomes more transparent and changes color on the central checklist. The department's progress percentage increases accordingly.

## 8. Objective Detail View

When clicking an objective, the user sees the following sections:

### 8.1 Objective Overview

- Objective title
- Associated department(s)
- Deadline and/or production phase
- Related scene or location (optional)

### 8.2 "What Is Normally Done" Summary

A short, predefined description explaining what this type of deliverable usually includes and the key expectations. This is especially useful for students and junior crew members who may be encountering a deliverable type for the first time.

### 8.3 Director's Creative Vision

A dedicated section containing the director's notes, visual references (links), and conceptual intent for that objective or scene.

### 8.4 Defined Decisions

A structured notes area where key creative or logistical decisions are recorded. Decisions are timestamped and attributed to users.

**Example:** "Decided on March 12 that the scene will be handheld and low contrast."

### 8.5 Document and Link Area

Instead of hosting files directly, the app stores links to external documents (Google Drive, Figma, Dropbox, etc.). Each link can have:

- A short description
- Author name
- Last update timestamp

### 8.6 Comments and Collaboration

Each objective includes:

- Threaded comments
- @mentions to notify specific crew members
- Lightweight reactions (e.g. ✅ 👀 👍)

Comments are always contextual and tied to the specific objective.

## 9. Templates

Each objective type can have an associated template defining expected content, structure guidelines, and an optional internal checklist. Templates are predefined by the system and editable by Directors/ADs on a per-project basis.

## 10. Checklists and Progress Tracking

### 10.1 Department Checklist

Each department has a central checklist showing all its objectives, current status, and assigned collaborators.

### 10.2 Progress Calculation

Each completed objective increases the department's completion percentage. Progress is computed automatically based on objectives marked as "Completed" relative to the total number of objectives.

## 11. Supervision Mode (Director and AD)

Directors and ADs have access to **Supervision Mode**, which allows them to:

- View all departments and their checklists
- See progress percentages per area
- Access objectives marked as "Completed" (including documents)
- Review decisions and documents
- Comment and assist on any objective

They **cannot** edit unfinished documents unless actively collaborating on the objective. This ensures transparency and creative alignment through non-intrusive supervision.

## 12. Permissions and Governance

| Action                         | Department Members | Director / AD |
|--------------------------------|:------------------:|:-------------:|
| View own objectives            | ✅                  | ✅             |
| View other departments (opt-in)| ✅                  | ✅             |
| Mark objective as completed    | ✅ (if assigned)    | ✅             |
| Comment on objectives          | ✅                  | ✅             |
| Add decisions                  | ✅                  | ✅             |
| Change objective status        | ✅                  | ✅             |
| Access Supervision Mode        | ❌                  | ✅             |
| Edit templates                 | ❌                  | ✅             |

Permissions are designed to be simple and non-bureaucratic.

## 13. Real-Time Collaboration and Auto-Save

- All edits auto-save as the user works.
- Real-time updates propagate status changes and collaborators joining/leaving.
- Presence indicators (avatars next to objectives) reduce duplicated work and confusion.

## 14. Functional Requirements

This section enumerates the functional requirements derived from the product vision and specification above. Each requirement is tagged with a unique identifier for traceability.

### 14.1 Authentication and User Management

| ID       | Requirement                                                                                         | Priority |
|----------|-----------------------------------------------------------------------------------------------------|----------|
| FR-AU-01 | The system shall support Google SSO authentication on the web platform.                             | Must     |
| FR-AU-02 | The system shall support Google SSO and Apple ID SSO authentication on the mobile platform.         | Must     |
| FR-AU-03 | On first login, the system shall require users to enter a display name.                             | Must     |
| FR-AU-04 | On first login, the system shall require users to select one or more production roles.              | Must     |
| FR-AU-05 | On first login, the system shall allow users to optionally select department memberships.            | Must     |
| FR-AU-06 | The system shall persist user sessions and support automatic re-authentication.                     | Must     |
| FR-AU-07 | The system shall allow users to edit their profile (name, roles, departments) after initial setup.  | Should   |

### 14.2 Project Management

| ID       | Requirement                                                                                         | Priority |
|----------|-----------------------------------------------------------------------------------------------------|----------|
| FR-PM-01 | The system shall allow creation of new audiovisual production projects.                             | Must     |
| FR-PM-02 | Each project shall contain departments, objectives, tasks, documents, and collaborators.            | Must     |
| FR-PM-03 | The system shall allow inviting collaborators to a project via link or email.                       | Must     |
| FR-PM-04 | The system shall support multiple concurrent projects per user.                                     | Should   |
| FR-PM-05 | The system shall allow archiving completed projects.                                                | Should   |

### 14.3 Department Spaces

| ID       | Requirement                                                                                         | Priority |
|----------|-----------------------------------------------------------------------------------------------------|----------|
| FR-DS-01 | Each project shall have dedicated department spaces (Cinematography, Art, Sound, Costume, etc.).    | Must     |
| FR-DS-02 | Each department space shall display its own checklist of objectives.                                | Must     |
| FR-DS-03 | Department spaces shall be visually isolated but connected through shared objectives.               | Must     |
| FR-DS-04 | The system shall display a progress percentage per department based on completed objectives.        | Must     |
| FR-DS-05 | The system shall allow custom department creation per project.                                      | Should   |

### 14.4 Objectives

| ID       | Requirement                                                                                         | Priority |
|----------|-----------------------------------------------------------------------------------------------------|----------|
| FR-OB-01 | The system shall allow creation of objectives within a department.                                  | Must     |
| FR-OB-02 | Each objective shall have a title, description, associated department(s), and optional deadline.     | Must     |
| FR-OB-03 | Objectives shall support three statuses: Not Started, In Progress, and Completed.                  | Must     |
| FR-OB-04 | When a user marks an objective as "In Progress," their avatar shall appear next to it.              | Must     |
| FR-OB-05 | When multiple users are working on the same objective, all active collaborator avatars shall display.| Must     |
| FR-OB-06 | Completed objectives shall visually change (transparency increase, color shift, position change).   | Must     |
| FR-OB-07 | Objectives shall be shareable across two or more departments for cross-area collaboration.          | Must     |
| FR-OB-08 | Each objective detail view shall include a "What Is Normally Done" predefined summary.              | Must     |
| FR-OB-09 | Each objective detail view shall include a "Director's Creative Vision" section.                    | Must     |
| FR-OB-10 | Each objective detail view shall include a "Defined Decisions" log with timestamps and attribution.  | Must     |
| FR-OB-11 | Each objective detail view shall include a document/link area for external references.              | Must     |
| FR-OB-12 | Each link attachment shall store a short description, author name, and last update timestamp.       | Must     |
| FR-OB-13 | Objective status changes shall be reflected in real time for all project members.                   | Must     |
| FR-OB-14 | The system shall allow associating objectives with specific scenes or locations.                    | Should   |

### 14.5 Comments and Collaboration

| ID       | Requirement                                                                                         | Priority |
|----------|-----------------------------------------------------------------------------------------------------|----------|
| FR-CC-01 | Each objective shall support threaded comments.                                                    | Must     |
| FR-CC-02 | Comments shall support @mentions to notify specific crew members.                                  | Must     |
| FR-CC-03 | Comments shall support lightweight reactions (✅ 👀 👍).                                            | Should   |
| FR-CC-04 | Comments shall be contextual and tied to the specific objective.                                   | Must     |

### 14.6 Templates

| ID       | Requirement                                                                                         | Priority |
|----------|-----------------------------------------------------------------------------------------------------|----------|
| FR-TP-01 | The system shall provide predefined templates for common objective types.                           | Must     |
| FR-TP-02 | Templates shall define expected content, structure guidelines, and optional internal checklists.    | Must     |
| FR-TP-03 | Directors and ADs shall be able to edit templates on a per-project basis.                           | Must     |
| FR-TP-04 | The system shall associate templates with objective types automatically when creating new objectives.| Should   |

### 14.7 Supervision Mode

| ID       | Requirement                                                                                         | Priority |
|----------|-----------------------------------------------------------------------------------------------------|----------|
| FR-SM-01 | Director and AD roles shall have access to Supervision Mode.                                       | Must     |
| FR-SM-02 | Supervision Mode shall display all departments with their checklists and progress percentages.     | Must     |
| FR-SM-03 | In Supervision Mode, completed objectives' documents shall be accessible for review.               | Must     |
| FR-SM-04 | Directors/ADs shall be able to comment on and assist with any objective.                           | Must     |
| FR-SM-05 | Directors/ADs shall not be able to edit unfinished documents unless actively collaborating.         | Must     |

### 14.8 Real-Time and Auto-Save

| ID       | Requirement                                                                                         | Priority |
|----------|-----------------------------------------------------------------------------------------------------|----------|
| FR-RT-01 | All edits shall auto-save without requiring manual save actions.                                   | Must     |
| FR-RT-02 | Status changes shall propagate to all connected clients in real time.                              | Must     |
| FR-RT-03 | Presence indicators shall show which users are currently active on an objective.                   | Must     |
| FR-RT-04 | The system shall handle concurrent edits gracefully without data loss.                             | Must     |

### 14.9 Interface and Personalization

| ID       | Requirement                                                                                         | Priority |
|----------|-----------------------------------------------------------------------------------------------------|----------|
| FR-UI-01 | The interface shall adapt dynamically based on the user's assigned roles.                          | Must     |
| FR-UI-02 | Users with multiple roles shall see combined checklists from all their roles.                      | Must     |
| FR-UI-03 | Non-supervisory users shall be able to toggle between viewing only their department or all departments.| Must  |
| FR-UI-04 | The app shall use a light, pastel color palette with a white background.                           | Must     |
| FR-UI-05 | Status shall always be indicated by icons and text in addition to color (accessibility).           | Must     |
| FR-UI-06 | The interface shall be consistent between web and mobile versions.                                 | Must     |
| FR-UI-07 | The system shall support push notifications for @mentions and objective status changes.            | Should   |

## 15. UI/UX Principles

### 15.1 Design Guidelines

- Minimalist, clean interface with clear visual hierarchy.
- No feed-based noise. Everything is tied to objectives.
- Objective-centric navigation, not document-centric.

### 15.2 Color Palette (UX-Friendly, Pastel)

| Element            | Color                    | Hex       |
|--------------------|--------------------------|-----------|
| Background         | White                    | `#FFFFFF` |
| Section background | Light gray               | `#F7F7F9` |
| Primary actions    | Soft blue                | `#4A6CF7` |
| In Progress        | Pastel yellow            | `#F2C94C` |
| Completed          | Soft green               | `#6FCF97` |
| Comments / notes   | Light lilac              | `#BDB2FF` |
| Text (primary)     | Dark gray                | `#1F2937` |
| Text (secondary)   | Medium gray              | `#6B7280` |

**Accessibility note:** Colors are never the only indicator of status. Icons and text labels are always present alongside color cues.

## 16. Non-Goals (Out of Scope for MVP)

- No budgeting or accounting features
- No casting management
- No messaging outside objective context
- No file hosting (links only)

## 17. Key Differentiators

- Built specifically for audiovisual pre-production
- Combines creative vision with task execution
- Objective-centric, not document-centric
- Encourages collaboration across departments
- Designed from the perspective of an Assistant Director

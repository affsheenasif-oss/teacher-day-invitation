# 🎓 Teacher’s Day Digital Invitation 2026
### Department of Electrical Engineering

A luxury, modern, and mobile-first digital invitation website for university professors and engineers on the occasion of **Teacher's Day Celebration 2026**.

---

## 📅 Event Overview

- **Event:** Teacher’s Day Celebration 2026
- **Date:** 5 October 2026
- **Time:** 1:00 PM
- **Venue:** Room 66
- **Department:** Electrical Engineering Department

---

## 🔗 The 9 Personalized Teacher Links

This project uses **one single HTML file** with dynamic client-side routing. Each teacher gets their own unique link that displays their exact title and name.

| # | Teacher Name | Unique Personalized Link |
|---|---|---|
| 1 | **Prof. Dr. Irfan Abid** | `/invite/irfan-abid` |
| 2 | **Prof. Muhammad Junaid** | `/invite/muhammad-junaid` |
| 3 | **Dr. Umer Khan** | `/invite/umer-khan` |
| 4 | **Engr. Fahid Randhawa** | `/invite/fahid-randhawa` |
| 5 | **Engr. Aftab Ahmed** | `/invite/aftab-ahmed` |
| 6 | **Engr. Saqlain** | `/invite/saqlain` |
| 7 | **Engr. Abubakar** | `/invite/abubakar` |
| 8 | **Engr. Abdul Basit** | `/invite/abdul-basit` |
| 9 | **Engr. Ahsan** | `/invite/ahsan` |

> 💡 **Quick Copy & WhatsApp Feature:** When running the website, tap the **"Teacher Links"** button in the top right navigation bar to open the admin drawer. From there, you can view, copy direct URLs, or send a pre-filled respectful WhatsApp message to each teacher with one tap!

---

## 🛠️ How to Customize

All event details and teacher data are located at the very top of `script.js` in the `INVITATION_CONFIG` object:

```javascript
const INVITATION_CONFIG = {
  eventTitle: "Teacher’s Day Celebration 2026",
  eventDate: "5 October 2026",
  eventTime: "1:00 PM",
  eventVenue: "Room 66",
  department: "Electrical Engineering Department",

  // Custom Audio (optional):
  // Set to an MP3 URL (e.g. 'assets/ambient.mp3') or leave null for built-in luxury piano synthesizer
  customAudioUrl: null,

  // Teachers List:
  teachers: [
    { id: 1, slug: "irfan-abid", titleAndName: "Prof. Dr. Irfan Abid" },
    ...
  ]
};
```

---

## 🚀 Free Deployment Guide

### Option 1: Vercel (Recommended - 1 Minute)
1. Push this folder to a GitHub repository or drag-and-drop onto [Vercel](https://vercel.com).
2. The included `vercel.json` already contains rewrite rules, so `/invite/irfan-abid` and direct page reloads work immediately out of the box!

### Option 2: Netlify (Drag & Drop - 30 Seconds)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop this whole folder into the browser window.
3. The included `_redirects` file automatically ensures clean URLs like `/invite/muhammad-junaid` route to `index.html` with an HTTP 200 status.

### Option 3: GitHub Pages
1. Push this repository to GitHub.
2. In GitHub, go to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`, then click **Save**.
4. The included `404.html` and receiver script in `index.html` automatically route any `/invite/:slug` URL without 404 errors!

---

## 💻 Local Testing

You can preview the project locally using any of these commands in your terminal:

```bash
# Using Node.js npx:
npx serve .

# Or using Python:
python -m http.server 8000
```

Then open `http://localhost:8000` or `http://localhost:8000/invite/irfan-abid` in your web browser.

---

## ✨ Features Included

- **Royal Ivory & Deep Navy Aesthetic:** Designed specifically for university faculty with gold borders, refined typography, and subtle starlight particles.
- **Dynamic Teacher Personalization:** Single codebase serving all 9 professors and engineers dynamically.
- **Interactive Unseal Opening:** Velvet animated opening cover with "Open Your Invitation 💌" button.
- **Add to Calendar (.ICS):** Generates and downloads native calendar events for Google Calendar, Apple Calendar, and Outlook.
- **WhatsApp RSVP Integration:** Pre-fills a respectful acceptance note for teachers to reply to student coordinators.
- **Web Audio Ambient Music:** Built-in peaceful acoustic harp/piano synthesizer that starts seamlessly on invitation open without needing external MP3 hosting.
- **404 Handling:** Friendly "Invitation Not Found" screen if an invalid slug is entered, with an option to explore the teacher directory.
- **Mobile-First Touch Design:** Optimized for WhatsApp link clicks on iOS and Android devices.

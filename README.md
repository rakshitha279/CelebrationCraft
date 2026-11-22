# CelebrationCraft

A responsive React single-page application for browsing celebration packages, requesting bookings, and adding custom themes.

## Requirements
- Node.js 18 or later
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Features
- Home page with Birthday, Haldi Ceremony, Marriage, and Baby Shower category links
- Event catalog with live search by package name or category
- Reusable package card component receiving event data through props
- Booking form using React state, required fields, email/date/guest validation, and a success confirmation
- Custom package form that adds a package to the live React state list
- Local browser storage for custom packages and booking requests
- Responsive layout for mobile, tablet, and desktop

## Notes
This is a front-end demonstration. Booking requests are stored in the browser's localStorage; no server or real payment/booking service is connected.

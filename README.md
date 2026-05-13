# safeskies-web-app

Real-time disaster alert &amp; safety monitoring dashboard. Aggregates NASA EONET events, local incident reports, and interactive mapping .

![SafeSkies Dashboard](assets/icons/dashboard.png)

## ﾟ𐦍༘⋆ Key Features

- ❁ **Live NASA EONET Alerts** with intelligent timeout & local fallback
- ❁ **Interactive Map View** with zone tracking, city search & smooth fly-to navigation
- ❁ **Real-Time Incident Feed** (traffic, accidents, weather, fires)
- ❁ **Smart Notification System** with unread tracking & one-tap resolution
- ❁ **Online/Offline Detection** with `localStorage` caching for uninterrupted access
- ❁ **Responsive Dashboard** with QR onboarding & help modals

## ﾟ𐦍༘⋆ Tech Stack

- React + Hooks (`useState`, `useEffect`)
- CSS Modules + Global Styling
- Axios & Fetch API
- Socket.IO Client (ready for real-time push)
- NASA EONET API & OpenStreetMap/Nominatim
- Leaflet (via map overrides)

## ﾟ𐦍༘⋆ Quick Start

```bash
npm install
npm run dev
```

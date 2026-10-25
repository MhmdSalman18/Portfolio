// Project copy is based on supplied development notes and the Prime Valet work history.
// Selected Work uses original marketing posters, not app screenshots.
window.PORTFOLIO_PROJECTS = {
  kadi: {
    title: 'Kadi Undo',
    subtitle: 'Find today’s local snacks. Share what’s fresh, close by.',
    category: 'Community discovery · Android-first KMP',
    platform: 'Android · shared KMP code',
    stack: 'Kotlin · Compose Multiplatform · Supabase',
    type: 'Community discovery app',
    symbol: '☕',
    visual: ['Good snacks.', 'Closer to you.'],
    notice: 'Android is the current app target. Kotlin and Compose code is shared; an iOS host is planned. The portfolio poster is original promotional artwork.',
    problem: 'A snack report is only useful if it is nearby and still relevant. Kadi Undo brings today’s community reports, availability updates, and permanent shop listings into one Android-first experience.',
    approach: 'A shared Kotlin Multiplatform and Compose Multiplatform layer handles UI, models, store, and repository logic. Supabase provides authenticated persistence, while MapLibre and OpenFreeMap support the Android map. Today’s reports expire from the feed at Kerala midnight; permanent shops remain discoverable.',
    contribution: 'Built the community reporting experience with snack filters, distance-based discovery, map markers, photo capture and compressed uploads, availability voting, and a persistent shop directory. Added Chaya Time for offline instrumentals, layered ambience, phone-selected audio, and sleep timers, alongside nearby push notifications.',
    details: [
      'Nearby discovery: 2, 5, 10, and 25 km radius choices, with reports sorted by distance.',
      'Backend integrity: server timestamps, idempotent submissions, a server-enforced daily report limit, and one editable availability vote per user per report.',
      'Audio lifecycle: playback responds to app backgrounding, audio-focus loss, and headphone disconnection.',
      'Notifications: a durable queue, retry backoff, lease recovery, and client checks for duplicate, expired, or wrong-account alerts.'
    ],
    resultsTitle: 'Verification & current scope',
    outcome: 'Recorded verification includes a successful Android build, 60 shared tests, 183 local database checks, and 35 backend tests. Basic two-phone notification delivery was confirmed during testing. Broader physical-device scenarios remain on the QA checklist; iOS, public signup, Google sign-in, and moderation are future work.',
    footer: 'Community · maps · audio · notifications',
    next: 'credence'
  },
  credence: {
    title: 'CredenceAI',
    subtitle: 'Less manual logging. A clearer view of everyday spending.',
    category: 'Personal finance · Native Android',
    platform: 'Android',
    stack: 'Kotlin · Compose · Hilt · Room',
    type: 'Personal finance manager',
    symbol: '₹',
    visual: ['Less logging.', 'More clarity.'],
    notice: 'Transaction parsing and Room storage run on device. The portfolio poster is original promotional artwork.',
    problem: 'Manual expense entry creates friction every time a payment happens. CredenceAI is designed to turn relevant payment and bank notifications into structured transactions, so everyday tracking needs less repetitive input.',
    approach: 'An Android NotificationListenerService filters relevant financial notifications before a multi-pass, rules-based parser identifies debit or credit activity and extracts the amount. Room provides local transaction storage, with Compose dashboards presenting spending, income, and budgets.',
    contribution: 'Implemented notification-driven expense capture, Indian payment and bank-alert parsing, monthly financial summaries, budget progress, and CSV export. Organized the app into presentation, domain, and data layers, with dependency injection and reactive state management.',
    details: [
      'Notification filtering: payment-app package checks and bank sender-pattern recognition.',
      'Parsing safeguards: separates debit and credit phrases and rejects OTPs, login reminders, and promotional messages.',
      'Architecture: pure Kotlin domain models and use cases, repository interfaces, Room DAOs, and ViewModels exposing StateFlow.',
      'Platform integration: Hilt dependency injection, DataStore preferences, and user-granted notification access.'
    ],
    resultsTitle: 'What this project demonstrates',
    outcome: 'The project connects Android background-service integration, deterministic text parsing, local persistence, and a reactive Compose interface. Transactions can be reviewed in the dashboard and exported as CSV. Notification access is explicitly granted by the user through Android settings.',
    footer: 'On-device parsing · local persistence',
    links: [{label: 'Explore my GitHub', url: 'https://github.com/MhmdSalman18'}],
    next: 'valet'
  },
  valet: {
    title: 'Prime Valet',
    subtitle: 'Android workflows for the journey from arrival to handover.',
    category: 'Professional work · Valet operations',
    platform: 'Android',
    stack: 'Kotlin · Compose · Retrofit · Room',
    type: 'Company project · Android contribution',
    symbol: '↗',
    visual: ['From arrival', 'to handover.'],
    notice: 'Professional Android contribution · original promotional artwork.',
    problem: 'Valet executives need to record vehicle incidents during both parking and return. Photos and incident details must stay recoverable when an upload fails, and the interface must distinguish a saved draft from a confirmed backend submission.',
    approach: 'A shared incident-reporting flow is available from Confirm Parking and Request Details, with vehicle and registration details filled from the active workflow. Incident types load from the backend. Attached photos upload before the report is submitted, and success is shown only after the API confirms the submission.',
    contribution: 'Integrated incident-type retrieval, incident reporting, and photo uploads into the Android parking and vehicle-return flows. Added local recovery of incident drafts and photos after upload failure, and updated the successful-delivery flow to return Home before displaying the backend’s confirmation message.',
    details: [
      'Workflow integration: the same incident entry point is available during parking and vehicle return.',
      'Evidence handling: attached photos are uploaded before the incident report is submitted.',
      'Failure recovery: incident details and photos remain available locally if an upload fails.',
      'Android stack: Kotlin, Jetpack Compose, Retrofit, Room, and Hilt, confirmed in the project dependencies.'
    ],
    resultsTitle: 'Verification & ownership',
    outcome: 'The incident-flow integration passed its Android build and unit tests. Live incident submission remains on the device-test checklist. Scope: Android workflow and API integration within the team-owned application.',
    footer: 'Professional work · selected contributions',
    next: 'eco'
  },
  eco: {
    title: 'EcoMap',
    subtitle: 'Community-driven biodiversity mapping, one sighting at a time.',
    category: 'Citizen science · Flutter mobile app',
    platform: 'Mobile · Android APK available',
    stack: 'Flutter · Dart · MapLibre · MongoDB',
    type: 'Community biodiversity mapping',
    symbol: '✳',
    visual: ['Small sightings.', 'Bigger picture.'],
    notice: 'Original promotional artwork. AI species recognition, advanced analytics, and Node.js backend expansion are planned features.',
    problem: 'Nature enthusiasts, researchers, and conservationists need a shared way to record species sightings with useful location context. EcoMap connects community observations with expert review and a visual picture of biodiversity.',
    approach: 'A Flutter and Dart mobile experience lets users capture species images with geolocation, save drafts offline, and upload when connectivity returns. Expert validation supports the review flow, while an interactive heatmap brings recorded sightings together.',
    contribution: 'Built the mobile biodiversity mapping experience around image capture, geotagged submissions, offline drafts, expert review, and map-based discovery. The supplied project stack uses MapLibre through maplibre_gl and MongoDB.',
    details: [
      'Capture and geotag: submit photos of animals, plants, and other species with location data.',
      'Interactive mapping: explore recorded sightings through a heatmap.',
      'Community and review: connect citizen observations with biodiversity expert validation.',
      'Offline support: preserve drafts and upload after reconnecting.'
    ],
    resultsTitle: 'Available build & roadmap',
    outcome: 'An Android APK is available via the v1.0 GitHub release. Next steps include AI-powered species recognition, advanced biodiversity analytics, and Node.js backend expansion.',
    footer: 'Citizen science · biodiversity · offline drafts',
    links: [{label: 'Download Android APK', url: 'https://github.com/MhmdSalman18/Ecomap/releases/download/v1.0/Ecomap.apk'}],
    next: 'kadi'
  }
};

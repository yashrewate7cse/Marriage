# Ruby Hour — Interactive Wedding Invitation

A responsive invitation-page starter inspired by the supplied Ruby Hour reference. It includes a glitter-style entry screen, reveal transitions, sections for the event, a live countdown, calendar download, RSVP demo form, and music controls.

## Run it
1. Unzip the folder.
2. Open `index.html` in a browser, or deploy the folder to Netlify / GitHub Pages.
3. For best results, use a local development server (VS Code Live Server).

## Add the requested song
The project intentionally does not include a copyrighted recording.
- Obtain a copy of **“Feeling Good” by Michael Bublé** through a source that grants you the right to use it.
- Name the file `feeling-good.mp3`.
- Put it inside `assets/`.
- The opening **Tap to enter** interaction starts playback. This is necessary because browsers generally block audible autoplay before a user gesture.
- The music button remains available to pause/resume.

## Customize
Search in `index.html` for:
- Aurelia / Sebastian
- 12 June 2027
- The Grand Estate / Nagpur
- RSVP deadline and event details

Update the countdown target in `script.js` and calendar event date/time in the calendar section of `script.js`.

## Images and fonts
The demo uses Google Fonts and remote Unsplash image URLs. Replace them with your own licensed images for a production invitation. Internet access is required for those remote assets.

## RSVP form
The RSVP currently displays a local demo confirmation only; it does not send or store submissions. Connect Netlify Forms, Formspree, Firebase, or your own backend before publishing.

## Note
This is an original implementation inspired by the visual structure and interaction ideas of the reference page, not the original site's source code or assets.

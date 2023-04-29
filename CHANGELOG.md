## v2.2.0 - Fixes, Tweaks and Modifier Presets

##### 29th April 2023

#### Added

-   You can now save modifier presets in the Modify script app
-   Added analytics (don't freak out, I'm literally just counting page views and visitor counts, no other data, I just have no idea how many people actually use the site lol)
-   Added modifier presets
-   Made it possible to directly save the heatmap from the modified funscript

#### Changed

-   Made it clearer whether the handy was delayed or advanced in the local player
-   Increased the range and keyboard-step-interval for the handy delay slider in the local player
-   Made the warning error in the custom modifier block flash for extra visibility

#### Fixed

-   Fixed a bug that totally broke local script playback (oops)
-   Fixed a bug that made it possible to break the handy connection by rapidly moving sliders in the script player

---

## v2.1.0 - I'm back baybeeee

##### 25th April 2023

#### Added

-   The local player now supports more filetypes - .webm for videos, .m4a and .ogg for audio.
-   Video player now shows a preview thumbnail when hovering/dragging the seek bar
-   The modifier now removes the hated `rawActions` from funscripts (inspired by @linuxguy's topic on EroScripts)
-   Allows files to be saved even with no modifiers (for when you just want to remove `rawActions`)
-   Added status information text to the header

#### Changed

-   Minor style improvements and updates (notably added a dropshadow to text over heatmaps)
-   Updated everything - 18 months is long enough for everything to break lol

#### Removed

-   Took out the search bar from the header (RIP ScriptAxis)

#### Fixed

-   Fixed a potential bug preventing script sync in local player (to do with URL encoding)
-   The GitHub link now correctly goes to the new repo, rather than the legacy site

---

## v2.0.0 - Complete Rebuild!

##### 13th October 2021

#### Added

-   Complete overhaul of site layout and design to be responsive and support small displays
-   Full support for API v2 and Firmware V3 features, most notably min/max stroke ranges
-   All-new Handy connection system
-   Nicer, pop-up error messages
-   Added dedicated randomization app with real-time feedback
-   It is now possible to apply multiple script modifications in a chain in the Modify app
-   A completely new video/audio/script player which is way better in every way
-   Scripts can now be played with .mp3 audio files
-   Scripts can now be played on their own (with no synced video or audio)

#### Changed

-   Manual mode now supports min and max stroke ranges
-   Cycler app now displays real-time preview of pattern
-   Made funscript heatmaps much nicer

---

## v0.9.1

##### 29th July 2021

#### Added

-   Double-clicking the video player now toggles fullscreen

#### Fixed

-   The Limiter modifier no longer outputs broken funscripts (thanks for the bug report Ripovitan_R!)
-   Pressing space bar before loading a video no longer crashes the app
-   Space bar no longer opens the file dialog again if it was previously clicked (rather than drag+dropped)

---

## v0.9.0

##### 30th June 2021

#### Added

-   The Cycler now has an ease in / ease out balance slider to control the length and midpoint of the speed curves

---

## v0.8.0 - Custom Modifier

##### 26th May 2021

#### Added

-   Custom javascript functions can now be used to mutate a funscripts Actions array in the Modify Script page

#### Fixed

-   Replaced the "\_HALVED" suffix to modified funscripts with "\_MODIFIED"

---

## v0.7.3

##### 15th May 2021

#### Changed

-   Made the changelog easier to update!

#### Fixed

-   Fixed a bug preventing scripts from appearing in the Browse section

---

## v0.7.2

##### 29th April 2021

#### Fixed

-   Fixed a bug where under certain circumstances, funscripts would report invalid values for Average Speed
-   Made it possible to refresh the page when in sub-pages (like /modify) without getting a 404 error

---

## v0.7.1

##### 28th April 2021

#### Fixed

-   Solved a crash when attempting to edit the metadata of a script without existing performers or tags keys

---

## v0.7.0 - ScriptAxis Integration

##### 18th April 2021

#### Added

-   Funscripts can now have their metadata edited in the Modify page
-   Added ScriptAxis top scripts browser to the Browse page!

---

## v0.6.1

##### 18th April 2021

#### Fixed

-   Funscript popups now filter for .funscript files (suggestion by spuzz1127)

---

## v0.6.0 - Video Upgrades

##### 16th April 2021

#### Added (suggestions by spuzz1127)

-   Video playback can now be toggled by clicking the video
-   Clicking the heatmap preview in the local player seeks through the video
-   Funscripts can be previewed during playback by clicking the small funscript button on the bottom right of the player
-   Doesn't work in fullscreen mode

---

## v0.5.0 - UX Upgrades

##### 15th April 2021

#### Added

-   Added Limiter modifier to ensure a script matches a device's capabilities
-   Space bar now pauses/unpauses the local script player
-   Left/Right arrow keys now seek 10s back/forward in the local script player (suggestion by spuzz1127)
-   It is now possible to change the stroke speed/length increment amounts in manual mode (suggestion by Jupiter)
-   Added this changelog page!

#### Changed

-   Up/Down arrow keys are now used instead of left/right to change sync offset in the local script player

#### Fixed

-   Heatmaps now show gaps in the funscript (rather than continuing the color that was before the gap)

---

## v0.4.1

##### 11th April 2021

#### Fixed

-   Stopped overwriting funscript metadata, oops! (thanks sentinel)

---

## v0.4.0 - Initial Release

##### 4th April 2021

#### Features

-   A better local-video script player than handyfeeling.com
-   Easy to use script-modification features
-   A better manual-mode interface
-   Procedural funscript generation

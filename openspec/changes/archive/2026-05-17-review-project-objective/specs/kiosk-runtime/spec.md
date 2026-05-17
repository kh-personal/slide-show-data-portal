## ADDED Requirements

### Requirement: Use fixed aspect kiosk layout

The system SHALL render the portal inside a fixed-aspect fullscreen stage suitable for kiosk displays.

#### Scenario: Portal loads on a widescreen display

- **WHEN** the portal is opened in a browser viewport
- **THEN** the kiosk stage preserves a 16:9 layout and scales within the viewport

### Requirement: Avoid normal-refresh loading flashes

The system SHALL avoid white-screen flashes and loading spinners during normal polling refreshes.

#### Scenario: Data is already available

- **WHEN** a background refetch starts
- **THEN** the portal keeps rendering the previous data while the new data loads

### Requirement: Clean up runtime timers

The system SHALL clean up slideshow timers when the kiosk component unmounts.

#### Scenario: Kiosk component unmounts

- **WHEN** the kiosk component is removed from the page
- **THEN** the slideshow interval is cleared

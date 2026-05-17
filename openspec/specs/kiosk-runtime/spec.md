## Purpose

Define runtime layout, loading, and timer behavior for the kiosk portal.

## Requirements

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

### Requirement: Switch display preferences

The system SHALL provide runtime controls for selecting the active house, switching between dark and light themes, and switching between English and Traditional Chinese labels.

#### Scenario: House dropdown changes

- **WHEN** the operator selects a house name from the dropdown
- **THEN** floor grid slides and summary metrics update to use records for the selected house

#### Scenario: Selected house disappears after refresh

- **WHEN** refreshed movement data no longer includes the selected house
- **THEN** the portal selects the first available house without clearing the kiosk display

#### Scenario: Theme preference changes

- **WHEN** the operator switches between dark and light theme
- **THEN** the kiosk display updates to the selected color palette

#### Scenario: Language preference changes

- **WHEN** the operator switches between English and Traditional Chinese
- **THEN** visible portal labels, headings, metrics, controls, and status text update to the selected language while sheet-provided values remain unchanged

### Requirement: Pause and manually navigate slides

The system SHALL provide a pause toggle and previous/next slide controls in the control bar. While paused, the auto-rotation timer SHALL stop and the operator SHALL be able to navigate to any slide.

#### Scenario: Pause stops auto rotation

- **WHEN** the operator activates the pause control
- **THEN** the slide does not advance automatically until the operator resumes

#### Scenario: Manual navigation while paused

- **WHEN** the slideshow is paused and the operator activates previous or next
- **THEN** the active slide changes to the targeted slide

#### Scenario: Resume restarts timer

- **WHEN** the operator resumes the slideshow
- **THEN** auto-rotation restarts from the currently active slide

### Requirement: Localize floor, unit and house labels

The system SHALL localize floor labels, unit headers, and house names according to the active language.

#### Scenario: English language house name display

- **WHEN** English is active
- **THEN** the house dropdown and any house-name caption use the sheet-provided English house name

#### Scenario: Traditional Chinese house name display

- **WHEN** Traditional Chinese is active
- **THEN** the house dropdown and any house-name caption display the Traditional Chinese translation of each known house name (e.g., `宏仁閣`, `宏道閣`)

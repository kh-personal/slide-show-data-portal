## ADDED Requirements

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

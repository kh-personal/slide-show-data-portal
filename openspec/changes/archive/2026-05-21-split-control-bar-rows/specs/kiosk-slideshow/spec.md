## ADDED Requirements

### Requirement: Two-row control bar layout

The kiosk control bar SHALL render its controls across two rows. The upper row SHALL contain the Entry Date, AM/PM (session), and House Name selects. The lower row SHALL contain the previous-slide button, the Pause/Play toggle, the next-slide button, the theme button, and the language button.

#### Scenario: Control bar shows two rows

- **WHEN** the kiosk portal is displayed
- **THEN** the control bar contains exactly two row containers
- **AND** the upper row contains the Entry Date, AM/PM, and House Name selects
- **AND** the lower row contains the previous-slide, Pause/Play, next-slide, theme, and language buttons

#### Scenario: Open dropdown does not overlap summary metric boxes

- **WHEN** any of the upper-row selects is opened on the summary slide on a landscape kiosk viewport (width > height)
- **THEN** the open dropdown menu does not vertically overlap any of the 6 summary metric boxes

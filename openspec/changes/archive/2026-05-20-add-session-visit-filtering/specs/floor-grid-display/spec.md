## MODIFIED Requirements

### Requirement: Render floor range slides

The system SHALL render one floor grid slide for floors 1-16 and one floor grid slide for floors 17-31 for the selected house, selected entry date, and selected AM/PM session.

#### Scenario: Floor grid uses selected session

- **WHEN** a floor grid slide is visible
- **THEN** populated unit squares come from records matching the selected house, entry date, and AM/PM session

### Requirement: Apply selected-session visit indicators

The system SHALL not use green or purple full-cell styles for luggage counts. The system SHALL show a sharp bookmark icon on the right side of each flat that matches the selected entry date and AM/PM session, and SHALL color the selected-session flat by entry/exit state: grey for no entry and no exit, yellow for entry without exit, and pink-blue for both entry and exit. Medical necessity styling SHALL remain a higher-priority red full-cell style.

#### Scenario: Selected-session flat is pending

- **WHEN** a matching flat has no entry time and no exit time
- **THEN** the unit square shows the bookmark marker and uses the grey visit-state style

#### Scenario: Selected-session flat is active

- **WHEN** a matching flat has entry time and no exit time
- **THEN** the unit square shows the bookmark marker and uses the yellow visit-state style

#### Scenario: Selected-session flat is completed

- **WHEN** a matching flat has entry time and exit time
- **THEN** the unit square shows the bookmark marker and uses the pink-blue visit-state style

#### Scenario: Luggage counts do not color cells

- **WHEN** a matching non-medical flat has luggage count greater than 6
- **THEN** the unit square does not use green or purple luggage warning styling

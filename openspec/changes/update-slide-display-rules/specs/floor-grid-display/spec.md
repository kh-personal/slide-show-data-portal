## MODIFIED Requirements

### Requirement: Apply luggage warning colors

The system SHALL color unit squares purple when luggage count is greater than 6, green when luggage count is greater than 4, and default when luggage count is less than or equal to 4. Medical necessity SHALL NOT replace the unit square background with a red medical style.

#### Scenario: Excessive luggage warning

- **WHEN** a unit has luggage count 7
- **THEN** the unit square uses the purple warning style

#### Scenario: Moderate luggage warning

- **WHEN** a unit has luggage count 5
- **THEN** the unit square uses the green warning style

#### Scenario: Default luggage state

- **WHEN** a unit has luggage count 4
- **THEN** the unit square uses the default style

### Requirement: Highlight medical necessity cells

The system SHALL render unit squares with non-empty medical necessity using a red cross icon in the top-right icon cluster next to the bookmark icon. Medical necessity SHALL NOT apply a red full-cell background and SHALL NOT suppress luggage warning visibility.

#### Scenario: Medical unit without luggage warning

- **WHEN** a unit has medical necessity and luggage count 4 or less
- **THEN** the unit square uses the default cell background and displays a red cross icon in the top-right icon cluster

#### Scenario: Medical unit with moderate luggage warning

- **WHEN** a unit has medical necessity and luggage count 5 or 6
- **THEN** the unit square uses the green warning style and displays a red cross icon in the top-right icon cluster

#### Scenario: Medical unit with excessive luggage warning

- **WHEN** a unit has medical necessity and luggage count greater than 6
- **THEN** the unit square uses the purple warning style and displays a red cross icon in the top-right icon cluster

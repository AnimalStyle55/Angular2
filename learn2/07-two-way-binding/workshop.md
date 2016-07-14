# Workshop for this step

Your customer has decided it would be nice to add a concise view of
all of the filter criteria currently in use. This will provide the
user the means to quickly understand how the current set of archetypes
came to be.

To achieve this, you will need to use Angular to capture the user's
actions and inputs. Once captured, you can take advantage of 2-way
binding to display the captured results. (Note: the filter is still
not applied to the archetype list yet.)

## Step 1: Add the Filter Criteria Display

Locate the archetypeFilter component and modify the HTML to contain a
set of labels and values for each type of user input: archetype name,
sex, race, stat preference, and so on. For this stage, the values
should remain static.

## Step 2: Capture User Input and Actions

Use ngModel to capture the value typed into the search filter. Add
click event listeners to the filter buttons. The click events should
pass the value associated with the button clicked into the handler.

## Step 3: Update the Criteria Display

Modify the values of the criteria display to use the captured values.


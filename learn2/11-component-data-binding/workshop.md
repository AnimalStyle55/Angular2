# Workshop for this step

In code review, someone noticed the temporary hack that was performed
to make the ngFor work. They sent the latest iteration back to
development (and rightly so). They claim that the ngFor should be
repeating an instance of an archetypeCard for each data entry instead
of a random collection of elements. This will produce a cleaner
interface that's easier to maintain.

To achieve this, the data will need to be bound into the
archetypeCard.

## Step 1: Update the archetypeCard Component

Add data input points to the archetypeCard component. These inputs
should receive an object that represents a single archetype.

## Step 2: Update the ngFor in the archetypeList Component

Update the ngFor statement in the template to bind each archetype
instance into an archetypeCard. Remove the HTML left over from the
previous step.

## Step 3: Update the archetypeCard to Display the Actual Data

Update the template of the archetypeCard to data-bind the relevant
stats.

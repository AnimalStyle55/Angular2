# Workshop for this step

Core reviewers are now happy with the archetypeList; however, work
continues on the feature. Now that the user can type a name and see
the list of archetypes, they should be able to do both. The customer
would like you to provide a way to demonstrate this is possible at
this stage. When a user selects an archetype, the customer would like
to see a message indicating which archetype was selected and the
character name entered by the user. It is acceptable to display this
message in the console.

In order to do this, you will need to write a function to log to the
console. The trick is determining where to put this function. The
function will need access to the character name and be aware of an
archetypeCard button click.

The only location that the two of these components share is the App
component as an ancestor in the component hierarchy. As children, the
only way to send messages to the parent is through event bindings.

## Step 1: Emit the Character Name

Create a method inside the characterName component that emits the
current username. The idea is that this function should be called each
time the username changes. To do that, you will need to listen to the
appropriate event on the username input. Bind to that event and supply
the function that was just created as the handler for that event.

## Step 2: Capture Character Name Events

Now that the character name is being emitted, you can listen for these
changes in the app component. Each time the character name changes,
update a local reference to the character name. This local reference
will later be used during message creation.

## Step 3: Re-emit Button Click

Inside the archetypeCard component, you will need to register an event
listener for the selection buttons on click event. The handler for
this event should emit an event of its own. The value of the event
should be the archetype data for that entry.

## Step 4: Bubble Up Character Selection Event

Emitting the event only allows the data to cross one level of the
hierarchy. The process of processing and re-emitting the event will be
needed for each component.

## Step 5: Create Message

At the top of the hierarchy, when the character selection event is
received, it is at this point the message can be generated.


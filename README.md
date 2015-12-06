# VR-Hackastory-Breda

Dilemma, a multi-user VR game.

---

## Running the multi-user sever
Run `npm install` to install all requirements.
After that, do `npm start` and visit [http://localhost:4000](localhost:4000). 

To access it from multiple devices, you need to be able to access your local computer
from outside.


## Running the inner and outerview directly
Instead of playing the game through the player selection screen and intro movies
you can run the inner and outerview directly by running the server and navigating to:

[http://localhost:4000/innerview](localhost:4000/innerview)

[http://localhost:4000/outerview](localhost:4000/outerview)


## Admin
For debugging purposes there is also an admin interface that allows you to
send game commands directly instead of through gameplay.

Run the server and visit [http://localhost:4000/admin](localhost:4000/admin)

### Connecting prototypes to the multi user server

Use the following snippet to communicate with the multi user server

```
<script src="/socket.io/socket.io.js"></script>
<script>

    var dl = document.location;
    var socketServer = dl.origin;

    var socket = io( socketServer );

    // receiving
    
    socket.on('your-event', function ( eventData ) {
    
    });  
    
    // sending

    socket.emit('your-event', {'your': 'data'} );
    socket.emit('your-event', 'your data' );
    
    // Be sure to handle/re-emit these events in /GameEngine.js. 
    // for a list of events also see the GameEngine class.

</script>
```
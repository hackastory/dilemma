# VR-Hackastory-Breda

---

## Running the multi-sever
Navigate to `/simple-server`, run `npm install` to install all requirements.
After that, do `npm start` en visit [http://localhost:4000](localhost:4000). 

To access it from multiple devices, you need to be able to access your local computer
from outside.



## Running the 3D prototypes
Navigate to `/simple-server`, run `npm install` to install all requirements.
After that, do `npm start` en visit [http://localhost:4000](localhost:4000).

To access the prototypes just navigate to
[http://localhost:4000/prototypes](localhost:4000/prototypes/prototype-directory-name)

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
    
    // Be sure to handle these events in simple-server/lib/GameEngine.js
    // for a list of events also see the GameEngine class.

</script>
```

## Inspiration links

#### Collision detect
https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Collision-Detection.html
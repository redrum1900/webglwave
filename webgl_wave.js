/*
    Function: WebGl Animation for the homepage
    Usage: The function takes 2 arguments, the "action" that can be : "init", "kill", "play" and "pause" and the "targe" div where the script creates the canvas element
*/

var SEPARATION = 125, AMOUNTX = 35, AMOUNTY = 35;
var container, stats;
var camera, scene, renderer;
var particles, particle, count = 0, particles_globe = [];
var mouseX = 0, mouseY = 0;
var objTo;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var animation_type;
var rotation_speed = 0.002;
var timeout = null;
var $viewPort = $(document);
var $_body = $('body');
var $_html = $('html');

function webglWave(action, target){

    if( $_body.hasClass('ismobile') || $_html.hasClass('ie9'))
        return false;
    /* Logic Control to call the animation */
    if(action == 'init'){

        if(target == 'page404'){
            initGlobeError(target);
            addRemoveListeners(true);
            animateGlobeError();
        }
        else{
            /* Randomize the animation that is generated */
            //animation_type = Math.floor( (Math.random() * 2) + 0 );
			animation_type = 1;
            if(animation_type == 0){
                initWave(target);
                addRemoveListeners(true);
                animateWave();
            }
            else if(animation_type == 1){
                initGlobe(target);
                addRemoveListeners(true);
                animateGlobe();
            }
        }
    }
    else if(action == 'kill'){

        if(target == 'page404'){
            stopAnimationGlobeError(animation_id);
            killAnimationGlobeError();
            addRemoveListeners(false);
        }
        else{
            if(animation_type == 0 ){
                stopAnimationWave(animation_id);
                killAnimationWave();
                addRemoveListeners(false);
            }
            else if(animation_type == 1){
                stopAnimationGlobe(animation_id);
                killAnimationGlobe();
                addRemoveListeners(false);
            }
        }
    }
    else if(action == 'play'){

        if(target == 'page404'){
            addRemoveListeners(true);
            animateGlobeError();
        }
        else{
            if(animation_type == 0){
                addRemoveListeners(true);
                animateWave();
            }
            else if(animation_type == 1){
                addRemoveListeners(true);
                animateGlobe();
            }
        }
    }
    else if(action == 'stop'){
        if(target == 'page404'){
            addRemoveListeners(false);
            stopAnimationGlobeError(animation_id);
        }
        else{
            if(animation_type == 0){
                addRemoveListeners(false);
                stopAnimationWave(animation_id);
            }

            else if(animation_type == 1){
                addRemoveListeners(false);
                stopAnimationGlobe(animation_id);
            }
        }
    }
}

/* WAVE */
function initWave(target) {

     /* Creation of the canvas element in the "target" div */
    objTo = document.getElementById(target);
    container = document.getElementById('webgl-canvas');
    objTo.appendChild( container );

    /* Camera and scene creation */
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    camera.position.y = 100;
    camera.position.y = 1000;
    scene = new THREE.Scene();

    /* Particles Creation */
    particles = new Array();

    var PI2 = Math.PI * 2;
    var i = 0;
    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

            var material = new THREE.SpriteCanvasMaterial( {
                color: 0xffffff,
                transparent : true,
                program: function ( context ) {

                    context.beginPath();
                    context.arc( 0, 0, 0.5, 0, PI2, true );
                    context.fill();
                }
            } );

            particle = particles[ i ++ ] = new THREE.Sprite( material );
            particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
            particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
            scene.add( particle );
            particle.material.opacity = 0.4;
        }
    }

    /* Renderer Creation */
    renderer = new THREE.CanvasRenderer({ alpha: true });
    renderer.setClearColor( 0x0000, 0);
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // stats = new Stats();
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.top = '0px';
    // container.appendChild( stats.domElement );

}

/* User interaction */
function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

/* Wave animation start */
function animateWave() {

    animation_id = requestAnimationFrame( animateWave );

    renderWave();
    //stats.update();
}

/* Wave Animation */
function renderWave() {

    camera.position.x += ( mouseX - camera.position.x ) * .01;
    camera.position.y += ( mouseY - camera.position.y ) * .005;
    camera.lookAt( scene.position );

    var i = 0;
    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

            particle = particles[ i++ ];
            particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
            particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 4 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 4;

            opacity = (Math.abs(particle.position.y) /100);

            if(opacity < 0.5)
                opacity = 0.5;

            if (opacity > 1)
                opacity = 1;
            particle.material.opacity = opacity;
        }
    }

    renderer.render( scene, camera );

    count += 0.03;
}

/* Clear the scene and kill all objects */
function killAnimationWave(){

    if (scene) {
        while (scene.children.length > 0) {
            scene.remove(scene.children[scene.children.length - 1]);
       }
    }
    $('#webgl-canvas > canvas').remove();
}

/* Pause the animation*/
function stopAnimationWave(animation_id){

    cancelAnimationFrame(animation_id);
}

/* GLOBE */
function initGlobe(target) {

    /* Creation of the canvas element in the "target" div */
    objTo = document.getElementById(target);
    container = document.getElementById('webgl-canvas');
    objTo.appendChild( container );

    /* Camera and scene creation */
    camera = new THREE.PerspectiveCamera( 75,  window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 500;
    scene = new THREE.Scene();


    /* Particles Creation */
    var PI2 = Math.PI * 2;
    var program = function ( context ) {
        context.beginPath();
        context.arc( 0, 0, 25, 0, PI2, true );
        context.fill();
    }

    var PI2 = Math.PI * 2;
    for ( var i = 0; i < 500; i ++ ) {

        var material = new THREE.SpriteCanvasMaterial( {

            color: 0xffffff,
            transparent : true,
            program: function ( context ) {
                context.beginPath();
                context.arc( 0, 0, 0.5, 0, PI2, true );
                context.fill();
            }
        } );

        particle = new THREE.Sprite( material );
        particle.position.x = Math.random() * 2 - 1;
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;
        particle.position.normalize();
        particle.position.multiplyScalar( Math.random() * 10 + 450 );
        particle.scale.multiplyScalar( 4 + Math.random()*2 );
        particle.material.opacity = 0.1;
        scene.add( particle );

        particles_globe.push(particle);
    }


    /* Particles Creation */
    for (var i = 0; i < 500; i++) {

        var geometry = new THREE.Geometry();
        var vertex = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );

        vertex.normalize();
        vertex.multiplyScalar( 450 );

        geometry.vertices.push( vertex );

        var vertex2 = vertex.clone();
        vertex2.multiplyScalar( Math.random() * 0.3 + 1 );

        geometry.vertices.push( vertex2 );

        var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.3 } ) );
        scene.add( line );

    }

    /* Renderer Creation */
    renderer = new THREE.CanvasRenderer({ alpha: true });
    renderer.setClearColor( 0x0000, 0);
    renderer.setSize(  window.innerWidth , window.innerHeight );
    container.appendChild( renderer.domElement );
}

/* Globe animation start */
function animateGlobe() {

    animation_id = requestAnimationFrame( animateGlobe );

    renderGlobe();
}

/* Globe Animation */
function renderGlobe() {
    var $webglCanvas = $('body:hover');

    var x = camera.position.x, y = camera.position.y, z = camera.position.z;

    if ($webglCanvas.length != 0 && timeout != null) {
        camera.position.x += (( mouseX - camera.position.x ) * .05) ;
    }
    else{
        camera.position.x = x * Math.cos(rotation_speed) - z * Math.sin(rotation_speed);
        camera.position.z = z * Math.cos(rotation_speed) + x * Math.sin(rotation_speed);
    }

    camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05 ;

    $viewPort.on('mousemove', function() {
        if (timeout !== null) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(function() {
            timeout = null;
        }, 600);
    });

    camera.lookAt( scene.position );

     var i = 0;

    for ( var i = 0; i < particles_globe.length ; i ++ ) {

        particle = particles_globe[ i++ ];
        temp = ( Math.sin( ( i + count ) * 0.3 ) * 50 ) + ( Math.sin( ( i + count ) * 0.5 ) * 0.50 );

        opacity = (Math.abs(temp) /50) + 0.1

        if (opacity > 1)
            opacity = 1;
        particle.material.opacity = opacity;
    }

    renderer.render( scene, camera );

    count += 0.1;

    renderer.render( scene, camera );
}

/* Clear the scene and kill all objects */
function killAnimationGlobe(){

    if (scene) {
        while (scene.children.length > 0) {
            scene.remove(scene.children[scene.children.length - 1]);
       }
    }
    $('#webgl-canvas > canvas').remove();
}

/* Pause the animation*/
function stopAnimationGlobe(animation_id){
    cancelAnimationFrame(animation_id);
}


/* GLOBE ERROR*/
function initGlobeError(target) {

    /* Creation of the canvas element in the "target" div */
    objTo = document.getElementById(target);
    container = document.getElementById('webgl-canvas');
    objTo.appendChild( container );

    /* Camera and scene creation */
    camera = new THREE.PerspectiveCamera( 75,  window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 500;
    scene = new THREE.Scene();

    /* Particles Creation */
    var PI2 = Math.PI * 2;
    var program = function ( context ) {
        context.beginPath();
        context.arc( 0, 0, 25, 0, PI2, true );
        context.fill();
    }

    var PI2 = Math.PI * 2;
    for ( var i = 0; i < 250; i ++ ) {

        var material = new THREE.SpriteCanvasMaterial( {

            color: 0xffffff,
            transparent : true,
            program: function ( context ) {
                context.beginPath();
                context.arc( 0, 0, 0.5, 0, PI2, true );
                context.fill();
            }
        } );

        particle = new THREE.Sprite( material );
        particle.position.x = Math.random() * 2 - 1;
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;
        particle.position.normalize();
        particle.position.multiplyScalar( Math.random() * 10 + 450 );
        particle.scale.multiplyScalar( 4 + Math.random()*2 );
        particle.material.opacity = 0.1;
        scene.add( particle );

        particles_globe.push(particle);
    }




    /* Renderer Creation */
    renderer = new THREE.CanvasRenderer({ alpha: true });
    renderer.setClearColor( 0x0000, 0);
    renderer.setSize(  window.innerWidth , window.innerHeight );
    container.appendChild( renderer.domElement );
}

/* Globe animation start */
function animateGlobeError() {

    animation_id = requestAnimationFrame( animateGlobeError );

    renderGlobeError();
}

/* Globe Animation */
function renderGlobeError() {

    var rotation_speed = 0.002;
    var x = camera.position.x, y = camera.position.y, z = camera.position.z;


    camera.position.x = x * Math.cos(rotation_speed) + z * Math.sin(rotation_speed);
    camera.position.z = z * Math.cos(rotation_speed) - x * Math.sin(rotation_speed);


    camera.lookAt( scene.position );


    renderer.render( scene, camera );

    count += 0.1;

    renderer.render( scene, camera );
}

/* Clear the scene and kill all objects */
function killAnimationGlobeError(){

    if (scene) {
        while (scene.children.length > 0) {
            scene.remove(scene.children[scene.children.length - 1]);
       }
    }
    $('#webgl-canvas > canvas').remove();
}

/* Pause the animation*/
function stopAnimationGlobeError(animation_id){
    cancelAnimationFrame(animation_id);
}


/* GLOBAL FUNCTIONS */

/* User Listeners - takes an argument (true or false) to turn on and off as needed */
function addRemoveListeners(action){

    if(action){
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', onDocumentTouchMove, false );
        window.addEventListener( 'resize', onWindowResize, false );
    }
    else{
        document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        document.removeEventListener( 'touchstart', onDocumentTouchStart, false );
        document.removeEventListener( 'touchmove', onDocumentTouchMove, false );
        window.removeEventListener( 'resize', onWindowResize, false );
    }
}

/* User interaction */
function onDocumentMouseMove( event ) {

    mouseX = event.clientX - windowHalfX;
    /*mouseY = event.clientY - windowHalfY;*/
    mouseY = event.clientY + 150;
}

/* User interaction */
function onDocumentTouchStart( event ) {

    if ( event.touches.length === 1 ) {
        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        /*mouseY = event.touches[ 0 ].pageY - windowHalfY;*/
        mouseY = - event.touches[ 0 ].pageY;
    }
}

/* User interaction */
function onDocumentTouchMove( event ) {

    if ( event.touches.length === 1 ) {
        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        /* mouseY = event.touches[ 0 ].pageY - windowHalfY;*/
        mouseY = - event.touches[ 0 ].pageY;
    }
}

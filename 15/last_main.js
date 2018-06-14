function main()
{
    var volume = new KVS.LobsterData();
    var screen = new KVS.THREEScreen();
    var light = new THREE.PointLight();
    light.position.set( 5, 5, 5 );
    var mesh;
    
    var scene = new THREE.Scene();
    var fov = 45;
    var aspect = window.innerWidth * 0.8 / window.innerHeight * 0.1;
    var near = 2;
    var far = 1000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 30 );
    scene.add( camera );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth * 0.8, window.innerHeight * 0.1 );
    renderer.setClearColor( new THREE.Color(.828125,.86328125,.89453125) );
    document.getElementById('color').appendChild(renderer.domElement);
    var cmap = [];
    for ( var i = 0; i < 256; i++ )
    {
        var S = i / 255.0; 
        var R = Math.max( Math.cos( ( S - 1 ) * Math.PI ), 0.0 );
        var G = Math.max( Math.cos( ( S - 0.5 ) * Math.PI ), 0.0 );
        var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var color = new THREE.Color( R, G, B );
        cmap.push( [ S, '0x' + color.getHexString() ] );
    }
        var lut = new THREE.Lut( 'rainbow', cmap.length );
        lut.addColorMap( 'mycolormap', cmap );
        lut.changeColorMap( 'mycolormap' );
        colormap = lut.setLegendOn( {
            'layout':'horizontal',
        'position': { 'x': 0, 'y': 0, 'z': 0.5 },
        'dimensions': { 'width': 10, 'height': 1.2 }
    } ) ;
        scene.add(colormap);
    renderer.render( scene, camera );

    screen.init(volume, {
      width: window.innerWidth * 0.8, 
      height: window.innerHeight * 0.9, 
      targetDom: document.getElementById('display'),　
      enableAutoResize: false
    });
    var now_implement = 0;
       setup();
    screen.loop();

    function setup()
    {
    
        var color = new KVS.Vec3( 0, 0, 0 );　 
        var box = new KVS.BoundingBox();　
        box.setColor( color );     
        box.setWidth( 2 );      

        var smin = volume.min_value;    
        var smax = volume.max_value;    
        var isovalue = parseInt(KVS.Mix( smin, smax, 0.5 )); 
        var x = 0;
        var y = 0;
        var z = 100;
        var pre_direction = [x,y,z];
        var differ_100 = 50;
        var differ = differ_100/100;
        var isosurface = new KVS.Isosurface();
        isosurface.setIsovalue( isovalue );
        var cmap = [];
        var nowcolor;
    for ( var i = 0; i < 256; i++ )
    {
        var S = i / 255.0; 
        var R = Math.max( Math.cos( ( S - 1 ) * Math.PI ), 0.0 );
        var G = Math.max( Math.cos( ( S - 0.5 ) * Math.PI ), 0.0 );
        var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var color = new THREE.Color( R, G, B );
        cmap.push( [ S, '0x' + color.getHexString() ] );
    }
    display_color_data(differ);
        nowcolor = cmap[parseInt(isovalue)][1];
        nowcolor = nowcolor.slice(2); 
        nowcolor = "#"+nowcolor;
        document.getElementById('label').innerHTML = "Isovalue: " + Math.round( isovalue );
        
        var line = KVS.ToTHREELine( box.exec( volume ) );
        mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) );
        screen.scene.add( line );
        screen.scene.add( mesh );

        document.getElementById('isovalue')
            .addEventListener('mousemove', function() {
                var value = +document.getElementById('isovalue').value;
                var isovalue = parseInt(KVS.Mix( smin, smax, value ));
                var value = +document.getElementById('phase_difference').value;
                differ_100 = parseInt(KVS.Mix( 0, 100, value ));
                differ = differ_100/100;
                cmap = get_cmap(differ);
                nowcolor = cmap[parseInt(isovalue)][1];
                nowcolor = nowcolor.slice(2); 
                nowcolor = "#"+nowcolor;
                document.getElementById('change-isovalue-button').style.color = nowcolor;
                document.getElementById('label').innerHTML = "Isovalue: " + Math.round( isovalue );
            });
         
        document.getElementById('phase_difference')
            .addEventListener('mousemove', function() {
                var value = +document.getElementById('phase_difference').value;
                differ_100 = parseInt(KVS.Mix( 0, 100, value ));
                differ = differ_100/100;
                display_color_data(differ);
                    scene.remove(colormap);
            var value = +document.getElementById('phase_difference').value;  
            var differ = KVS.Mix( 0, 100 , value ) / 100;
            var differ_2 = differ * 2;
        var cmap = [];
        var value = +document.getElementById('isovalue').value;
        var isovalue = KVS.Mix( smin, smax, value );
        cmap = get_cmap(differ);
        nowcolor = cmap[parseInt(isovalue)][1];
        nowcolor = nowcolor.slice(2); 
        nowcolor = "#"+nowcolor;
        document.getElementById('change-isovalue-button').style.color = nowcolor;
        var lut = new THREE.Lut( 'rainbow', cmap.length );
        lut.addColorMap( 'mycolormap', cmap );
        lut.changeColorMap( 'mycolormap' );
        colormap = lut.setLegendOn( {
            'layout':'horizontal',
        'position': { 'x': 0, 'y': 0, 'z': 0.5 },
        'dimensions': { 'width': 10, 'height': 1.2 }
    } );
        scene.add(colormap);
    renderer.render( scene, camera );
    switch(now_implement){
        case 0 : {
            screen.scene.remove( mesh );
                var value = +document.getElementById('isovalue').value;
                var isovalue = parseInt(KVS.Mix( smin, smax, value ));
                var isosurface = new KVS.Isosurface();
                isosurface.setIsovalue( isovalue );                       
                mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) );
                var material = new THREE.MeshLambertMaterial();
                var cmap = [];
                var differ_2 = differ * 2;
                for ( var i = 0; i < 256; i++ )
                {
                    var S = i / 255.0; // [0,1]
                    var R = Math.max( Math.cos( ( S - differ_2 ) * Math.PI ), 0.0 );
                    var G = Math.max( Math.cos( ( S - differ ) * Math.PI ), 0.0 );
                    var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
                    var color = new THREE.Color( R, G, B );
                    cmap.push( [ S, '0x' + color.getHexString() ] );
                   }
                material.color = new THREE.Color().setHex( cmap[isovalue][1] );
                mesh = new THREE.Mesh( mesh.geometry, material);
                screen.scene.add( mesh );
                break;
            }
        case 1 : {
            screen.scene.remove( mesh );
                var value = +document.getElementById('isovalue').value;
                var isovalue = KVS.Mix( smin, smax, value );
                var isosurface = new KVS.Isosurface();
                isosurface.setIsovalue( isovalue ); 
                mesh = phoneshading(isosurface.exec( volume ),light,isovalue,differ);
                screen.scene.add( mesh );
                break;
            }
        case 2 : { 
            screen.scene.remove( mesh );
                var value = +document.getElementById('isovalue').value;
                var isovalue = KVS.Mix( smin, smax, value );
                var isosurface = new KVS.Isosurface();
                isosurface.setIsovalue( isovalue ); 
                mesh = Gouraudshading(isosurface.exec( volume ),light,isovalue,differ);
                screen.scene.add( mesh );
                break;
            }
        case 3 : {break;}
        default : {
                screen.scene.remove( mesh );
                var x = pre_direction[0];
                var y = pre_direction[1];
                var z = pre_direction[2];
                if(x == 0 && y == 0 && z == 0){
                    window.alert("Can`t slice in this parameter");
                    screen.scene.add(mesh);
                }
                else{
                    value = +document.getElementById('isovalue').value;
                    var isovalue = KVS.Mix( smin, smax, value );
                    isosurface = new KVS.Isosurface();
                    isosurface.setIsovalue( isovalue );
                    mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) );
                    var point = new THREE.Vector3(60,60,17);
                    var normal = new THREE.Vector3(x,y,z);
                    var value = +document.getElementById('phase_difference').value;  
                var differ = KVS.Mix( 0, 100 , value ) / 100;
                    mesh = SlicePlane(volume,point,normal,differ);
                    screen.scene.add( mesh );
                    
                }
                break;
            }
     }
            });

        document.getElementById('change-isovalue-button')
            .addEventListener('click', function() {
                now_implement = 0;
                screen.scene.remove( mesh );
                var value = +document.getElementById('isovalue').value;
                var isovalue = parseInt(KVS.Mix( smin, smax, value ));
                var isosurface = new KVS.Isosurface();
                isosurface.setIsovalue( isovalue );                       
                mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) );
                var material = new THREE.MeshLambertMaterial();
                var cmap = [];
                var value = +document.getElementById('phase_difference').value;  
            var differ = KVS.Mix( 0, 100 , value ) / 100;
            var differ_2 = differ * 2;
                var differ_2 = differ * 2;
                for ( var i = 0; i < 256; i++ )
                {
                    var S = i / 255.0; 
                    var R = Math.max( Math.cos( ( S - differ_2 ) * Math.PI ), 0.0 );
                    var G = Math.max( Math.cos( ( S - differ ) * Math.PI ), 0.0 );
                    var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
                    var color = new THREE.Color( R, G, B );
                    cmap.push( [ S, '0x' + color.getHexString() ] );
                   }
                material.color = new THREE.Color().setHex( cmap[isovalue][1] );
                mesh = new THREE.Mesh( mesh.geometry, material);
                screen.scene.add( mesh );
                
            });

document.getElementById('shading-Phone-button')
            .addEventListener('click', function() {
                now_implement = 1;
                screen.scene.remove( mesh );
                var value = +document.getElementById('isovalue').value;
                var isovalue = KVS.Mix( smin, smax, value );
                var isosurface = new KVS.Isosurface();
                var value = +document.getElementById('phase_difference').value;  
                var differ = KVS.Mix( 0, 100 , value ) / 100;
                var differ_2 = differ * 2;
                isosurface.setIsovalue( isovalue ); 
                mesh = phoneshading(isosurface.exec( volume ),light,isovalue,differ);
                screen.scene.add( mesh );            
 });

document.getElementById('shading-Gouraud-button')
            .addEventListener('click', function() {
                now_implement = 2;
                screen.scene.remove( mesh );
                var value = +document.getElementById('isovalue').value;
                var isovalue = KVS.Mix( smin, smax, value );
                var isosurface = new KVS.Isosurface();
                isosurface.setIsovalue( isovalue ); 
                var value = +document.getElementById('phase_difference').value;  
                var differ = KVS.Mix( 0, 100 , value ) / 100;
                var differ_2 = differ * 2;
                mesh = Gouraudshading(isosurface.exec( volume ),light,isovalue,differ);
                screen.scene.add( mesh );      
 });

        document.addEventListener( 'mousemove', function() {
            screen.light.position.copy( screen.camera.position );
        });

        window.addEventListener('resize', function() {
            screen.resize([
                window.innerWidth * 0.8,
                window.innerHeight
            ]);
        });
        screen.draw();
    }

function phoneshading(a,light,isovalue,differ) {
    isovalue = parseInt(isovalue);
    var c = new THREE.Geometry;
    var f = new THREE.ShaderMaterial({
        vertexColors: THREE.VertexColors,
        vertexShader: document.
            getElementById('phone.vert').text,
        fragmentShader: document.getElementById('phone.frag').text,
        uniforms: {
        light_position: { type: 'v3', value: light.position } 
        }
    });
    var cmap = [];
    var differ_2 = differ * 2;
    for ( var i = 0; i < 256; i++ )
    {
        var S = i / 255.0; // [0,1]
        var R = Math.max( Math.cos( ( S - differ_2 ) * Math.PI ), 0.0 );
        var G = Math.max( Math.cos( ( S - differ ) * Math.PI ), 0.0 );
        var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var color = new THREE.Color( R, G, B );
        cmap.push( [ S, '0x' + color.getHexString() ] );
    }
    f.side=THREE.DoubleSide;
  for(var d=a.connections.length,b=0;b<d;b++){
        var e=a.connections[b];
        c.faces.push(new THREE.Face3(e[0],e[1],e[2]))
    }if(0==a.colors.length)
        f.color=new THREE.Color("white");
    else if(1==a.colors.length){e=a.colors[0],f.color=new THREE.Color(e[0],e[1],e[2]);}

    else if(a.colors.length==a.coords.length)
        for(f.vertexColors=THREE.VertexColors,b=0;b<d;b++){
            var e=a.colors[c.faces[b].a],g=a.colors[c.faces[b].b],h=a.colors[c.faces[b].c];
            c.faces[b].vertexColors.push(new THREE.Color(e[0],e[1],e[2]));
            c.faces[b].vertexColors.push(new THREE.Color(g[0],g[1],g[2]));
            c.faces[b].vertexColors.push(new THREE.Color(h[0],h[1],h[2]))}

    else if(a.colors.length==a.connections.length){
        for(f.vertexColors=THREE.FaceColors,b=0;b<d;b++)
            e=a.colors[b],c.faces[b].color=new THREE.Color(e[0],e[1],e[2]);

    }
   f.vertexColors = THREE.VertexColors;
    for ( var i = 0; i < c.faces.length; i++ )
    {
        var C0 = new THREE.Color().setHex( cmap[ isovalue][1] );
        var C1 = new THREE.Color().setHex( cmap[ isovalue][1] );
        var C2 = new THREE.Color().setHex( cmap[ isovalue][1] );
        c.faces[i].vertexColors.push( C0 );
        c.faces[i].vertexColors.push( C1 );
        c.faces[i].vertexColors.push( C2 );
    }
    d=a.numberOfVertices();
    for(b=0;b<d;b++)
        e=(new THREE.Vector3).fromArray(a.coords[b]),c.vertices.push(e);
    c.computeFaceNormals();
    c.computeVertexNormals();
return new THREE.Mesh(c,f)
}

function Gouraudshading(a,light,isovalue,differ) {
    isovalue = parseInt(isovalue);
    var c = new THREE.Geometry;
    var f = new THREE.ShaderMaterial({
        vertexColors: THREE.VertexColors,
        vertexShader: document.
            getElementById('gouraud.vert').text,
        fragmentShader: document.getElementById('gouraud.frag').text,
        uniforms: {
        light_position: { type: 'v3', value: light.position } 
        }
    });
    var cmap = [];
    var differ_2 = differ * 2;
    for ( var i = 0; i < 256; i++ )
    {
        var S = i / 255.0; // [0,1]
        var R = Math.max( Math.cos( ( S - differ_2 ) * Math.PI ), 0.0 );
        var G = Math.max( Math.cos( ( S - differ ) * Math.PI ), 0.0 );
        var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var color = new THREE.Color( R, G, B );
        cmap.push( [ S, '0x' + color.getHexString() ] );
    }
    f.side=THREE.DoubleSide;
  for(var d=a.connections.length,b=0;b<d;b++){
        var e=a.connections[b];
        c.faces.push(new THREE.Face3(e[0],e[1],e[2]))
    }if(0==a.colors.length)
        f.color=new THREE.Color("white");
    else if(1==a.colors.length){e=a.colors[0],f.color=new THREE.Color(e[0],e[1],e[2]);}

    else if(a.colors.length==a.coords.length)
        for(f.vertexColors=THREE.VertexColors,b=0;b<d;b++){
            console.log("aaaaa");
            var e=a.colors[c.faces[b].a],g=a.colors[c.faces[b].b],h=a.colors[c.faces[b].c];
            c.faces[b].vertexColors.push(new THREE.Color(e[0],e[1],e[2]));
            c.faces[b].vertexColors.push(new THREE.Color(g[0],g[1],g[2]));
            c.faces[b].vertexColors.push(new THREE.Color(h[0],h[1],h[2]))}

    else if(a.colors.length==a.connections.length){
        for(f.vertexColors=THREE.FaceColors,b=0;b<d;b++)
            e=a.colors[b],c.faces[b].color=new THREE.Color(e[0],e[1],e[2]);

    }
   f.vertexColors = THREE.VertexColors;
    for ( var i = 0; i < c.faces.length; i++ )
    {
        var C0 = new THREE.Color().setHex( cmap[ isovalue][1] );
        var C1 = new THREE.Color().setHex( cmap[ isovalue][1] );
        var C2 = new THREE.Color().setHex( cmap[ isovalue][1] );
        c.faces[i].vertexColors.push( C0 );
        c.faces[i].vertexColors.push( C1 );
        c.faces[i].vertexColors.push( C2 );
    }
    d=a.numberOfVertices();
    for(b=0;b<d;b++)
        e=(new THREE.Vector3).fromArray(a.coords[b]),c.vertices.push(e);
    c.computeFaceNormals();
    c.computeVertexNormals();
return new THREE.Mesh(c,f)

}
    function get_cmap(differ){
                    var differ_2 = differ * 2;
                    var cmap = [];
                for ( var i = 0; i < 256; i++ )
    {
        var S = i / 255.0; // [0,1]
        var R = Math.max( Math.cos( ( S - differ_2 ) * Math.PI ), 0.0 );
        var G = Math.max( Math.cos( ( S - differ ) * Math.PI ), 0.0 );
        var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var color = new THREE.Color( R, G, B );
        cmap.push( [ S, '0x' + color.getHexString() ] );
    }
     return cmap;
    }

}

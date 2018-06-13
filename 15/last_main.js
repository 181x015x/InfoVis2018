function main()
{
    //giometry : 幾何学　形にまつわるデータ　ex)辺、点、色
    //volume : スカラー量
    //isosurface : 等値面
    //var volume = new KVS.SingleCubeData();
    //var volume = new KVS.CreateHydrogenData( 64, 64, 64 );
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
        var S = i / 255.0; // [0,1]
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
      width: window.innerWidth * 0.8,    //全体の80パーセントの横
      height: window.innerHeight * 0.9,         // 全体の縦
      targetDom: document.getElementById('display'),　//id = display　を変更する。
      enableAutoResize: false
    });
    var now_implement = 0;// 0 : 元の状態　1 : phone shading 2: gouraud 3: slice 
       setup();
    screen.loop();

    function setup()
    {
    //________________________________________________________________________
    //初期設定
        var color = new KVS.Vec3( 0, 0, 0 );　 //黒
        var box = new KVS.BoundingBox();　// ロブスターを囲む箱を初期化
        box.setColor( color );     //箱を黒に設定 
        box.setWidth( 2 );      //箱の線の太さを設定

        var smin = volume.min_value;    // 0 
        var smax = volume.max_value;    //255
        var isovalue = parseInt(KVS.Mix( smin, smax, 0.5 )); //isovalue = (smin + smax )/2 = 255/2 = 127.5
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
        var S = i / 255.0; // [0,1]
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
        document.getElementById('change-isovalue-button').style.color = nowcolor;
        document.getElementById('x_label').innerHTML = "x: " + x;
        document.getElementById('y_label').innerHTML = "y: " + y;
        document.getElementById('z_label').innerHTML = "z: " + z;
        var line = KVS.ToTHREELine( box.exec( volume ) );
        mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) );
        screen.scene.add( line );//箱の枠
        screen.scene.add( mesh );//ロブスター
        
//________________________________________________________________
//動かすタイプの入力ボックスの設定
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
         document.getElementById('x')
            .addEventListener('mousemove', function() {
                var value = +document.getElementById('x').value;
                var x = parseInt(KVS.Mix( 0, 100, value ));
                document.getElementById('x_label').innerHTML = "x: " +  x ;
            });
            document.getElementById('y')
            .addEventListener('mousemove', function() {
                var value = +document.getElementById('y').value;
                var y = parseInt(KVS.Mix( 0, 100, value ));
                document.getElementById('y_label').innerHTML = "y: " +  y;
            });
             document.getElementById('z')
            .addEventListener('mousemove', function() {
                var value = +document.getElementById('z').value;
                var z = parseInt(KVS.Mix( 0, 100, value ));
                document.getElementById('z_label').innerHTML = "z: " +  z;
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
                isosurface.setIsovalue( isovalue );                       //更新
                mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) );
                var material = new THREE.MeshLambertMaterial();// 処理？？
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
                document.getElementById('situation').innerHTML = "Isovalue = "+isovalue+" \ncolor in Isovalue = " + nowcolor + "\ndisplay : Isovalue mode \nshading : none \n slice : none \n slice direction : none";
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
                document.getElementById('situation').innerHTML = "Isovalue = "+isovalue+" \ncolor in Isovalue = " + nowcolor + "\ndisplay : shadding mode \nshading : Phone shading \n slice : none \n slice direction : none";
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
                document.getElementById('situation').innerHTML = "Isovalue = "+isovalue+" \ncolor in Isovalue = " + nowcolor + "\ndisplay : shadding mode \nshading : Gouraud shading \n slice : none \n slice direction : none";break;
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
                    document.getElementById('situation').innerHTML = "Isovalue = "+isovalue+" \ncolor in Isovalue = " + nowcolor + "\ndisplay : Slice mode \nshading : none \n slice : on \n slice direction : ( "+x+" , "+y+" , "+z+" )";
                }
                break;
            }
     }
               

            });
//_____________________________________________________________________
//isovalue変更のボタンが押された時の挙動
        document.getElementById('change-isovalue-button')
            .addEventListener('click', function() {
                now_implement = 0;
                screen.scene.remove( mesh );
                var value = +document.getElementById('isovalue').value;
                var isovalue = parseInt(KVS.Mix( smin, smax, value ));
                var isosurface = new KVS.Isosurface();
                isosurface.setIsovalue( isovalue );                       //更新
                mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) );
                var material = new THREE.MeshLambertMaterial();// 処理？？
                var cmap = [];
                var value = +document.getElementById('phase_difference').value;  
            var differ = KVS.Mix( 0, 100 , value ) / 100;
            var differ_2 = differ * 2;
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
                document.getElementById('situation').innerHTML = "Isovalue = "+isovalue+" \ncolor in Isovalue = " + nowcolor + "\ndisplay : Isovalue mode \nshading : none \n slice : none \n slice direction : none";
            });
//_____________________________________________________________________
//phoneのボタンが押された時の挙動
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
                document.getElementById('situation').innerHTML = "Isovalue = "+isovalue+" \ncolor in Isovalue = " + nowcolor + "\ndisplay : shadding mode \nshading : Phone shading \n slice : none \n slice direction : none";
 });
//_____________________________________________________________________
//gouraudのボタンが押された時
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
                document.getElementById('situation').innerHTML = "Isovalue = "+isovalue+" \ncolor in Isovalue = " + nowcolor + "\ndisplay : shadding mode \nshading : Gouraud shading \n slice : none \n slice direction : none";
 });
//_____________________________________________________________________
//もとどおりにするのボタンが押された時

//_____________________________________________________________________
//Sliceボタンが押された時


//_____________________________________________________________________
//マウスが動いた時の挙動
        document.addEventListener( 'mousemove', function() {
            screen.light.position.copy( screen.camera.position );
        });



//_____________________________________________________________________
//リサイズする時の動き
        window.addEventListener('resize', function() {
            screen.resize([
                window.innerWidth * 0.8,
                window.innerHeight
            ]);
        });

        screen.draw();
    }



//_____________________________________________________________________    
//phoneshading実装
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
//_____________________________________________________________________    
//Gouraudshading実装
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


main();

function main() {

    /*================Vytvorenie gr. kontextu a kresliaceho platna=================*/
    var canvas = document.getElementById('glCanvas');
    gl = canvas.getContext('webgl');

    if (gl === null) { alert("Nemožno inicializovať WebGL."); return; }

    /*======== Definovanie geometrie (vrcholov) ===========*/


    var vertices = [
        0,0.75,0.0,
        -0.75,-0.75,0.0,
        0.75,-0.75,0.0,
    ];

    var colors = [0,0,1, 0,0,1, 0,0,1]; //red, green, blue

    indices = [0,1,2];

    // Vytvorenie a inicializacia prazdneho buffera objektov na ulozenie udajov o vrcholoch
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); // aj gl.DYNAMIC_DRAW alebo gl.STREAM_DRAW
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Vytvorenie a inicializacia prazdneho buffera objektov na ulozenie indexovacich udajov
    var Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Vytvorenie a inicializacia prazdneho buffera objektov na ulozenie farieb
    var color_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    /*======================= Shadre =======================*/
    // Shadery su male programy beziace na grafickej karte (GPU) a urcuju,
    // ako sa vykresluju pixely, vertexy alebo objekty.
    // Najcastejsie sa pisu v jazyku GLSL (OpenGL Shading Language).
    // Vertex (vrcholovy) shader: sa pouziva na transformaciu geometrie a spracovava polohu bodov (vertexov) v 3D priestore.
    // Fragment shader: sa pouziva na vypocitanie farby pixelov.

    // Retazec pre zdrojovy kod shadera vrcholov (vrcholovy shader)
    var vertCode = 'attribute vec3 coordinates;'+
        'attribute vec3 color;'+
        'varying vec3 vColor;'+
        'void main(void) {' +
        ' gl_Position = vec4(coordinates, 1.0);' +
        'vColor = color;'+
        '}';

    // Vytvorenie objektu vrcholoveho shadera
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Dodanie/pripojenie zdrojoveho kodu vrcholoveho shadera
    gl.shaderSource(vertShader, vertCode);

    // Kompilacia vrcholoveho shadera
    gl.compileShader(vertShader);


    // Retazec pre zdrojovy kod shadera fragmentov
    var fragCode = 'precision mediump float;'+
        'varying vec3 vColor;'+
        'void main(void) {'+
        'gl_FragColor = vec4(vColor, 1.);'+
        '}';

    // Vytvorenie objektu shadera fragmentov
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Dodanie/pripojenie zdrojoveho kodu shadera fragmentov
    gl.shaderSource(fragShader, fragCode);

    // Kompilacia shadera fragmentov
    gl.compileShader(fragShader);

    // Vytvorenie shaderovacieho programoveho objektu na ulozenie skombinovaneho (spojeneho) shaderovacieho programu
    var shaderProgram = gl.createProgram();

    // Dodanie/pripojenie vrcholoveho shadera
    gl.attachShader(shaderProgram, vertShader);

    // Dodanie/pripojenie shadera fragmentov
    gl.attachShader(shaderProgram, fragShader);

    // Zlinkovanie oboch programov do skombinovaneho programu
    gl.linkProgram(shaderProgram);

    // Pouzitie skombinovaneho programu zo shaderov
    gl.useProgram(shaderProgram);

    /* ======== Asociacia shaderov s objektami vytvorenych buffererov geometrie =======*/

    // Prepojenie na buffer objektov na ulozenie udajov o vrcholoch
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Prepojenie na buffer objektov na ulozenie indexovacich udajov
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

    // Ziskanie atributu umiestnenia
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    // Ukazovatel atribútu na aktualne prepojeny objekt (VBO)
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Povolenie atributu umiestnenia
    gl.enableVertexAttribArray(coord);

    // Prepojenie na buffer objektov na ulozenie farieb
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);

    // Ziskanie atributu farby
    var color = gl.getAttribLocation(shaderProgram, "color");

    // Ukazovatel atribútu na buffer farby objektu
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false,0,0) ;

    // Povolenie atributu farby
    gl.enableVertexAttribArray(color);

    /*============Kreslenie objektu====================*/

    // Farba na vymazanie kresliaceho platna
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Povolenie kontroly hlbky
    gl.enable(gl.DEPTH_TEST);

    // Vymazanie kresliaceho platna
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Nastavenie viewportu (renderovacieho okna)
    gl.viewport(0,0,canvas.width,canvas.height);

    // Kreslenie trojuholnika
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);

}
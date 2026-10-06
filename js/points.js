
main();

function main() {

    /*================Vytvorenie gr. kontextu a kresliaceho platna=================*/
    var canvas = document.getElementById('glCanvas');
    gl = canvas.getContext('webgl');

    if (gl === null) { alert("Nemožno inicializovať WebGL."); return; }

    /*======== Definovanie geometrie (suradnice X,Y,Z bodov (vrcholov)) ===========*/

    var vertices = [
        -0.5,0.5,0.0,
        0.0,0.5,0.0,
        -0.5,0,0.0,
        0,0,0,
    ];


    // Vytvorenie a inicializacia prazdneho buffera objektov na ulozenie udajov o vrcholoch
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);   // aj gl.DYNAMIC_DRAW alebo gl.STREAM_DRAW
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /*========================= Shadre ========================*/
    // Shadery su male programy beziace na grafickej karte (GPU) a urcuju,
    // ako sa vykresluju pixely, vertexy alebo objekty.
    // Najcastejsie sa pisu v jazyku GLSL (OpenGL Shading Language).
    // Vertex (vrcholovy) shader: sa pouziva na transformaciu geometrie a spracovava polohu bodov (vertexov) v 3D priestore.
    // Fragment shader: sa pouziva na vypocitanie farby pixelov.



        // Retazec pre zdrojovy kod shadera vrcholov (vrcholovy shader)
    var vertCode =
        'attribute vec3 coordinates;' +

        'void main(void) {' +
        ' gl_Position = vec4(coordinates, 1.0);' +
        'gl_PointSize = 20.0;'+
        '}';

    // Vytvorenie objektu vrcholoveho shadera
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Dodanie/pripojenie zdrojoveho kodu vrcholoveho shadera
    gl.shaderSource(vertShader, vertCode);

    // Kompilacia vrcholoveho shadera
    gl.compileShader(vertShader);

    // Retazec pre zdrojovy kod shadera fragmentov
    var fragCode =
        'void main(void) {' +
        ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
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

    /*======== Asociacia shaderov s objektami vytvorenych buffererov geometrie ========*/

    // Prepojenie na buffer objektov na ulozenie udajov o vrcholoch
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Ziskanie atributu umiestnenia
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    // Ukazovatel atribútu na aktualne prepojeny objekt (VBO)
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Povolenie atributu umiestnenia
    gl.enableVertexAttribArray(coord);

    /*============= Kreslenie objektov (elementov) ===============*/

    // Farba na vymazanie kresliaceho platna
    gl.clearColor(0, 0, 0, 0.9);

    // Povolenie kontroly hlbky
    gl.enable(gl.DEPTH_TEST);

    // Vymazanie kresliaceho platna
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Nastavenie viewportu (renderovacieho okna)
    gl.viewport(0,0,canvas.width,canvas.height);

    // Kreslenie bodov
    gl.drawArrays(gl.POINTS, 0, 4);
}
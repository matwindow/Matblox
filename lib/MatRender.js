//MatRenderer (for 3D games in browser that use html) 0.0.0.2

//IMPORTANT!
//Copyright By Matwindow, please give credits if u wanna use this, u can add into the README.md this or else u get copyright striked:
//##### MatRenderer.js by ***Matwindow***

//==================!!!!WARNING!!!!=================
//this project (Might) be buggy, and is still in development

//================**How To Use**====================
//This libary shows the functions under MatR.function()
//To import it into your project, use:
//import * as MatR from ./lib/MatRender.js
//make shure its in the same dir wheres your project, and make shure its in the lib/ directrtory
//and that in your html file theres a canvas. that has the id of webgl2

export const canvas = document.getElementById('webgl2');
export const gl = canvas ? canvas.getContext('webgl2') : null;

if (!gl) {
    alert("Your Browser Is Not Supporting WEBGL! Please Use Another Browser");
}

const vsSource = `#version 300 es
    in vec3 position;
    void main() {
        gl_Position = vec4(position, 1.0);
    }
`;

const fsSource = `#version 300 es
    precision highp float;
    out vec4 outColor;
    void main() {
        outColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

let program = null;
let positionLoc = -1;

if (gl) {
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    positionLoc = gl.getAttribLocation(program, "position");
}

export const color = {
    convert: function(config, r, g, b) {
        if (config.from === "RGB" && config.to === "HEX") {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
        return null;
    },
    grad: function(range, stops) {
        return {
            type: "gradient",
            min: range.pos.min,
            max: range.pos.max,
            stops: stops
        };
    }
};

export const shape = {
    fill: 0,
    hollow: 1,
    
    draw: function(mode, colorConfig, pointsArray) {
        if (!gl || !program) return;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const flatPoints = pointsArray.flat();
        const vertexCount = flatPoints.length / 3;

        gl.useProgram(program);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatPoints), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

        const glMode = mode === 1 ? gl.LINE_STRIP : gl.TRIANGLES;
        gl.drawArrays(glMode, 0, vertexCount);
    }
};


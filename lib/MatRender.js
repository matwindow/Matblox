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
    out vec3 vPosition;
    void main() {
        gl_Position = vec4(position, 1.0);
        vPosition = position;
    }
`;

const fsSource = `#version 300 es
    precision highp float;
    in vec3 vPosition;
    out vec4 outColor;
    uniform vec4 colorMin;
    uniform vec4 colorMax;
    uniform float uMinY;
    uniform float uMaxY;
    void main() {
        float t = (vPosition.y - uMinY) / (uMaxY - uMinY);
        t = clamp(t, 0.0, 1.0);
        outColor = mix(colorMin, colorMax, t);
    }
`;

let program = null;
let positionLoc = -1;
let colorMinLoc = -1;
let colorMaxLoc = -1;
let uMinYLoc = -1;
let uMaxYLoc = -1;

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
        const activeGl = gl || (document.getElementById('webgl2') ? document.getElementById('webgl2').getContext('webgl2') : null);
        if (!activeGl) return;

        if (!program) {
            const vs = activeGl.createShader(activeGl.VERTEX_SHADER);
            activeGl.shaderSource(vs, vsSource);
            activeGl.compileShader(vs);

            const fs = activeGl.createShader(activeGl.FRAGMENT_SHADER);
            activeGl.shaderSource(fs, fsSource);
            activeGl.compileShader(fs);

            program = activeGl.createProgram();
            activeGl.attachShader(program, vs);
            activeGl.attachShader(program, fs);
            activeGl.linkProgram(program);

            positionLoc = activeGl.getAttribLocation(program, "position");
            colorMinLoc = activeGl.getUniformLocation(program, "colorMin");
            colorMaxLoc = activeGl.getUniformLocation(program, "colorMax");
            uMinYLoc = activeGl.getUniformLocation(program, "uMinY");
            uMaxYLoc = activeGl.getUniformLocation(program, "uMaxY");
        }

        activeGl.clearColor(0.0, 0.0, 0.0, 1.0);
        activeGl.clear(activeGl.COLOR_BUFFER_BIT);

        const flatPoints = pointsArray.flat();
        const vertexCount = flatPoints.length / 3;

        activeGl.useProgram(program);

        let r1 = 0.0, g1 = 0.0, b1 = 0.0;
        let r2 = 1.0, g2 = 1.0, b2 = 1.0;
        let minY = -1.0, maxY = 1.0;

        if (colorConfig && colorConfig.type === "gradient") {
            minY = colorConfig.min;
            maxY = colorConfig.max;
            
            if (colorConfig.stops && colorConfig.stops.length >= 2) {
                const hex1 = colorConfig.stops[0].color;
                r1 = parseInt(hex1.slice(1, 3), 16) / 255;
                g1 = parseInt(hex1.slice(3, 5), 16) / 255;
                b1 = parseInt(hex1.slice(5, 7), 16) / 255;

                const hex2 = colorConfig.stops[1].color;
                r2 = parseInt(hex2.slice(1, 3), 16) / 255;
                g2 = parseInt(hex2.slice(3, 5), 16) / 255;
                b2 = parseInt(hex2.slice(5, 7), 16) / 255;
            }
        }

        activeGl.uniform4f(colorMinLoc, r1, g1, b1, 1.0);
        activeGl.uniform4f(colorMaxLoc, r2, g2, b2, 1.0);
        activeGl.uniform1f(uMinYLoc, minY);
        activeGl.uniform1f(uMaxYLoc, maxY);

        const buffer = activeGl.createBuffer();
        activeGl.bindBuffer(activeGl.ARRAY_BUFFER, buffer);
        activeGl.bufferData(activeGl.ARRAY_BUFFER, new Float32Array(flatPoints), activeGl.STATIC_DRAW);

        activeGl.enableVertexAttribArray(positionLoc);
        activeGl.vertexAttribPointer(positionLoc, 3, activeGl.FLOAT, false, 0, 0);

        const glMode = mode === 1 ? activeGl.LINE_STRIP : activeGl.TRIANGLES;
        activeGl.drawArrays(glMode, 0, vertexCount);
    }
};

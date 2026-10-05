//MatRenderer (for 3D games in browser that use html) 0.0.0.3
//Copyright By Matwindow

export const canvas = document.getElementById('webgl2');
export const gl = canvas ? canvas.getContext('webgl2') : null;

if (!gl) {
    alert("Your Browser Is Not Supporting WEBGL! Please Use Another Browser");
    throw new Error("The Browser Dosent Suport WebGL!");
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
        if (!gl) return;

        if (!program) {
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
            colorMinLoc = gl.getUniformLocation(program, "colorMin");
            colorMaxLoc = gl.getUniformLocation(program, "colorMax");
            uMinYLoc = gl.getUniformLocation(program, "uMinY");
            uMaxYLoc = gl.getUniformLocation(program, "uMaxY");
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const flatPoints = pointsArray.flat();
        const vertexCount = flatPoints.length / 3;

        gl.useProgram(program);

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

        gl.uniform4f(colorMinLoc, r1, g1, b1, 1.0);
        gl.uniform4f(colorMaxLoc, r2, g2, b2, 1.0);
        gl.uniform1f(uMinYLoc, minY);
        gl.uniform1f(uMaxYLoc, maxY);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatPoints), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

        const glMode = mode === 1 ? gl.LINE_STRIP : gl.TRIANGLES;
        gl.drawArrays(glMode, 0, vertexCount);
    }
};

export function loop(renderCallback) {
    function tick() {
        renderCallback();
        requestAnimationFrame(tick);
    }
    tick();
}

export let time = {
    sun: {
        time: 0,
        dir: [10, 0, 0]
    }
};

export let camera = {
    pos: {
        x: 0,
        y: 0,
        z: 0
    },
    fov: 100,
    dir: {
        x: 0,
        y: 0,
        z: 0
    },
    opt: {
        shader: {
            shadows: {
                on: true,
                blocks: 2,
                get dir() { return time.sun.dir; }
            }
        }
    }
};

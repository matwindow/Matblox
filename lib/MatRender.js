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
export const gl = canvas.getContext('webgl2');
if (!gl){
alert("Your Browser Is Not Suporting WEBGL! Please Use An Other Browser")
}
console.log(gl)
export const color = {
    convert: function(config, r, g, b) {
        if (config.from === "RGB" && config.to === "HEX") {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
    },
    grad: function(range, stops) {
        return { type: "gradient", max: range.pos.max, min: range.pos.min, stops: stops };
    }
};

export const shape = {
    fill: 0,
    hollow: 1,
    
        draw: function(mode, colorConfig, pointsArray) {
        if (!gl) return;

        const flatPoints = pointsArray.flat();
        const vertexCount = flatPoints.length / 3;

        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, `#version 300 es
            in vec3 position;
            out vec3 vPosition;
            void main() {
                gl_Position = vec4(position, 1.0);
                vPosition = position;
            }
        `);
        gl.compileShader(vs);

        let fsCode = `#version 300 es
            precision highp float;
            in vec3 vPosition;
            out vec4 outColor;
            void main() { `;

        if (colorConfig && colorConfig.type === "gradient") {
            fsCode += `
                float t = (vPosition.y - (${colorConfig.min}.0)) / (${colorConfig.max}.0 - (${colorConfig.min}.0));
                t = clamp(t, 0.0, 1.0);
                vec4 colorMin = vec4(0.0, 0.0, 0.0, 1.0);
                vec4 colorMax = vec4(1.0, 1.0, 1.0, 1.0);
                outColor = mix(colorMin, colorMax, t);
            `;
        } else if (typeof colorConfig === "string" && colorConfig.startsWith("#")) {
            const r = parseInt(colorConfig.slice(1, 3), 16) / 255;
            const g = parseInt(colorConfig.slice(3, 5), 16) / 255;
            const b = parseInt(colorConfig.slice(5, 7), 16) / 255;
            fsCode += `outColor = vec4(${r}, ${g}, ${b}, 1.0);`;
        } else {
            fsCode += `outColor = vec4(1.0, 1.0, 1.0, 1.0);`;
        }
        
        fsCode += `}`;

        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fsCode);
        gl.compileShader(fs);

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatPoints), gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

        const glMode = mode === 1 ? gl.LINE_STRIP : gl.TRIANGLES;
        gl.drawArrays(glMode, 0, vertexCount);
    }

};

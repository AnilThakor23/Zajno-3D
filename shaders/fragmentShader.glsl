varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uHover;

void main() {
    float blocks = 20.0;
    vec2 blockUv = floor(vUv * blocks) / blocks;
    float distanceToMouse = length(blockUv - uMouse);
    float effect = smoothstep(0.3, 0.0, distanceToMouse);
    vec2 distortion = vec2(0.04) * effect;
    vec4 textureColor = texture2D(uTexture, vUv + distortion*uHover);
    gl_FragColor = textureColor;
}

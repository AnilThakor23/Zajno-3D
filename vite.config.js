import glsl from 'vite-plugin-glsl';

export default {
  plugins: [
    glsl({
      include: '**/*.glsl', // Glob pattern, or array of glob patterns to specify which files to include
      exclude: undefined, // Glob pattern, or array of glob patterns to specify which files to exclude
      warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
      defaultExtension: 'glsl', // Default extension for shader files if not specified
      compress: false, // Compress the shader code
    })
  ]
};

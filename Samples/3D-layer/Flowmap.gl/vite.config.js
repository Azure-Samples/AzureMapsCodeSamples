import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/Flowmap.gl.js',
      name: 'FlowmapGL',            
      fileName: () => 'Flowmapgl.bundle.js' 
    },
  },
})

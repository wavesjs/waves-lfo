Build FFT

```
source ~/dev/web-assembly/emsdk-portable/emsdk_env.sh
emcc c/fft.c -Os -s WASM=1 -s SIDE_MODULE=1 -o fft.wasm
```

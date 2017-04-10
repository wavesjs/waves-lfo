# Benchmark lfo/meyda

- https://calendar.perfplanet.com/2010/bulletproof-javascript-benchmarks/
- http://stackoverflow.com/questions/4986245/how-does-jsperf-work/4996963#4996963

## Node

lfo:fft - frameSize: 256 x 327 ops/sec ±0.81% (85 runs sampled)
meyda:fft - frameSize: 256 x 239 ops/sec ±1.27% (85 runs sampled)
==> Fastest is lfo:fft - frameSize: 256
lfo:fft - frameSize: 1024 x 285 ops/sec ±0.67% (88 runs sampled)
meyda:fft - frameSize: 1024 x 251 ops/sec ±0.84% (84 runs sampled)
==> Fastest is lfo:fft - frameSize: 1024
lfo:fft - frameSize: 4096 x 266 ops/sec ±0.64% (88 runs sampled)
meyda:fft - frameSize: 4096 x 170 ops/sec ±1.12% (85 runs sampled)
==> Fastest is lfo:fft - frameSize: 4096

lfo:rms - frameSize: 256 x 11,521 ops/sec ±0.78% (94 runs sampled)
meyda:rms - frameSize: 256 x 204 ops/sec ±1.02% (85 runs sampled)
==> Fastest is lfo:rms - frameSize: 256
lfo:rms - frameSize: 1024 x 13,653 ops/sec ±0.59% (93 runs sampled)
meyda:rms - frameSize: 1024 x 212 ops/sec ±0.86% (82 runs sampled)
==> Fastest is lfo:rms - frameSize: 1024
lfo:rms - frameSize: 4096 x 15,392 ops/sec ±0.49% (95 runs sampled)
meyda:rms - frameSize: 4096 x 168 ops/sec ±1.05% (84 runs sampled)
==> Fastest is lfo:rms - frameSize: 4096

lfo:mfcc - frameSize: 256 x 303 ops/sec ±0.71% (89 runs sampled)
meyda:mfcc - frameSize: 256 x 39.30 ops/sec ±1.57% (52 runs sampled)
==> Fastest is lfo:mfcc - frameSize: 256
lfo:mfcc - frameSize: 1024 x 281 ops/sec ±0.74% (87 runs sampled)
meyda:mfcc - frameSize: 1024 x 51.73 ops/sec ±2.05% (64 runs sampled)
==> Fastest is lfo:mfcc - frameSize: 1024
lfo:mfcc - frameSize: 4096 x 269 ops/sec ±0.59% (89 runs sampled)
meyda:mfcc - frameSize: 4096 x 55.34 ops/sec ±1.30% (57 runs sampled)
==> Fastest is lfo:mfcc - frameSize: 4096

## Chrome

lfo:fft - frameSize: 256 x 299 ops/sec ±1.00% (60 runs sampled)
meyda:fft - frameSize: 256 x 216 ops/sec ±1.36% (56 runs sampled)
==> Fastest is lfo:fft - frameSize: 256
lfo:fft - frameSize: 1024 x 258 ops/sec ±0.90% (60 runs sampled)
meyda:fft - frameSize: 1024 x 214 ops/sec ±0.93% (58 runs sampled)
==> Fastest is lfo:fft - frameSize: 1024
lfo:fft - frameSize: 4096 x 244 ops/sec ±1.17% (60 runs sampled)
meyda:fft - frameSize: 4096 x 148 ops/sec ±1.14% (55 runs sampled)
==> Fastest is lfo:fft - frameSize: 4096

lfo:rms - frameSize: 256 x 10,233 ops/sec ±0.87% (55 runs sampled)
meyda:rms - frameSize: 256 x 183 ops/sec ±1.14% (60 runs sampled)
==> Fastest is lfo:rms - frameSize: 256
lfo:rms - frameSize: 1024 x 12,316 ops/sec ±1.21% (61 runs sampled)
meyda:rms - frameSize: 1024 x 184 ops/sec ±0.96% (60 runs sampled)
==> Fastest is lfo:rms - frameSize: 1024
lfo:rms - frameSize: 4096 x 14,047 ops/sec ±0.94% (62 runs sampled)
meyda:rms - frameSize: 4096 x 148 ops/sec ±1.20% (55 runs sampled)
==> Fastest is lfo:rms - frameSize: 4096

lfo:mfcc - frameSize: 256 x 270 ops/sec ±1.15% (61 runs sampled)
meyda:mfcc - frameSize: 256 x 58.42 ops/sec ±1.40% (51 runs sampled)
==> Fastest is lfo:mfcc - frameSize: 256
lfo:mfcc - frameSize: 1024 x 253 ops/sec ±1.07% (60 runs sampled)
meyda:mfcc - frameSize: 1024 x 55.01 ops/sec ±1.22% (49 runs sampled)
==> Fastest is lfo:mfcc - frameSize: 1024
lfo:mfcc - frameSize: 4096 x 239 ops/sec ±0.85% (59 runs sampled)
meyda:mfcc - frameSize: 4096 x 55.68 ops/sec ±1.24% (49 runs sampled)
==> Fastest is lfo:mfcc - frameSize: 4096

## Firefox

lfo:fft - frameSize: 256 x 553 ops/sec ±0.75% (62 runs sampled)
meyda:fft - frameSize: 256 x 191 ops/sec ±4.04% (55 runs sampled)
==> Fastest is lfo:fft - frameSize: 256
lfo:fft - frameSize: 1024 x 504 ops/sec ±0.67% (62 runs sampled)
meyda:fft - frameSize: 1024 x 190 ops/sec ±3.84% (54 runs sampled)
==> Fastest is lfo:fft - frameSize: 1024
lfo:fft - frameSize: 4096 x 452 ops/sec ±0.89% (59 runs sampled)
meyda:fft - frameSize: 4096 x 58.81 ops/sec ±4.65% (50 runs sampled)
==> Fastest is lfo:fft - frameSize: 4096

lfo:rms - frameSize: 256 x 9,643 ops/sec ±1.27% (61 runs sampled)
meyda:rms - frameSize: 256 x 70.88 ops/sec ±3.19% (52 runs sampled)
==> Fastest is lfo:rms - frameSize: 256
lfo:rms - frameSize: 1024 x 18,943 ops/sec ±0.75% (62 runs sampled)
meyda:rms - frameSize: 1024 x 71.43 ops/sec ±3.37% (47 runs sampled)
==> Fastest is lfo:rms - frameSize: 1024
lfo:rms - frameSize: 4096 x 26,991 ops/sec ±0.88% (63 runs sampled)
meyda:rms - frameSize: 4096 x 59.76 ops/sec ±3.70% (51 runs sampled)
==> Fastest is lfo:rms - frameSize: 4096

lfo:mfcc - frameSize: 256 x 459 ops/sec ±0.73% (63 runs sampled)
meyda:mfcc - frameSize: 256 x 58.19 ops/sec ±3.52% (50 runs sampled)
==> Fastest is lfo:mfcc - frameSize: 256
lfo:mfcc - frameSize: 1024 x 479 ops/sec ±0.73% (62 runs sampled)
meyda:mfcc - frameSize: 1024 x 51.27 ops/sec ±3.75% (46 runs sampled)
==> Fastest is lfo:mfcc - frameSize: 1024
lfo:mfcc - frameSize: 4096 x 458 ops/sec ±0.56% (63 runs sampled)
meyda:mfcc - frameSize: 4096 x 45.03 ops/sec ±5.61% (41 runs sampled)
==> Fastest is lfo:mfcc - frameSize: 4096

## Safari

lfo:fft - frameSize: 256 x 723 ops/sec ±1.05% (64 runs sampled)
meyda:fft - frameSize: 256 x 69.82 ops/sec ±5.48% (38 runs sampled)
==> Fastest is lfo:fft - frameSize: 256
lfo:fft - frameSize: 1024 x 618 ops/sec ±0.50% (64 runs sampled)
meyda:fft - frameSize: 1024 x 64.90 ops/sec ±3.95% (43 runs sampled)
==> Fastest is lfo:fft - frameSize: 1024
lfo:fft - frameSize: 4096 x 566 ops/sec ±0.48% (66 runs sampled)
meyda:fft - frameSize: 4096 x 52.11 ops/sec ±2.03% (47 runs sampled)
==> Fastest is lfo:fft - frameSize: 4096

lfo:rms - frameSize: 256 x 25,185 ops/sec ±0.83% (49 runs sampled)
meyda:rms - frameSize: 256 x 52.30 ops/sec ±2.52% (40 runs sampled)
==> Fastest is lfo:rms - frameSize: 256
lfo:rms - frameSize: 1024 x 21,328 ops/sec ±0.72% (33 runs sampled)
meyda:rms - frameSize: 1024 x 48.37 ops/sec ±0.92% (44 runs sampled)
==> Fastest is lfo:rms - frameSize: 1024
lfo:rms - frameSize: 4096 x 15,810 ops/sec ±0.73% (17 runs sampled)
meyda:rms - frameSize: 4096 x 50.99 ops/sec ±3.20% (46 runs sampled)
==> Fastest is lfo:rms - frameSize: 4096

lfo:mfcc - frameSize: 256 x 545 ops/sec ±0.62% (66 runs sampled)
meyda:mfcc - frameSize: 256 x 18.69 ops/sec ±8.78% (22 runs sampled)
==> Fastest is lfo:mfcc - frameSize: 256
lfo:mfcc - frameSize: 1024 x 538 ops/sec ±0.35% (65 runs sampled)
meyda:mfcc - frameSize: 1024 x 17.50 ops/sec ±1.37% (33 runs sampled)
==> Fastest is lfo:mfcc - frameSize: 1024
lfo:mfcc - frameSize: 4096 x 506 ops/sec ±0.43% (65 runs sampled)
meyda:mfcc - frameSize: 4096 x 18.62 ops/sec ±1.39% (35 runs sampled)
==> Fastest is lfo:mfcc - frameSize: 4096


## Mobile Chrome (Samsung A3)



## Mobile Firefox 52.0.1 (Samsung A3)


## Mobile Safari (iphone ??)


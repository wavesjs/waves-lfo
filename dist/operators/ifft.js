"use strict";

// import BaseLfo from '../core/base-lfo';
// import jsfft from 'jsfft';
// import complexArray from 'jsfft/lib/complex_array';
// import initWindow from '../utils/fft-windows';

// // is it possible to do a ifft with only magnitude information ?
// export default class Ifft extends BaseLfo {
//   constructor(options) {
//     const defaults = {
//       binLength: 513,
//       dataType: 'magnitude'
//     }

//     super(options, defaults);
//   }

//   initialize() {
//     super.initialize();

//     this.inFrame = new Float32Array(this.params.binLength);
//   }

//   configureStream() {
//     this.streamParams.frameSize = (this.params.binLength - 1) * 2;
//   }

//   process(time, frame, metaData) {
//     const fftSize = this.streamParams.frameSize;
//     const binLength = this.params.binLength;

//     const scale = Math.sqrt(fftSize);

//     for (let i = 0; i < binLength; i++) {
//       const bin = this.params.outType === 'magnitude' ? frame[i] : Math.sqrt(frame[i]);
//       this.inFrame[i] = bin * scale;
//     }

//     // populate complexData
//     const complexFrame = new complexArray.ComplexArray(fftSize);
//     // signal can't be the same as fft input as we have lost phase information
//     complexFrame.map((value, index, length) => {
//       const nquiyst = fftSize / 2;
//       if (index === 0 || index === nquiyst) {
//         value.real = this.inFrame[index];
//         value.imag = 0; // use random phase between π and -π ?
//       } else {
//         let targetIndex = index < nquiyst ? index : fftSize - index;
//         value.real = this.inFrame[targetIndex] / 2;
//         value.imag = 0;
//       }
//     });

//     const signal = complexFrame.InvFFT().real;

//     // apply normalizeCoefs from windowing here to scale the signal ?
//   }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJlczYvb3BlcmF0b3JzL2lmZnQuanMiLCJzb3VyY2VzQ29udGVudCI6W119
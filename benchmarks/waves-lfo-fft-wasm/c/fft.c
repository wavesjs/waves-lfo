#include <stdint.h>
#include "fft.h"

#define M_SIN sin
#define M_PI 3.141592653589793

#define FFT_MIN_LOG2 1
#define FFT_MIN_SIZE (1 << FFT_MIN_LOG2)

#define FFT_MAX_LOG2 24
#define FFT_MAX_SIZE (1 << FFT_MAX_LOG2)

typedef struct cmplx {
  float re, im;
} cmplx_t;

/* simple FFT routines */
static void
calc_cfft_inplc(cmplx_t * restrict buf, float * restrict coef_re, float * restrict coef_im, uint32_t size) {
  uint32_t m, n;
  uint32_t j, k, up, down;

  for (up = 1, down = size >> 1; up < size; up <<= 1, down >>= 1)
  {
    for (j = 0, k = 0; j < up; j++, k += down)
    {
      float Wre = coef_re[k];
      float Wim = coef_im[k];
      uint32_t incr = 2 * up;

      for (m = j, n = j + up; m < size; m += incr, n += incr)
      {
        float Are = buf[m].re;
        float Aim = buf[m].im;
        float Bre = buf[n].re;
        float Bim = buf[n].im;
        float Cre = Bim * Wim + Bre * Wre;
        float Cim = Bim * Wre - Bre * Wim;
        buf[m].re = Are + Cre;
        buf[m].im = Aim + Cim;
        buf[n].re = Are - Cre;
        buf[n].im = Aim - Cim;
      }
    }
  }
}

static void
calc_cifft_inplc(cmplx_t * restrict buf, float * restrict coef_re, float * restrict coef_im, uint32_t size) {
  uint32_t m, n;
  uint32_t j, k, up, down;

  for (up = 1, down = size >> 1; up < size; up <<= 1, down >>= 1)
  {
    for (j = 0, k = 0; j < up; j++, k += down)
    {
      float Wre = coef_re[k];
      float Wim = coef_im[k];
      uint32_t incr = 2 * up;

      for (m = j, n = j + up; m < size; m += incr, n += incr)
      {
        float Are = buf[m].re;
        float Aim = buf[m].im;
        float Bre = buf[n].re;
        float Bim = buf[n].im;
        float Cre = Bre * Wre - Bim * Wim;
        float Cim = Bre * Wim + Bim * Wre;
        buf[m].re = Are + Cre;
        buf[m].im = Aim + Cim;
        buf[n].re = Are - Cre;
        buf[n].im = Aim - Cim;
      }
    }
  }
}

/* (I)FFT with over-sampled coefficient tables */
static void
calc_cfft_inplc_over_coef(cmplx_t * restrict buf, float *coef_re, float *coef_im, uint32_t size) {
  uint32_t m, n;
  uint32_t j, k, up, down;

  for (up = 1, down = size >> 1; up < size; up <<= 1, down >>= 1)
  {
    for (j = 0, k = 0; j < up; j++, k += 2 * down)
    {
      float Wre = coef_re[k];
      float Wim = coef_im[k];
      uint32_t incr = 2 * up;

      for (m = j, n = j + up; m < size; m += incr, n += incr)
      {
        float Are = buf[m].re;
        float Aim = buf[m].im;
        float Bre = buf[n].re;
        float Bim = buf[n].im;
        float Cre = Bim * Wim + Bre * Wre;
        float Cim = Bim * Wre - Bre * Wim;
        buf[m].re = Are + Cre;
        buf[m].im = Aim + Cim;
        buf[n].re = Are - Cre;
        buf[n].im = Aim - Cim;
      }
    }
  }
}

static void
calc_cifft_inplc_over_coef(cmplx_t * restrict buf, float *coef_re, float *coef_im, uint32_t size) {
  uint32_t m, n;
  uint32_t j, k, up, down;

  for (up = 1, down = size >> 1; up < size; up <<= 1, down >>= 1)
  {
    for (j = 0, k = 0; j < up; j++, k += 2 * down)
    {
      float Wre = coef_re[k];
      float Wim = coef_im[k];
      uint32_t incr = 2 * up;

      for (m = j, n = j + up; m < size; m += incr, n += incr)
      {
        float Are = buf[m].re;
        float Aim = buf[m].im;
        float Bre = buf[n].re;
        float Bim = buf[n].im;
        float Cre = Bre * Wre - Bim * Wim;
        float Cim = Bre * Wim + Bim * Wre;
        buf[m].re = Are + Cre;
        buf[m].im = Aim + Cim;
        buf[n].re = Are - Cre;
        buf[n].im = Aim - Cim;
      }
    }
  }
}

/* bitreversal buffer */
static void
apply_cfft_bitreversal_inplc(cmplx_t * restrict buf, uint32_t * restrict bitrev, uint32_t size) {
  uint32_t idx;
  cmplx_t z;

  for (idx = 0; idx < size; idx++)
  {
    uint32_t xdi = bitrev[idx];
    if (xdi > idx)
    {
      z = buf[idx];
      buf[idx] = buf[xdi];
      buf[xdi] = z;
    }
  }
}

static void
apply_cfft_bitreversal_outplc(cmplx_t * restrict in, cmplx_t * restrict out, uint32_t * restrict bitrev, uint32_t size) {
  uint32_t idx;

  for (idx = 0; idx < size; idx++)
  {
    uint32_t xdi = bitrev[idx];

    out[xdi] = in[idx];
  }
}

/* bitreversal with oversampled index table */
static void
apply_cfft_bitreversal_over_inplc(cmplx_t * restrict buf, uint32_t * restrict bitrev, uint32_t size) {
  uint32_t idx;
  cmplx_t z;

  for (idx = 0; idx < size; idx++)
  {
    uint32_t xdi = bitrev[2 * idx];

    if (xdi > idx)
    {
      z = buf[idx];
      buf[idx] = buf[xdi];
      buf[xdi] = z;
    }
  }
}

static void
apply_cfft_bitreversal_over_outplc(cmplx_t * restrict in, cmplx_t * restrict out, uint32_t * restrict bitrev, uint32_t size) {
  uint32_t idx;

  for (idx = 0; idx < size; idx++)
  {
    uint32_t xdi = bitrev[2 * idx];

    out[xdi] = in[idx];
  }
}

static void
apply_rfft_shuffle_after_fft_inplc(cmplx_t * restrict buf, float *coef_re, float *coef_im, int size) {
  int idx, xdi;
  float dc = buf[0].re + buf[0].im;
  float ny = buf[0].re - buf[0].im;

  buf[0].re = dc;
  buf[0].im = ny; /* nyquist point coded in imaginary part first point */

  for (idx = 1, xdi = size - 1; idx < size / 2; idx++, xdi--)
  {
    float x1_re = 0.5f * (buf[idx].re + buf[xdi].re);
    float x1_im = 0.5f * (buf[idx].im - buf[xdi].im);
    float x2_re = 0.5f * (buf[xdi].im + buf[idx].im);
    float x2_im = 0.5f * (buf[xdi].re - buf[idx].re);
    float x2Ej_re = x2_im * coef_im[idx] + x2_re * coef_re[idx]; /* real of x2[idx] * exp(-j*PI*i/size) */
    float x2Ej_im = x2_im * coef_re[idx] - x2_re * coef_im[idx]; /* imaginary of x2[idx] * exp(-j*PI*i/size) */

    buf[idx].re = x1_re + x2Ej_re;
    buf[idx].im = x1_im + x2Ej_im;
    buf[xdi].re = x1_re - x2Ej_re;
    buf[xdi].im = x2Ej_im - x1_im;
  }

  /* buf[idx].re = buf[idx].re; */
  buf[idx].im = -buf[idx].im;
}

static void
apply_rfft_shuffle_after_fft_outplc(cmplx_t * restrict in, cmplx_t * restrict out, float *coef_re, float *coef_im, int size) {
  int idx, xdi;
  float dc = in[0].re + in[0].im;
  float ny = in[0].re - in[0].im;

  out[0].re = dc;
  out[0].im = ny; /* nyquist point coded in imaginary part first point */

  for (idx = 1, xdi = size - 1; idx < size / 2; idx++, xdi--)
  {
    float x1_re = 0.5f * (in[idx].re + in[xdi].re);
    float x1_im = 0.5f * (in[idx].im - in[xdi].im);
    float x2_re = 0.5f * (in[xdi].im + in[idx].im);
    float x2_im = 0.5f * (in[xdi].re - in[idx].re);
    float x2Ej_re = x2_im * coef_im[idx] + x2_re * coef_re[idx]; /* real of x2[idx] * exp(-j*PI*i/size) */
    float x2Ej_im = x2_im * coef_re[idx] - x2_re * coef_im[idx]; /* imaginary of x2[idx] * exp(-j*PI*i/size) */

    out[idx].re = x1_re + x2Ej_re;
    out[idx].im = x1_im + x2Ej_im;
    out[xdi].re = x1_re - x2Ej_re;
    out[xdi].im = x2Ej_im - x1_im;
  }

  out[idx].re = in[idx].re;
  out[idx].im = -in[idx].im;
}

static void
apply_rfft_shuffle_before_ifft_inplc(cmplx_t * restrict buf, float *coef_re, float *coef_im, int size) {
  int idx, xdi;
  float dc = buf[0].re;
  float ny = buf[0].im; /* nyquist point coded in imaginary part first point */

  buf[0].re = dc + ny;
  buf[0].im = dc - ny;

  for (idx = 1, xdi = size - 1; idx < size / 2; idx++, xdi--)
  {
    float x1_re = buf[idx].re + buf[xdi].re;
    float x1_im = buf[idx].im - buf[xdi].im;
    float x2Ej_re = buf[idx].re - buf[xdi].re; /* real of x2[idx] * exp(-j*PI*i/size) */
    float x2Ej_im = buf[idx].im + buf[xdi].im; /* imaginary of x2[idx] * exp(-j*PI*i/size) */
    float x2_re = x2Ej_re * coef_re[idx] - x2Ej_im * coef_im[idx]; /* real of x2 */
    float x2_im = x2Ej_re * coef_im[idx] + x2Ej_im * coef_re[idx]; /* imaginary of x2 */

    buf[idx].re = x1_re - x2_im;
    buf[idx].im = x1_im + x2_re;
    buf[xdi].re = x1_re + x2_im;
    buf[xdi].im = x2_re - x1_im;
  }

  buf[idx].re *= 2;
  buf[idx].im *= -2;
}

static void
apply_rfft_shuffle_before_ifft_outplc(cmplx_t * restrict in, cmplx_t * restrict out, float *coef_re, float *coef_im, int size) {
  int idx, xdi;
  float dc = in[0].re;
  float ny = in[0].im; /* nyquist point coded in imaginary part first point */

  out[0].re = dc + ny;
  out[0].im = dc - ny;

  for (idx = 1, xdi = size - 1; idx < size / 2; idx++, xdi--)
  {
    float x1_re = in[idx].re + in[xdi].re;
    float x1_im = in[idx].im - in[xdi].im;
    float x2Ej_re = in[idx].re - in[xdi].re; /* real of x2[idx] * exp(-j*PI*i/size) */
    float x2Ej_im = in[idx].im + in[xdi].im; /* imaginary of x2[idx] * exp(-j*PI*i/size) */
    float x2_re = x2Ej_re * coef_re[idx] - x2Ej_im * coef_im[idx]; /* real of x2 */
    float x2_im = x2Ej_re * coef_im[idx] + x2Ej_im * coef_re[idx]; /* imaginary of x2 */

    out[idx].re = x1_re - x2_im;
    out[idx].im = x1_im + x2_re;
    out[xdi].re = x1_re + x2_im;
    out[xdi].im = x2_re - x1_im;
  }

  out[idx].re = 2 * in[idx].re;
  out[idx].im = -2 * in[idx].im;
}

/**************************************************************************************\
 *
 * the complex fft and ifft
 */

void
cfftInplc(float *complexBuf, uint32_t *bitrevTable, float *cosineTable, float *sineTable, uint32_t fftSize) {
  apply_cfft_bitreversal_inplc((cmplx_t *)complexBuf, bitrevTable, fftSize);
  calc_cfft_inplc((cmplx_t *)complexBuf, cosineTable, sineTable, fftSize);
}

void
cfft(float *complexIn, float *complexOut, uint32_t *bitrevTable, float *cosineTable, float *sineTable, uint32_t fftSize) {
  if (complexIn == complexOut)
    apply_cfft_bitreversal_inplc((cmplx_t *)complexOut, bitrevTable, fftSize);
  else
    apply_cfft_bitreversal_outplc((cmplx_t *)complexIn, (cmplx_t *)complexOut, bitrevTable, fftSize);

  calc_cfft_inplc((cmplx_t *)complexOut, cosineTable, sineTable, fftSize);
}

void
cifftInplc(float *complexBuf, uint32_t *bitrevTable, float *cosineTable, float *sineTable, uint32_t fftSize) {
  apply_cfft_bitreversal_inplc((cmplx_t *)complexBuf, bitrevTable, fftSize);
  calc_cifft_inplc((cmplx_t *)complexBuf, cosineTable, sineTable, fftSize);
}

void
cifft(float *complexIn, float *complexOut, uint32_t *bitrevTable, float *cosineTable, float *sineTable, uint32_t fftSize) {
  if (complexIn == complexOut)
    apply_cfft_bitreversal_inplc((cmplx_t *)complexOut, bitrevTable, fftSize);
  else
    apply_cfft_bitreversal_outplc((cmplx_t *)complexIn, (cmplx_t *)complexOut, bitrevTable, fftSize);

  calc_cifft_inplc((cmplx_t *)complexOut, cosineTable, sineTable, fftSize);
}

/**************************************************************************************\
 *
 * the "real" fft
 *
 */

void
rfftInplc(float *realBuf, uint32_t *bitrevTable, float *cosineTable, float *sineTable, uint32_t fftSize) {
  uint32_t complexSize = fftSize >> 1;

  apply_cfft_bitreversal_over_inplc((cmplx_t *)realBuf, bitrevTable, complexSize);
  calc_cfft_inplc_over_coef((cmplx_t *)realBuf, cosineTable, sineTable, complexSize);
  apply_rfft_shuffle_after_fft_inplc((cmplx_t *)realBuf, cosineTable, sineTable, complexSize);
}

void
rfft(float *realIn, float *complexOut, uint32_t *bitrevTable, float *cosineTable, float *sineTable, uint32_t fftSize) {
  uint32_t complexSize = fftSize >> 1;

  if (realIn == complexOut)
    apply_cfft_bitreversal_over_inplc((cmplx_t *)complexOut, bitrevTable, complexSize);
  else
    apply_cfft_bitreversal_over_outplc((cmplx_t *)realIn, (cmplx_t *)complexOut, bitrevTable, complexSize);

  calc_cfft_inplc_over_coef((cmplx_t *)complexOut, cosineTable, sineTable, complexSize);
  apply_rfft_shuffle_after_fft_inplc((cmplx_t *)complexOut, cosineTable, sineTable, complexSize);
}

void
rifftInplc(float *realBuf, uint32_t *bitrevTable, float *cosineTable, float *sineTable, uint32_t fftSize) {
  uint32_t complexSize = fftSize >> 1;

  apply_rfft_shuffle_before_ifft_inplc((cmplx_t *)realBuf, cosineTable, sineTable, complexSize);
  apply_cfft_bitreversal_over_inplc((cmplx_t *)realBuf, bitrevTable, complexSize);
  calc_cifft_inplc_over_coef((cmplx_t *)realBuf, cosineTable, sineTable, complexSize);
}

void
rifft(float *complexIn, float *realOut, uint32_t *bitrevTable, float *cosineTable, float *sineTable, uint32_t fftSize) {
  uint32_t complexSize = fftSize >> 1;

  if (complexIn == realOut)
    apply_rfft_shuffle_before_ifft_inplc((cmplx_t *)realOut, cosineTable, sineTable, complexSize);
  else
    apply_rfft_shuffle_before_ifft_outplc((cmplx_t *)complexIn, (cmplx_t *)realOut, cosineTable, sineTable, complexSize);

  apply_cfft_bitreversal_over_inplc((cmplx_t *)realOut, bitrevTable, complexSize);
  calc_cifft_inplc_over_coef((cmplx_t *)realOut, cosineTable, sineTable, complexSize);
}

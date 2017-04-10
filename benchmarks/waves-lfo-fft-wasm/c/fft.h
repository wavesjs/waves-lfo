void cfftInplc(float *complexBuf, uint32_t * restrict bitrev, float *cosineTable, float *sineTable, uint32_t fftSize);
void cfft(float *complexIn, float *complexOut, uint32_t * restrict bitrev, float *cosineTable, float *sineTable, uint32_t fftSize);
void cifftInplc(float *complexBuf, uint32_t * restrict bitrev, float *cosineTable, float *sineTable, uint32_t fftSize);
void cifft(float *complexIn, float *complexOut, uint32_t * restrict bitrev, float *cosineTable, float *sineTable, uint32_t fftSize);
void rfftInplc(float *realBuf, uint32_t * restrict bitrev, float *cosineTable, float *sineTable, uint32_t fftSize);
void rfft(float *realIn, float *complexOut, uint32_t * restrict bitrev, float *cosineTable, float *sineTable, uint32_t fftSize);
void rifftInplc(float *realBuf, uint32_t * restrict bitrev, float *cosineTable, float *sineTable, uint32_t fftSize);
void rifft(float *complexIn, float *realOut, uint32_t * restrict bitrev, float *cosineTable, float *sineTable, uint32_t fftSize);

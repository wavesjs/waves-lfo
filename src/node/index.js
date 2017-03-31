export const version = '%version%';

import * as _core from '../core';
export const core = _core;

export { default as operator } from '../common/operator/_namespace';
export { default as utils } from '../common/utils/_namespace';
export { default as source } from './source/_namespace';
export { default as sink } from './sink/_namespace';

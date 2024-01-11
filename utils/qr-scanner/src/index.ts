import { Exception as Exp, Result as Res } from '@zxing/library';
export { QrScanner } from './lib/QrScanner';

/** The type that the on result event returns */
export type Result = Res;

/** The type that the on exception event returns */
export type Exception = Exp;

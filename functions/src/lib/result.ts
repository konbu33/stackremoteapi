/**
 * return value type.
 * data attribute type define T.
 *
 */

export type Result<T> = {
  code: number;
  message: string;
  data: T;
};

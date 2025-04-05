type Timestamp = number;

type Key<T> = keyof T;

type SessionKey = string;

type Maybe<T> = T | undefined;
type Nullable<T> = T | null;
type ValueOf<T extends object> = T[keyof T];

type NullableKey<T> = { [P in keyof T]?: T[P] | null };
type NullableKeys<T, K extends Key<T> = Key<T>> = Pick<T, Exclude<Key<T>, K>> & NullableKey<Pick<T, K>>;

type Mutable<T> = { -readonly [K in keyof T]: T[K] };

/**
 * Make one or more keys optional. It is equivalent to Partial if the second type argument is omitted.
 * ```
 * ex: Optional<{ a: string; b: number; c: boolean }, 'a' | 'b'> -> { a?: string; b?: number; c: boolean }
 * ```
 */
type Optional<T, K extends Key<T> = Key<T>> = Pick<T, Exclude<Key<T>, K>> & Partial<Pick<T, K>>;

/**
 * Enforce one or more optional keys to be defined. The opposite of Optional.
 * ```
 * ex: Mandate<{ a?: string; b?: number; c: boolean }, 'a' | 'b'> -> { a: string; b: number; c: boolean }
 * ```
 */
type Mandate<T extends {}, K extends Key<T>> = Omit<T, K> & {
  [MK in K]-?: NonNullable<T[MK]>;
};

/**
 * A type to require at least one property of a type.
 * ```
 * ex: RequireAtLeastOne<{ a: string; b: number; c?: boolean }, 'a' | 'b'> -> { a?: string, b?: number, c?: boolean } will throw an error without at least 'a' or 'b'
 * ```
 */
type RequireAtLeastOne<T, Keys extends Key<T> = Key<T>> = Pick<T, Exclude<Key<T>, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

type Entries<T extends object> = [keyof T, ValueOf<T>][];

declare module "*.scss" {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

// declare module "dummy" {
//   module "react" {
//     export interface CSSProperties extends React.CSSProperties {
//       "--i"?: number;
//       "--themeColor"?: string;
//       "--primaryColor"?: string;
//       "--secondaryColor"?: string;
//       "--inputHeight"?: string;
//       "--switcherThreshold"?: string | number;
//       "--swooshClipPath"?: string;
//       "--wave-animation-duration"?: string;
//     }
//   }
// }

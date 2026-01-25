
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model GenerationJob
 * 
 */
export type GenerationJob = $Result.DefaultSelection<Prisma.$GenerationJobPayload>
/**
 * Model Book
 * 
 */
export type Book = $Result.DefaultSelection<Prisma.$BookPayload>
/**
 * Model ChildInput
 * 
 */
export type ChildInput = $Result.DefaultSelection<Prisma.$ChildInputPayload>
/**
 * Model Genre
 * 
 */
export type Genre = $Result.DefaultSelection<Prisma.$GenrePayload>
/**
 * Model BookPage
 * 
 */
export type BookPage = $Result.DefaultSelection<Prisma.$BookPagePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const GenerationJobStatus: {
  PENDING: 'PENDING',
  GENERATING_STORY: 'GENERATING_STORY',
  GENERATING_IMAGES: 'GENERATING_IMAGES',
  ASSEMBLING_PDF: 'ASSEMBLING_PDF',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type GenerationJobStatus = (typeof GenerationJobStatus)[keyof typeof GenerationJobStatus]


export const BookStatus: {
  PENDING: 'PENDING',
  GENERATING: 'GENERATING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type BookStatus = (typeof BookStatus)[keyof typeof BookStatus]

}

export type GenerationJobStatus = $Enums.GenerationJobStatus

export const GenerationJobStatus: typeof $Enums.GenerationJobStatus

export type BookStatus = $Enums.BookStatus

export const BookStatus: typeof $Enums.BookStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more GenerationJobs
 * const generationJobs = await prisma.generationJob.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more GenerationJobs
   * const generationJobs = await prisma.generationJob.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.generationJob`: Exposes CRUD operations for the **GenerationJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GenerationJobs
    * const generationJobs = await prisma.generationJob.findMany()
    * ```
    */
  get generationJob(): Prisma.GenerationJobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.book`: Exposes CRUD operations for the **Book** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Books
    * const books = await prisma.book.findMany()
    * ```
    */
  get book(): Prisma.BookDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.childInput`: Exposes CRUD operations for the **ChildInput** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChildInputs
    * const childInputs = await prisma.childInput.findMany()
    * ```
    */
  get childInput(): Prisma.ChildInputDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.genre`: Exposes CRUD operations for the **Genre** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Genres
    * const genres = await prisma.genre.findMany()
    * ```
    */
  get genre(): Prisma.GenreDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookPage`: Exposes CRUD operations for the **BookPage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookPages
    * const bookPages = await prisma.bookPage.findMany()
    * ```
    */
  get bookPage(): Prisma.BookPageDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    GenerationJob: 'GenerationJob',
    Book: 'Book',
    ChildInput: 'ChildInput',
    Genre: 'Genre',
    BookPage: 'BookPage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "generationJob" | "book" | "childInput" | "genre" | "bookPage"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      GenerationJob: {
        payload: Prisma.$GenerationJobPayload<ExtArgs>
        fields: Prisma.GenerationJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GenerationJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GenerationJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationJobPayload>
          }
          findFirst: {
            args: Prisma.GenerationJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GenerationJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationJobPayload>
          }
          findMany: {
            args: Prisma.GenerationJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationJobPayload>[]
          }
          create: {
            args: Prisma.GenerationJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationJobPayload>
          }
          createMany: {
            args: Prisma.GenerationJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GenerationJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationJobPayload>[]
          }
          delete: {
            args: Prisma.GenerationJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationJobPayload>
          }
          update: {
            args: Prisma.GenerationJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationJobPayload>
          }
          deleteMany: {
            args: Prisma.GenerationJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GenerationJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GenerationJobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationJobPayload>[]
          }
          upsert: {
            args: Prisma.GenerationJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationJobPayload>
          }
          aggregate: {
            args: Prisma.GenerationJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGenerationJob>
          }
          groupBy: {
            args: Prisma.GenerationJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<GenerationJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.GenerationJobCountArgs<ExtArgs>
            result: $Utils.Optional<GenerationJobCountAggregateOutputType> | number
          }
        }
      }
      Book: {
        payload: Prisma.$BookPayload<ExtArgs>
        fields: Prisma.BookFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>
          }
          findFirst: {
            args: Prisma.BookFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>
          }
          findMany: {
            args: Prisma.BookFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>[]
          }
          create: {
            args: Prisma.BookCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>
          }
          createMany: {
            args: Prisma.BookCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>[]
          }
          delete: {
            args: Prisma.BookDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>
          }
          update: {
            args: Prisma.BookUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>
          }
          deleteMany: {
            args: Prisma.BookDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>[]
          }
          upsert: {
            args: Prisma.BookUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>
          }
          aggregate: {
            args: Prisma.BookAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBook>
          }
          groupBy: {
            args: Prisma.BookGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookCountArgs<ExtArgs>
            result: $Utils.Optional<BookCountAggregateOutputType> | number
          }
        }
      }
      ChildInput: {
        payload: Prisma.$ChildInputPayload<ExtArgs>
        fields: Prisma.ChildInputFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChildInputFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildInputPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChildInputFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildInputPayload>
          }
          findFirst: {
            args: Prisma.ChildInputFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildInputPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChildInputFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildInputPayload>
          }
          findMany: {
            args: Prisma.ChildInputFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildInputPayload>[]
          }
          create: {
            args: Prisma.ChildInputCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildInputPayload>
          }
          createMany: {
            args: Prisma.ChildInputCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChildInputCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildInputPayload>[]
          }
          delete: {
            args: Prisma.ChildInputDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildInputPayload>
          }
          update: {
            args: Prisma.ChildInputUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildInputPayload>
          }
          deleteMany: {
            args: Prisma.ChildInputDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChildInputUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChildInputUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildInputPayload>[]
          }
          upsert: {
            args: Prisma.ChildInputUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildInputPayload>
          }
          aggregate: {
            args: Prisma.ChildInputAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChildInput>
          }
          groupBy: {
            args: Prisma.ChildInputGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChildInputGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChildInputCountArgs<ExtArgs>
            result: $Utils.Optional<ChildInputCountAggregateOutputType> | number
          }
        }
      }
      Genre: {
        payload: Prisma.$GenrePayload<ExtArgs>
        fields: Prisma.GenreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GenreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenrePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GenreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenrePayload>
          }
          findFirst: {
            args: Prisma.GenreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenrePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GenreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenrePayload>
          }
          findMany: {
            args: Prisma.GenreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenrePayload>[]
          }
          create: {
            args: Prisma.GenreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenrePayload>
          }
          createMany: {
            args: Prisma.GenreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GenreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenrePayload>[]
          }
          delete: {
            args: Prisma.GenreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenrePayload>
          }
          update: {
            args: Prisma.GenreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenrePayload>
          }
          deleteMany: {
            args: Prisma.GenreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GenreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GenreUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenrePayload>[]
          }
          upsert: {
            args: Prisma.GenreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenrePayload>
          }
          aggregate: {
            args: Prisma.GenreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGenre>
          }
          groupBy: {
            args: Prisma.GenreGroupByArgs<ExtArgs>
            result: $Utils.Optional<GenreGroupByOutputType>[]
          }
          count: {
            args: Prisma.GenreCountArgs<ExtArgs>
            result: $Utils.Optional<GenreCountAggregateOutputType> | number
          }
        }
      }
      BookPage: {
        payload: Prisma.$BookPagePayload<ExtArgs>
        fields: Prisma.BookPageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookPageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookPageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPagePayload>
          }
          findFirst: {
            args: Prisma.BookPageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookPageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPagePayload>
          }
          findMany: {
            args: Prisma.BookPageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPagePayload>[]
          }
          create: {
            args: Prisma.BookPageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPagePayload>
          }
          createMany: {
            args: Prisma.BookPageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookPageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPagePayload>[]
          }
          delete: {
            args: Prisma.BookPageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPagePayload>
          }
          update: {
            args: Prisma.BookPageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPagePayload>
          }
          deleteMany: {
            args: Prisma.BookPageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookPageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookPageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPagePayload>[]
          }
          upsert: {
            args: Prisma.BookPageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPagePayload>
          }
          aggregate: {
            args: Prisma.BookPageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookPage>
          }
          groupBy: {
            args: Prisma.BookPageGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookPageGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookPageCountArgs<ExtArgs>
            result: $Utils.Optional<BookPageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    generationJob?: GenerationJobOmit
    book?: BookOmit
    childInput?: ChildInputOmit
    genre?: GenreOmit
    bookPage?: BookPageOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type BookCountOutputType
   */

  export type BookCountOutputType = {
    pages: number
  }

  export type BookCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pages?: boolean | BookCountOutputTypeCountPagesArgs
  }

  // Custom InputTypes
  /**
   * BookCountOutputType without action
   */
  export type BookCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookCountOutputType
     */
    select?: BookCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BookCountOutputType without action
   */
  export type BookCountOutputTypeCountPagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookPageWhereInput
  }


  /**
   * Count Type ChildInputCountOutputType
   */

  export type ChildInputCountOutputType = {
    books: number
  }

  export type ChildInputCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    books?: boolean | ChildInputCountOutputTypeCountBooksArgs
  }

  // Custom InputTypes
  /**
   * ChildInputCountOutputType without action
   */
  export type ChildInputCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInputCountOutputType
     */
    select?: ChildInputCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChildInputCountOutputType without action
   */
  export type ChildInputCountOutputTypeCountBooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookWhereInput
  }


  /**
   * Count Type GenreCountOutputType
   */

  export type GenreCountOutputType = {
    books: number
  }

  export type GenreCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    books?: boolean | GenreCountOutputTypeCountBooksArgs
  }

  // Custom InputTypes
  /**
   * GenreCountOutputType without action
   */
  export type GenreCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenreCountOutputType
     */
    select?: GenreCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GenreCountOutputType without action
   */
  export type GenreCountOutputTypeCountBooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookWhereInput
  }


  /**
   * Models
   */

  /**
   * Model GenerationJob
   */

  export type AggregateGenerationJob = {
    _count: GenerationJobCountAggregateOutputType | null
    _avg: GenerationJobAvgAggregateOutputType | null
    _sum: GenerationJobSumAggregateOutputType | null
    _min: GenerationJobMinAggregateOutputType | null
    _max: GenerationJobMaxAggregateOutputType | null
  }

  export type GenerationJobAvgAggregateOutputType = {
    progress: number | null
    retryCount: number | null
  }

  export type GenerationJobSumAggregateOutputType = {
    progress: number | null
    retryCount: number | null
  }

  export type GenerationJobMinAggregateOutputType = {
    id: string | null
    bookId: string | null
    status: $Enums.GenerationJobStatus | null
    progress: number | null
    errorMessage: string | null
    retryCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    completedAt: Date | null
  }

  export type GenerationJobMaxAggregateOutputType = {
    id: string | null
    bookId: string | null
    status: $Enums.GenerationJobStatus | null
    progress: number | null
    errorMessage: string | null
    retryCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    completedAt: Date | null
  }

  export type GenerationJobCountAggregateOutputType = {
    id: number
    bookId: number
    status: number
    progress: number
    errorMessage: number
    retryCount: number
    createdAt: number
    updatedAt: number
    completedAt: number
    _all: number
  }


  export type GenerationJobAvgAggregateInputType = {
    progress?: true
    retryCount?: true
  }

  export type GenerationJobSumAggregateInputType = {
    progress?: true
    retryCount?: true
  }

  export type GenerationJobMinAggregateInputType = {
    id?: true
    bookId?: true
    status?: true
    progress?: true
    errorMessage?: true
    retryCount?: true
    createdAt?: true
    updatedAt?: true
    completedAt?: true
  }

  export type GenerationJobMaxAggregateInputType = {
    id?: true
    bookId?: true
    status?: true
    progress?: true
    errorMessage?: true
    retryCount?: true
    createdAt?: true
    updatedAt?: true
    completedAt?: true
  }

  export type GenerationJobCountAggregateInputType = {
    id?: true
    bookId?: true
    status?: true
    progress?: true
    errorMessage?: true
    retryCount?: true
    createdAt?: true
    updatedAt?: true
    completedAt?: true
    _all?: true
  }

  export type GenerationJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GenerationJob to aggregate.
     */
    where?: GenerationJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GenerationJobs to fetch.
     */
    orderBy?: GenerationJobOrderByWithRelationInput | GenerationJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GenerationJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GenerationJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GenerationJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GenerationJobs
    **/
    _count?: true | GenerationJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GenerationJobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GenerationJobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GenerationJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GenerationJobMaxAggregateInputType
  }

  export type GetGenerationJobAggregateType<T extends GenerationJobAggregateArgs> = {
        [P in keyof T & keyof AggregateGenerationJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGenerationJob[P]>
      : GetScalarType<T[P], AggregateGenerationJob[P]>
  }




  export type GenerationJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GenerationJobWhereInput
    orderBy?: GenerationJobOrderByWithAggregationInput | GenerationJobOrderByWithAggregationInput[]
    by: GenerationJobScalarFieldEnum[] | GenerationJobScalarFieldEnum
    having?: GenerationJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GenerationJobCountAggregateInputType | true
    _avg?: GenerationJobAvgAggregateInputType
    _sum?: GenerationJobSumAggregateInputType
    _min?: GenerationJobMinAggregateInputType
    _max?: GenerationJobMaxAggregateInputType
  }

  export type GenerationJobGroupByOutputType = {
    id: string
    bookId: string
    status: $Enums.GenerationJobStatus
    progress: number
    errorMessage: string | null
    retryCount: number
    createdAt: Date
    updatedAt: Date
    completedAt: Date | null
    _count: GenerationJobCountAggregateOutputType | null
    _avg: GenerationJobAvgAggregateOutputType | null
    _sum: GenerationJobSumAggregateOutputType | null
    _min: GenerationJobMinAggregateOutputType | null
    _max: GenerationJobMaxAggregateOutputType | null
  }

  type GetGenerationJobGroupByPayload<T extends GenerationJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GenerationJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GenerationJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GenerationJobGroupByOutputType[P]>
            : GetScalarType<T[P], GenerationJobGroupByOutputType[P]>
        }
      >
    >


  export type GenerationJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookId?: boolean
    status?: boolean
    progress?: boolean
    errorMessage?: boolean
    retryCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    book?: boolean | BookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generationJob"]>

  export type GenerationJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookId?: boolean
    status?: boolean
    progress?: boolean
    errorMessage?: boolean
    retryCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    book?: boolean | BookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generationJob"]>

  export type GenerationJobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookId?: boolean
    status?: boolean
    progress?: boolean
    errorMessage?: boolean
    retryCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    book?: boolean | BookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generationJob"]>

  export type GenerationJobSelectScalar = {
    id?: boolean
    bookId?: boolean
    status?: boolean
    progress?: boolean
    errorMessage?: boolean
    retryCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
  }

  export type GenerationJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bookId" | "status" | "progress" | "errorMessage" | "retryCount" | "createdAt" | "updatedAt" | "completedAt", ExtArgs["result"]["generationJob"]>
  export type GenerationJobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    book?: boolean | BookDefaultArgs<ExtArgs>
  }
  export type GenerationJobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    book?: boolean | BookDefaultArgs<ExtArgs>
  }
  export type GenerationJobIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    book?: boolean | BookDefaultArgs<ExtArgs>
  }

  export type $GenerationJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GenerationJob"
    objects: {
      book: Prisma.$BookPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bookId: string
      status: $Enums.GenerationJobStatus
      progress: number
      errorMessage: string | null
      retryCount: number
      createdAt: Date
      updatedAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["generationJob"]>
    composites: {}
  }

  type GenerationJobGetPayload<S extends boolean | null | undefined | GenerationJobDefaultArgs> = $Result.GetResult<Prisma.$GenerationJobPayload, S>

  type GenerationJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GenerationJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GenerationJobCountAggregateInputType | true
    }

  export interface GenerationJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GenerationJob'], meta: { name: 'GenerationJob' } }
    /**
     * Find zero or one GenerationJob that matches the filter.
     * @param {GenerationJobFindUniqueArgs} args - Arguments to find a GenerationJob
     * @example
     * // Get one GenerationJob
     * const generationJob = await prisma.generationJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GenerationJobFindUniqueArgs>(args: SelectSubset<T, GenerationJobFindUniqueArgs<ExtArgs>>): Prisma__GenerationJobClient<$Result.GetResult<Prisma.$GenerationJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GenerationJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GenerationJobFindUniqueOrThrowArgs} args - Arguments to find a GenerationJob
     * @example
     * // Get one GenerationJob
     * const generationJob = await prisma.generationJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GenerationJobFindUniqueOrThrowArgs>(args: SelectSubset<T, GenerationJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GenerationJobClient<$Result.GetResult<Prisma.$GenerationJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GenerationJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationJobFindFirstArgs} args - Arguments to find a GenerationJob
     * @example
     * // Get one GenerationJob
     * const generationJob = await prisma.generationJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GenerationJobFindFirstArgs>(args?: SelectSubset<T, GenerationJobFindFirstArgs<ExtArgs>>): Prisma__GenerationJobClient<$Result.GetResult<Prisma.$GenerationJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GenerationJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationJobFindFirstOrThrowArgs} args - Arguments to find a GenerationJob
     * @example
     * // Get one GenerationJob
     * const generationJob = await prisma.generationJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GenerationJobFindFirstOrThrowArgs>(args?: SelectSubset<T, GenerationJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__GenerationJobClient<$Result.GetResult<Prisma.$GenerationJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GenerationJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GenerationJobs
     * const generationJobs = await prisma.generationJob.findMany()
     * 
     * // Get first 10 GenerationJobs
     * const generationJobs = await prisma.generationJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const generationJobWithIdOnly = await prisma.generationJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GenerationJobFindManyArgs>(args?: SelectSubset<T, GenerationJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenerationJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GenerationJob.
     * @param {GenerationJobCreateArgs} args - Arguments to create a GenerationJob.
     * @example
     * // Create one GenerationJob
     * const GenerationJob = await prisma.generationJob.create({
     *   data: {
     *     // ... data to create a GenerationJob
     *   }
     * })
     * 
     */
    create<T extends GenerationJobCreateArgs>(args: SelectSubset<T, GenerationJobCreateArgs<ExtArgs>>): Prisma__GenerationJobClient<$Result.GetResult<Prisma.$GenerationJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GenerationJobs.
     * @param {GenerationJobCreateManyArgs} args - Arguments to create many GenerationJobs.
     * @example
     * // Create many GenerationJobs
     * const generationJob = await prisma.generationJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GenerationJobCreateManyArgs>(args?: SelectSubset<T, GenerationJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GenerationJobs and returns the data saved in the database.
     * @param {GenerationJobCreateManyAndReturnArgs} args - Arguments to create many GenerationJobs.
     * @example
     * // Create many GenerationJobs
     * const generationJob = await prisma.generationJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GenerationJobs and only return the `id`
     * const generationJobWithIdOnly = await prisma.generationJob.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GenerationJobCreateManyAndReturnArgs>(args?: SelectSubset<T, GenerationJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenerationJobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GenerationJob.
     * @param {GenerationJobDeleteArgs} args - Arguments to delete one GenerationJob.
     * @example
     * // Delete one GenerationJob
     * const GenerationJob = await prisma.generationJob.delete({
     *   where: {
     *     // ... filter to delete one GenerationJob
     *   }
     * })
     * 
     */
    delete<T extends GenerationJobDeleteArgs>(args: SelectSubset<T, GenerationJobDeleteArgs<ExtArgs>>): Prisma__GenerationJobClient<$Result.GetResult<Prisma.$GenerationJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GenerationJob.
     * @param {GenerationJobUpdateArgs} args - Arguments to update one GenerationJob.
     * @example
     * // Update one GenerationJob
     * const generationJob = await prisma.generationJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GenerationJobUpdateArgs>(args: SelectSubset<T, GenerationJobUpdateArgs<ExtArgs>>): Prisma__GenerationJobClient<$Result.GetResult<Prisma.$GenerationJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GenerationJobs.
     * @param {GenerationJobDeleteManyArgs} args - Arguments to filter GenerationJobs to delete.
     * @example
     * // Delete a few GenerationJobs
     * const { count } = await prisma.generationJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GenerationJobDeleteManyArgs>(args?: SelectSubset<T, GenerationJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GenerationJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GenerationJobs
     * const generationJob = await prisma.generationJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GenerationJobUpdateManyArgs>(args: SelectSubset<T, GenerationJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GenerationJobs and returns the data updated in the database.
     * @param {GenerationJobUpdateManyAndReturnArgs} args - Arguments to update many GenerationJobs.
     * @example
     * // Update many GenerationJobs
     * const generationJob = await prisma.generationJob.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GenerationJobs and only return the `id`
     * const generationJobWithIdOnly = await prisma.generationJob.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GenerationJobUpdateManyAndReturnArgs>(args: SelectSubset<T, GenerationJobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenerationJobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GenerationJob.
     * @param {GenerationJobUpsertArgs} args - Arguments to update or create a GenerationJob.
     * @example
     * // Update or create a GenerationJob
     * const generationJob = await prisma.generationJob.upsert({
     *   create: {
     *     // ... data to create a GenerationJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GenerationJob we want to update
     *   }
     * })
     */
    upsert<T extends GenerationJobUpsertArgs>(args: SelectSubset<T, GenerationJobUpsertArgs<ExtArgs>>): Prisma__GenerationJobClient<$Result.GetResult<Prisma.$GenerationJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GenerationJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationJobCountArgs} args - Arguments to filter GenerationJobs to count.
     * @example
     * // Count the number of GenerationJobs
     * const count = await prisma.generationJob.count({
     *   where: {
     *     // ... the filter for the GenerationJobs we want to count
     *   }
     * })
    **/
    count<T extends GenerationJobCountArgs>(
      args?: Subset<T, GenerationJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GenerationJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GenerationJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GenerationJobAggregateArgs>(args: Subset<T, GenerationJobAggregateArgs>): Prisma.PrismaPromise<GetGenerationJobAggregateType<T>>

    /**
     * Group by GenerationJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GenerationJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GenerationJobGroupByArgs['orderBy'] }
        : { orderBy?: GenerationJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GenerationJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGenerationJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GenerationJob model
   */
  readonly fields: GenerationJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GenerationJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GenerationJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    book<T extends BookDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookDefaultArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GenerationJob model
   */
  interface GenerationJobFieldRefs {
    readonly id: FieldRef<"GenerationJob", 'String'>
    readonly bookId: FieldRef<"GenerationJob", 'String'>
    readonly status: FieldRef<"GenerationJob", 'GenerationJobStatus'>
    readonly progress: FieldRef<"GenerationJob", 'Int'>
    readonly errorMessage: FieldRef<"GenerationJob", 'String'>
    readonly retryCount: FieldRef<"GenerationJob", 'Int'>
    readonly createdAt: FieldRef<"GenerationJob", 'DateTime'>
    readonly updatedAt: FieldRef<"GenerationJob", 'DateTime'>
    readonly completedAt: FieldRef<"GenerationJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GenerationJob findUnique
   */
  export type GenerationJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobInclude<ExtArgs> | null
    /**
     * Filter, which GenerationJob to fetch.
     */
    where: GenerationJobWhereUniqueInput
  }

  /**
   * GenerationJob findUniqueOrThrow
   */
  export type GenerationJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobInclude<ExtArgs> | null
    /**
     * Filter, which GenerationJob to fetch.
     */
    where: GenerationJobWhereUniqueInput
  }

  /**
   * GenerationJob findFirst
   */
  export type GenerationJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobInclude<ExtArgs> | null
    /**
     * Filter, which GenerationJob to fetch.
     */
    where?: GenerationJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GenerationJobs to fetch.
     */
    orderBy?: GenerationJobOrderByWithRelationInput | GenerationJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GenerationJobs.
     */
    cursor?: GenerationJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GenerationJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GenerationJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GenerationJobs.
     */
    distinct?: GenerationJobScalarFieldEnum | GenerationJobScalarFieldEnum[]
  }

  /**
   * GenerationJob findFirstOrThrow
   */
  export type GenerationJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobInclude<ExtArgs> | null
    /**
     * Filter, which GenerationJob to fetch.
     */
    where?: GenerationJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GenerationJobs to fetch.
     */
    orderBy?: GenerationJobOrderByWithRelationInput | GenerationJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GenerationJobs.
     */
    cursor?: GenerationJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GenerationJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GenerationJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GenerationJobs.
     */
    distinct?: GenerationJobScalarFieldEnum | GenerationJobScalarFieldEnum[]
  }

  /**
   * GenerationJob findMany
   */
  export type GenerationJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobInclude<ExtArgs> | null
    /**
     * Filter, which GenerationJobs to fetch.
     */
    where?: GenerationJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GenerationJobs to fetch.
     */
    orderBy?: GenerationJobOrderByWithRelationInput | GenerationJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GenerationJobs.
     */
    cursor?: GenerationJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GenerationJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GenerationJobs.
     */
    skip?: number
    distinct?: GenerationJobScalarFieldEnum | GenerationJobScalarFieldEnum[]
  }

  /**
   * GenerationJob create
   */
  export type GenerationJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobInclude<ExtArgs> | null
    /**
     * The data needed to create a GenerationJob.
     */
    data: XOR<GenerationJobCreateInput, GenerationJobUncheckedCreateInput>
  }

  /**
   * GenerationJob createMany
   */
  export type GenerationJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GenerationJobs.
     */
    data: GenerationJobCreateManyInput | GenerationJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GenerationJob createManyAndReturn
   */
  export type GenerationJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * The data used to create many GenerationJobs.
     */
    data: GenerationJobCreateManyInput | GenerationJobCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GenerationJob update
   */
  export type GenerationJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobInclude<ExtArgs> | null
    /**
     * The data needed to update a GenerationJob.
     */
    data: XOR<GenerationJobUpdateInput, GenerationJobUncheckedUpdateInput>
    /**
     * Choose, which GenerationJob to update.
     */
    where: GenerationJobWhereUniqueInput
  }

  /**
   * GenerationJob updateMany
   */
  export type GenerationJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GenerationJobs.
     */
    data: XOR<GenerationJobUpdateManyMutationInput, GenerationJobUncheckedUpdateManyInput>
    /**
     * Filter which GenerationJobs to update
     */
    where?: GenerationJobWhereInput
    /**
     * Limit how many GenerationJobs to update.
     */
    limit?: number
  }

  /**
   * GenerationJob updateManyAndReturn
   */
  export type GenerationJobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * The data used to update GenerationJobs.
     */
    data: XOR<GenerationJobUpdateManyMutationInput, GenerationJobUncheckedUpdateManyInput>
    /**
     * Filter which GenerationJobs to update
     */
    where?: GenerationJobWhereInput
    /**
     * Limit how many GenerationJobs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GenerationJob upsert
   */
  export type GenerationJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobInclude<ExtArgs> | null
    /**
     * The filter to search for the GenerationJob to update in case it exists.
     */
    where: GenerationJobWhereUniqueInput
    /**
     * In case the GenerationJob found by the `where` argument doesn't exist, create a new GenerationJob with this data.
     */
    create: XOR<GenerationJobCreateInput, GenerationJobUncheckedCreateInput>
    /**
     * In case the GenerationJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GenerationJobUpdateInput, GenerationJobUncheckedUpdateInput>
  }

  /**
   * GenerationJob delete
   */
  export type GenerationJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobInclude<ExtArgs> | null
    /**
     * Filter which GenerationJob to delete.
     */
    where: GenerationJobWhereUniqueInput
  }

  /**
   * GenerationJob deleteMany
   */
  export type GenerationJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GenerationJobs to delete
     */
    where?: GenerationJobWhereInput
    /**
     * Limit how many GenerationJobs to delete.
     */
    limit?: number
  }

  /**
   * GenerationJob without action
   */
  export type GenerationJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobInclude<ExtArgs> | null
  }


  /**
   * Model Book
   */

  export type AggregateBook = {
    _count: BookCountAggregateOutputType | null
    _min: BookMinAggregateOutputType | null
    _max: BookMaxAggregateOutputType | null
  }

  export type BookMinAggregateOutputType = {
    id: string | null
    userId: string | null
    childInputId: string | null
    genreId: string | null
    title: string | null
    status: $Enums.BookStatus | null
    pdfUrl: string | null
    illustrationStyle: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    childInputId: string | null
    genreId: string | null
    title: string | null
    status: $Enums.BookStatus | null
    pdfUrl: string | null
    illustrationStyle: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookCountAggregateOutputType = {
    id: number
    userId: number
    childInputId: number
    genreId: number
    title: number
    status: number
    pdfUrl: number
    illustrationStyle: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BookMinAggregateInputType = {
    id?: true
    userId?: true
    childInputId?: true
    genreId?: true
    title?: true
    status?: true
    pdfUrl?: true
    illustrationStyle?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookMaxAggregateInputType = {
    id?: true
    userId?: true
    childInputId?: true
    genreId?: true
    title?: true
    status?: true
    pdfUrl?: true
    illustrationStyle?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookCountAggregateInputType = {
    id?: true
    userId?: true
    childInputId?: true
    genreId?: true
    title?: true
    status?: true
    pdfUrl?: true
    illustrationStyle?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BookAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Book to aggregate.
     */
    where?: BookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Books to fetch.
     */
    orderBy?: BookOrderByWithRelationInput | BookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Books
    **/
    _count?: true | BookCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookMaxAggregateInputType
  }

  export type GetBookAggregateType<T extends BookAggregateArgs> = {
        [P in keyof T & keyof AggregateBook]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBook[P]>
      : GetScalarType<T[P], AggregateBook[P]>
  }




  export type BookGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookWhereInput
    orderBy?: BookOrderByWithAggregationInput | BookOrderByWithAggregationInput[]
    by: BookScalarFieldEnum[] | BookScalarFieldEnum
    having?: BookScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookCountAggregateInputType | true
    _min?: BookMinAggregateInputType
    _max?: BookMaxAggregateInputType
  }

  export type BookGroupByOutputType = {
    id: string
    userId: string
    childInputId: string
    genreId: string
    title: string | null
    status: $Enums.BookStatus
    pdfUrl: string | null
    illustrationStyle: string | null
    createdAt: Date
    updatedAt: Date
    _count: BookCountAggregateOutputType | null
    _min: BookMinAggregateOutputType | null
    _max: BookMaxAggregateOutputType | null
  }

  type GetBookGroupByPayload<T extends BookGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookGroupByOutputType[P]>
            : GetScalarType<T[P], BookGroupByOutputType[P]>
        }
      >
    >


  export type BookSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    childInputId?: boolean
    genreId?: boolean
    title?: boolean
    status?: boolean
    pdfUrl?: boolean
    illustrationStyle?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    childInput?: boolean | ChildInputDefaultArgs<ExtArgs>
    genre?: boolean | GenreDefaultArgs<ExtArgs>
    pages?: boolean | Book$pagesArgs<ExtArgs>
    generationJob?: boolean | Book$generationJobArgs<ExtArgs>
    _count?: boolean | BookCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["book"]>

  export type BookSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    childInputId?: boolean
    genreId?: boolean
    title?: boolean
    status?: boolean
    pdfUrl?: boolean
    illustrationStyle?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    childInput?: boolean | ChildInputDefaultArgs<ExtArgs>
    genre?: boolean | GenreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["book"]>

  export type BookSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    childInputId?: boolean
    genreId?: boolean
    title?: boolean
    status?: boolean
    pdfUrl?: boolean
    illustrationStyle?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    childInput?: boolean | ChildInputDefaultArgs<ExtArgs>
    genre?: boolean | GenreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["book"]>

  export type BookSelectScalar = {
    id?: boolean
    userId?: boolean
    childInputId?: boolean
    genreId?: boolean
    title?: boolean
    status?: boolean
    pdfUrl?: boolean
    illustrationStyle?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BookOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "childInputId" | "genreId" | "title" | "status" | "pdfUrl" | "illustrationStyle" | "createdAt" | "updatedAt", ExtArgs["result"]["book"]>
  export type BookInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    childInput?: boolean | ChildInputDefaultArgs<ExtArgs>
    genre?: boolean | GenreDefaultArgs<ExtArgs>
    pages?: boolean | Book$pagesArgs<ExtArgs>
    generationJob?: boolean | Book$generationJobArgs<ExtArgs>
    _count?: boolean | BookCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BookIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    childInput?: boolean | ChildInputDefaultArgs<ExtArgs>
    genre?: boolean | GenreDefaultArgs<ExtArgs>
  }
  export type BookIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    childInput?: boolean | ChildInputDefaultArgs<ExtArgs>
    genre?: boolean | GenreDefaultArgs<ExtArgs>
  }

  export type $BookPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Book"
    objects: {
      childInput: Prisma.$ChildInputPayload<ExtArgs>
      genre: Prisma.$GenrePayload<ExtArgs>
      pages: Prisma.$BookPagePayload<ExtArgs>[]
      generationJob: Prisma.$GenerationJobPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      childInputId: string
      genreId: string
      title: string | null
      status: $Enums.BookStatus
      pdfUrl: string | null
      illustrationStyle: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["book"]>
    composites: {}
  }

  type BookGetPayload<S extends boolean | null | undefined | BookDefaultArgs> = $Result.GetResult<Prisma.$BookPayload, S>

  type BookCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookCountAggregateInputType | true
    }

  export interface BookDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Book'], meta: { name: 'Book' } }
    /**
     * Find zero or one Book that matches the filter.
     * @param {BookFindUniqueArgs} args - Arguments to find a Book
     * @example
     * // Get one Book
     * const book = await prisma.book.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookFindUniqueArgs>(args: SelectSubset<T, BookFindUniqueArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Book that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookFindUniqueOrThrowArgs} args - Arguments to find a Book
     * @example
     * // Get one Book
     * const book = await prisma.book.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookFindUniqueOrThrowArgs>(args: SelectSubset<T, BookFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Book that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookFindFirstArgs} args - Arguments to find a Book
     * @example
     * // Get one Book
     * const book = await prisma.book.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookFindFirstArgs>(args?: SelectSubset<T, BookFindFirstArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Book that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookFindFirstOrThrowArgs} args - Arguments to find a Book
     * @example
     * // Get one Book
     * const book = await prisma.book.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookFindFirstOrThrowArgs>(args?: SelectSubset<T, BookFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Books that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Books
     * const books = await prisma.book.findMany()
     * 
     * // Get first 10 Books
     * const books = await prisma.book.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookWithIdOnly = await prisma.book.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookFindManyArgs>(args?: SelectSubset<T, BookFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Book.
     * @param {BookCreateArgs} args - Arguments to create a Book.
     * @example
     * // Create one Book
     * const Book = await prisma.book.create({
     *   data: {
     *     // ... data to create a Book
     *   }
     * })
     * 
     */
    create<T extends BookCreateArgs>(args: SelectSubset<T, BookCreateArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Books.
     * @param {BookCreateManyArgs} args - Arguments to create many Books.
     * @example
     * // Create many Books
     * const book = await prisma.book.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookCreateManyArgs>(args?: SelectSubset<T, BookCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Books and returns the data saved in the database.
     * @param {BookCreateManyAndReturnArgs} args - Arguments to create many Books.
     * @example
     * // Create many Books
     * const book = await prisma.book.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Books and only return the `id`
     * const bookWithIdOnly = await prisma.book.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookCreateManyAndReturnArgs>(args?: SelectSubset<T, BookCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Book.
     * @param {BookDeleteArgs} args - Arguments to delete one Book.
     * @example
     * // Delete one Book
     * const Book = await prisma.book.delete({
     *   where: {
     *     // ... filter to delete one Book
     *   }
     * })
     * 
     */
    delete<T extends BookDeleteArgs>(args: SelectSubset<T, BookDeleteArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Book.
     * @param {BookUpdateArgs} args - Arguments to update one Book.
     * @example
     * // Update one Book
     * const book = await prisma.book.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookUpdateArgs>(args: SelectSubset<T, BookUpdateArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Books.
     * @param {BookDeleteManyArgs} args - Arguments to filter Books to delete.
     * @example
     * // Delete a few Books
     * const { count } = await prisma.book.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookDeleteManyArgs>(args?: SelectSubset<T, BookDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Books
     * const book = await prisma.book.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookUpdateManyArgs>(args: SelectSubset<T, BookUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Books and returns the data updated in the database.
     * @param {BookUpdateManyAndReturnArgs} args - Arguments to update many Books.
     * @example
     * // Update many Books
     * const book = await prisma.book.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Books and only return the `id`
     * const bookWithIdOnly = await prisma.book.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookUpdateManyAndReturnArgs>(args: SelectSubset<T, BookUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Book.
     * @param {BookUpsertArgs} args - Arguments to update or create a Book.
     * @example
     * // Update or create a Book
     * const book = await prisma.book.upsert({
     *   create: {
     *     // ... data to create a Book
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Book we want to update
     *   }
     * })
     */
    upsert<T extends BookUpsertArgs>(args: SelectSubset<T, BookUpsertArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookCountArgs} args - Arguments to filter Books to count.
     * @example
     * // Count the number of Books
     * const count = await prisma.book.count({
     *   where: {
     *     // ... the filter for the Books we want to count
     *   }
     * })
    **/
    count<T extends BookCountArgs>(
      args?: Subset<T, BookCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Book.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookAggregateArgs>(args: Subset<T, BookAggregateArgs>): Prisma.PrismaPromise<GetBookAggregateType<T>>

    /**
     * Group by Book.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookGroupByArgs['orderBy'] }
        : { orderBy?: BookGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Book model
   */
  readonly fields: BookFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Book.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    childInput<T extends ChildInputDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChildInputDefaultArgs<ExtArgs>>): Prisma__ChildInputClient<$Result.GetResult<Prisma.$ChildInputPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    genre<T extends GenreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GenreDefaultArgs<ExtArgs>>): Prisma__GenreClient<$Result.GetResult<Prisma.$GenrePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    pages<T extends Book$pagesArgs<ExtArgs> = {}>(args?: Subset<T, Book$pagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    generationJob<T extends Book$generationJobArgs<ExtArgs> = {}>(args?: Subset<T, Book$generationJobArgs<ExtArgs>>): Prisma__GenerationJobClient<$Result.GetResult<Prisma.$GenerationJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Book model
   */
  interface BookFieldRefs {
    readonly id: FieldRef<"Book", 'String'>
    readonly userId: FieldRef<"Book", 'String'>
    readonly childInputId: FieldRef<"Book", 'String'>
    readonly genreId: FieldRef<"Book", 'String'>
    readonly title: FieldRef<"Book", 'String'>
    readonly status: FieldRef<"Book", 'BookStatus'>
    readonly pdfUrl: FieldRef<"Book", 'String'>
    readonly illustrationStyle: FieldRef<"Book", 'String'>
    readonly createdAt: FieldRef<"Book", 'DateTime'>
    readonly updatedAt: FieldRef<"Book", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Book findUnique
   */
  export type BookFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookInclude<ExtArgs> | null
    /**
     * Filter, which Book to fetch.
     */
    where: BookWhereUniqueInput
  }

  /**
   * Book findUniqueOrThrow
   */
  export type BookFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookInclude<ExtArgs> | null
    /**
     * Filter, which Book to fetch.
     */
    where: BookWhereUniqueInput
  }

  /**
   * Book findFirst
   */
  export type BookFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookInclude<ExtArgs> | null
    /**
     * Filter, which Book to fetch.
     */
    where?: BookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Books to fetch.
     */
    orderBy?: BookOrderByWithRelationInput | BookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Books.
     */
    cursor?: BookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Books.
     */
    distinct?: BookScalarFieldEnum | BookScalarFieldEnum[]
  }

  /**
   * Book findFirstOrThrow
   */
  export type BookFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookInclude<ExtArgs> | null
    /**
     * Filter, which Book to fetch.
     */
    where?: BookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Books to fetch.
     */
    orderBy?: BookOrderByWithRelationInput | BookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Books.
     */
    cursor?: BookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Books.
     */
    distinct?: BookScalarFieldEnum | BookScalarFieldEnum[]
  }

  /**
   * Book findMany
   */
  export type BookFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookInclude<ExtArgs> | null
    /**
     * Filter, which Books to fetch.
     */
    where?: BookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Books to fetch.
     */
    orderBy?: BookOrderByWithRelationInput | BookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Books.
     */
    cursor?: BookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Books.
     */
    skip?: number
    distinct?: BookScalarFieldEnum | BookScalarFieldEnum[]
  }

  /**
   * Book create
   */
  export type BookCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookInclude<ExtArgs> | null
    /**
     * The data needed to create a Book.
     */
    data: XOR<BookCreateInput, BookUncheckedCreateInput>
  }

  /**
   * Book createMany
   */
  export type BookCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Books.
     */
    data: BookCreateManyInput | BookCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Book createManyAndReturn
   */
  export type BookCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * The data used to create many Books.
     */
    data: BookCreateManyInput | BookCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Book update
   */
  export type BookUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookInclude<ExtArgs> | null
    /**
     * The data needed to update a Book.
     */
    data: XOR<BookUpdateInput, BookUncheckedUpdateInput>
    /**
     * Choose, which Book to update.
     */
    where: BookWhereUniqueInput
  }

  /**
   * Book updateMany
   */
  export type BookUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Books.
     */
    data: XOR<BookUpdateManyMutationInput, BookUncheckedUpdateManyInput>
    /**
     * Filter which Books to update
     */
    where?: BookWhereInput
    /**
     * Limit how many Books to update.
     */
    limit?: number
  }

  /**
   * Book updateManyAndReturn
   */
  export type BookUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * The data used to update Books.
     */
    data: XOR<BookUpdateManyMutationInput, BookUncheckedUpdateManyInput>
    /**
     * Filter which Books to update
     */
    where?: BookWhereInput
    /**
     * Limit how many Books to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Book upsert
   */
  export type BookUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookInclude<ExtArgs> | null
    /**
     * The filter to search for the Book to update in case it exists.
     */
    where: BookWhereUniqueInput
    /**
     * In case the Book found by the `where` argument doesn't exist, create a new Book with this data.
     */
    create: XOR<BookCreateInput, BookUncheckedCreateInput>
    /**
     * In case the Book was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookUpdateInput, BookUncheckedUpdateInput>
  }

  /**
   * Book delete
   */
  export type BookDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookInclude<ExtArgs> | null
    /**
     * Filter which Book to delete.
     */
    where: BookWhereUniqueInput
  }

  /**
   * Book deleteMany
   */
  export type BookDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Books to delete
     */
    where?: BookWhereInput
    /**
     * Limit how many Books to delete.
     */
    limit?: number
  }

  /**
   * Book.pages
   */
  export type Book$pagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageInclude<ExtArgs> | null
    where?: BookPageWhereInput
    orderBy?: BookPageOrderByWithRelationInput | BookPageOrderByWithRelationInput[]
    cursor?: BookPageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookPageScalarFieldEnum | BookPageScalarFieldEnum[]
  }

  /**
   * Book.generationJob
   */
  export type Book$generationJobArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationJob
     */
    select?: GenerationJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GenerationJob
     */
    omit?: GenerationJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationJobInclude<ExtArgs> | null
    where?: GenerationJobWhereInput
  }

  /**
   * Book without action
   */
  export type BookDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookInclude<ExtArgs> | null
  }


  /**
   * Model ChildInput
   */

  export type AggregateChildInput = {
    _count: ChildInputCountAggregateOutputType | null
    _avg: ChildInputAvgAggregateOutputType | null
    _sum: ChildInputSumAggregateOutputType | null
    _min: ChildInputMinAggregateOutputType | null
    _max: ChildInputMaxAggregateOutputType | null
  }

  export type ChildInputAvgAggregateOutputType = {
    age: number | null
  }

  export type ChildInputSumAggregateOutputType = {
    age: number | null
  }

  export type ChildInputMinAggregateOutputType = {
    id: string | null
    name: string | null
    age: number | null
    gender: string | null
    photoUrl: string | null
    photoKey: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChildInputMaxAggregateOutputType = {
    id: string | null
    name: string | null
    age: number | null
    gender: string | null
    photoUrl: string | null
    photoKey: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChildInputCountAggregateOutputType = {
    id: number
    name: number
    age: number
    gender: number
    photoUrl: number
    photoKey: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChildInputAvgAggregateInputType = {
    age?: true
  }

  export type ChildInputSumAggregateInputType = {
    age?: true
  }

  export type ChildInputMinAggregateInputType = {
    id?: true
    name?: true
    age?: true
    gender?: true
    photoUrl?: true
    photoKey?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChildInputMaxAggregateInputType = {
    id?: true
    name?: true
    age?: true
    gender?: true
    photoUrl?: true
    photoKey?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChildInputCountAggregateInputType = {
    id?: true
    name?: true
    age?: true
    gender?: true
    photoUrl?: true
    photoKey?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChildInputAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChildInput to aggregate.
     */
    where?: ChildInputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChildInputs to fetch.
     */
    orderBy?: ChildInputOrderByWithRelationInput | ChildInputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChildInputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChildInputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChildInputs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChildInputs
    **/
    _count?: true | ChildInputCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChildInputAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChildInputSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChildInputMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChildInputMaxAggregateInputType
  }

  export type GetChildInputAggregateType<T extends ChildInputAggregateArgs> = {
        [P in keyof T & keyof AggregateChildInput]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChildInput[P]>
      : GetScalarType<T[P], AggregateChildInput[P]>
  }




  export type ChildInputGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChildInputWhereInput
    orderBy?: ChildInputOrderByWithAggregationInput | ChildInputOrderByWithAggregationInput[]
    by: ChildInputScalarFieldEnum[] | ChildInputScalarFieldEnum
    having?: ChildInputScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChildInputCountAggregateInputType | true
    _avg?: ChildInputAvgAggregateInputType
    _sum?: ChildInputSumAggregateInputType
    _min?: ChildInputMinAggregateInputType
    _max?: ChildInputMaxAggregateInputType
  }

  export type ChildInputGroupByOutputType = {
    id: string
    name: string
    age: number | null
    gender: string | null
    photoUrl: string
    photoKey: string
    userId: string
    createdAt: Date
    updatedAt: Date
    _count: ChildInputCountAggregateOutputType | null
    _avg: ChildInputAvgAggregateOutputType | null
    _sum: ChildInputSumAggregateOutputType | null
    _min: ChildInputMinAggregateOutputType | null
    _max: ChildInputMaxAggregateOutputType | null
  }

  type GetChildInputGroupByPayload<T extends ChildInputGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChildInputGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChildInputGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChildInputGroupByOutputType[P]>
            : GetScalarType<T[P], ChildInputGroupByOutputType[P]>
        }
      >
    >


  export type ChildInputSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    age?: boolean
    gender?: boolean
    photoUrl?: boolean
    photoKey?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    books?: boolean | ChildInput$booksArgs<ExtArgs>
    _count?: boolean | ChildInputCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["childInput"]>

  export type ChildInputSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    age?: boolean
    gender?: boolean
    photoUrl?: boolean
    photoKey?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["childInput"]>

  export type ChildInputSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    age?: boolean
    gender?: boolean
    photoUrl?: boolean
    photoKey?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["childInput"]>

  export type ChildInputSelectScalar = {
    id?: boolean
    name?: boolean
    age?: boolean
    gender?: boolean
    photoUrl?: boolean
    photoKey?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChildInputOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "age" | "gender" | "photoUrl" | "photoKey" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["childInput"]>
  export type ChildInputInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    books?: boolean | ChildInput$booksArgs<ExtArgs>
    _count?: boolean | ChildInputCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChildInputIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ChildInputIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ChildInputPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChildInput"
    objects: {
      books: Prisma.$BookPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      age: number | null
      gender: string | null
      photoUrl: string
      photoKey: string
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["childInput"]>
    composites: {}
  }

  type ChildInputGetPayload<S extends boolean | null | undefined | ChildInputDefaultArgs> = $Result.GetResult<Prisma.$ChildInputPayload, S>

  type ChildInputCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChildInputFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChildInputCountAggregateInputType | true
    }

  export interface ChildInputDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChildInput'], meta: { name: 'ChildInput' } }
    /**
     * Find zero or one ChildInput that matches the filter.
     * @param {ChildInputFindUniqueArgs} args - Arguments to find a ChildInput
     * @example
     * // Get one ChildInput
     * const childInput = await prisma.childInput.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChildInputFindUniqueArgs>(args: SelectSubset<T, ChildInputFindUniqueArgs<ExtArgs>>): Prisma__ChildInputClient<$Result.GetResult<Prisma.$ChildInputPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChildInput that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChildInputFindUniqueOrThrowArgs} args - Arguments to find a ChildInput
     * @example
     * // Get one ChildInput
     * const childInput = await prisma.childInput.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChildInputFindUniqueOrThrowArgs>(args: SelectSubset<T, ChildInputFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChildInputClient<$Result.GetResult<Prisma.$ChildInputPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChildInput that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildInputFindFirstArgs} args - Arguments to find a ChildInput
     * @example
     * // Get one ChildInput
     * const childInput = await prisma.childInput.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChildInputFindFirstArgs>(args?: SelectSubset<T, ChildInputFindFirstArgs<ExtArgs>>): Prisma__ChildInputClient<$Result.GetResult<Prisma.$ChildInputPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChildInput that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildInputFindFirstOrThrowArgs} args - Arguments to find a ChildInput
     * @example
     * // Get one ChildInput
     * const childInput = await prisma.childInput.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChildInputFindFirstOrThrowArgs>(args?: SelectSubset<T, ChildInputFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChildInputClient<$Result.GetResult<Prisma.$ChildInputPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChildInputs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildInputFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChildInputs
     * const childInputs = await prisma.childInput.findMany()
     * 
     * // Get first 10 ChildInputs
     * const childInputs = await prisma.childInput.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const childInputWithIdOnly = await prisma.childInput.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChildInputFindManyArgs>(args?: SelectSubset<T, ChildInputFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChildInputPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChildInput.
     * @param {ChildInputCreateArgs} args - Arguments to create a ChildInput.
     * @example
     * // Create one ChildInput
     * const ChildInput = await prisma.childInput.create({
     *   data: {
     *     // ... data to create a ChildInput
     *   }
     * })
     * 
     */
    create<T extends ChildInputCreateArgs>(args: SelectSubset<T, ChildInputCreateArgs<ExtArgs>>): Prisma__ChildInputClient<$Result.GetResult<Prisma.$ChildInputPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChildInputs.
     * @param {ChildInputCreateManyArgs} args - Arguments to create many ChildInputs.
     * @example
     * // Create many ChildInputs
     * const childInput = await prisma.childInput.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChildInputCreateManyArgs>(args?: SelectSubset<T, ChildInputCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChildInputs and returns the data saved in the database.
     * @param {ChildInputCreateManyAndReturnArgs} args - Arguments to create many ChildInputs.
     * @example
     * // Create many ChildInputs
     * const childInput = await prisma.childInput.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChildInputs and only return the `id`
     * const childInputWithIdOnly = await prisma.childInput.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChildInputCreateManyAndReturnArgs>(args?: SelectSubset<T, ChildInputCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChildInputPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChildInput.
     * @param {ChildInputDeleteArgs} args - Arguments to delete one ChildInput.
     * @example
     * // Delete one ChildInput
     * const ChildInput = await prisma.childInput.delete({
     *   where: {
     *     // ... filter to delete one ChildInput
     *   }
     * })
     * 
     */
    delete<T extends ChildInputDeleteArgs>(args: SelectSubset<T, ChildInputDeleteArgs<ExtArgs>>): Prisma__ChildInputClient<$Result.GetResult<Prisma.$ChildInputPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChildInput.
     * @param {ChildInputUpdateArgs} args - Arguments to update one ChildInput.
     * @example
     * // Update one ChildInput
     * const childInput = await prisma.childInput.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChildInputUpdateArgs>(args: SelectSubset<T, ChildInputUpdateArgs<ExtArgs>>): Prisma__ChildInputClient<$Result.GetResult<Prisma.$ChildInputPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChildInputs.
     * @param {ChildInputDeleteManyArgs} args - Arguments to filter ChildInputs to delete.
     * @example
     * // Delete a few ChildInputs
     * const { count } = await prisma.childInput.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChildInputDeleteManyArgs>(args?: SelectSubset<T, ChildInputDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChildInputs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildInputUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChildInputs
     * const childInput = await prisma.childInput.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChildInputUpdateManyArgs>(args: SelectSubset<T, ChildInputUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChildInputs and returns the data updated in the database.
     * @param {ChildInputUpdateManyAndReturnArgs} args - Arguments to update many ChildInputs.
     * @example
     * // Update many ChildInputs
     * const childInput = await prisma.childInput.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChildInputs and only return the `id`
     * const childInputWithIdOnly = await prisma.childInput.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChildInputUpdateManyAndReturnArgs>(args: SelectSubset<T, ChildInputUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChildInputPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChildInput.
     * @param {ChildInputUpsertArgs} args - Arguments to update or create a ChildInput.
     * @example
     * // Update or create a ChildInput
     * const childInput = await prisma.childInput.upsert({
     *   create: {
     *     // ... data to create a ChildInput
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChildInput we want to update
     *   }
     * })
     */
    upsert<T extends ChildInputUpsertArgs>(args: SelectSubset<T, ChildInputUpsertArgs<ExtArgs>>): Prisma__ChildInputClient<$Result.GetResult<Prisma.$ChildInputPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChildInputs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildInputCountArgs} args - Arguments to filter ChildInputs to count.
     * @example
     * // Count the number of ChildInputs
     * const count = await prisma.childInput.count({
     *   where: {
     *     // ... the filter for the ChildInputs we want to count
     *   }
     * })
    **/
    count<T extends ChildInputCountArgs>(
      args?: Subset<T, ChildInputCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChildInputCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChildInput.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildInputAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChildInputAggregateArgs>(args: Subset<T, ChildInputAggregateArgs>): Prisma.PrismaPromise<GetChildInputAggregateType<T>>

    /**
     * Group by ChildInput.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildInputGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChildInputGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChildInputGroupByArgs['orderBy'] }
        : { orderBy?: ChildInputGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChildInputGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChildInputGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChildInput model
   */
  readonly fields: ChildInputFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChildInput.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChildInputClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    books<T extends ChildInput$booksArgs<ExtArgs> = {}>(args?: Subset<T, ChildInput$booksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChildInput model
   */
  interface ChildInputFieldRefs {
    readonly id: FieldRef<"ChildInput", 'String'>
    readonly name: FieldRef<"ChildInput", 'String'>
    readonly age: FieldRef<"ChildInput", 'Int'>
    readonly gender: FieldRef<"ChildInput", 'String'>
    readonly photoUrl: FieldRef<"ChildInput", 'String'>
    readonly photoKey: FieldRef<"ChildInput", 'String'>
    readonly userId: FieldRef<"ChildInput", 'String'>
    readonly createdAt: FieldRef<"ChildInput", 'DateTime'>
    readonly updatedAt: FieldRef<"ChildInput", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChildInput findUnique
   */
  export type ChildInputFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInput
     */
    select?: ChildInputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChildInput
     */
    omit?: ChildInputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInputInclude<ExtArgs> | null
    /**
     * Filter, which ChildInput to fetch.
     */
    where: ChildInputWhereUniqueInput
  }

  /**
   * ChildInput findUniqueOrThrow
   */
  export type ChildInputFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInput
     */
    select?: ChildInputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChildInput
     */
    omit?: ChildInputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInputInclude<ExtArgs> | null
    /**
     * Filter, which ChildInput to fetch.
     */
    where: ChildInputWhereUniqueInput
  }

  /**
   * ChildInput findFirst
   */
  export type ChildInputFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInput
     */
    select?: ChildInputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChildInput
     */
    omit?: ChildInputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInputInclude<ExtArgs> | null
    /**
     * Filter, which ChildInput to fetch.
     */
    where?: ChildInputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChildInputs to fetch.
     */
    orderBy?: ChildInputOrderByWithRelationInput | ChildInputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChildInputs.
     */
    cursor?: ChildInputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChildInputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChildInputs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChildInputs.
     */
    distinct?: ChildInputScalarFieldEnum | ChildInputScalarFieldEnum[]
  }

  /**
   * ChildInput findFirstOrThrow
   */
  export type ChildInputFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInput
     */
    select?: ChildInputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChildInput
     */
    omit?: ChildInputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInputInclude<ExtArgs> | null
    /**
     * Filter, which ChildInput to fetch.
     */
    where?: ChildInputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChildInputs to fetch.
     */
    orderBy?: ChildInputOrderByWithRelationInput | ChildInputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChildInputs.
     */
    cursor?: ChildInputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChildInputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChildInputs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChildInputs.
     */
    distinct?: ChildInputScalarFieldEnum | ChildInputScalarFieldEnum[]
  }

  /**
   * ChildInput findMany
   */
  export type ChildInputFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInput
     */
    select?: ChildInputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChildInput
     */
    omit?: ChildInputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInputInclude<ExtArgs> | null
    /**
     * Filter, which ChildInputs to fetch.
     */
    where?: ChildInputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChildInputs to fetch.
     */
    orderBy?: ChildInputOrderByWithRelationInput | ChildInputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChildInputs.
     */
    cursor?: ChildInputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChildInputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChildInputs.
     */
    skip?: number
    distinct?: ChildInputScalarFieldEnum | ChildInputScalarFieldEnum[]
  }

  /**
   * ChildInput create
   */
  export type ChildInputCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInput
     */
    select?: ChildInputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChildInput
     */
    omit?: ChildInputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInputInclude<ExtArgs> | null
    /**
     * The data needed to create a ChildInput.
     */
    data: XOR<ChildInputCreateInput, ChildInputUncheckedCreateInput>
  }

  /**
   * ChildInput createMany
   */
  export type ChildInputCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChildInputs.
     */
    data: ChildInputCreateManyInput | ChildInputCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChildInput createManyAndReturn
   */
  export type ChildInputCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInput
     */
    select?: ChildInputSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChildInput
     */
    omit?: ChildInputOmit<ExtArgs> | null
    /**
     * The data used to create many ChildInputs.
     */
    data: ChildInputCreateManyInput | ChildInputCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChildInput update
   */
  export type ChildInputUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInput
     */
    select?: ChildInputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChildInput
     */
    omit?: ChildInputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInputInclude<ExtArgs> | null
    /**
     * The data needed to update a ChildInput.
     */
    data: XOR<ChildInputUpdateInput, ChildInputUncheckedUpdateInput>
    /**
     * Choose, which ChildInput to update.
     */
    where: ChildInputWhereUniqueInput
  }

  /**
   * ChildInput updateMany
   */
  export type ChildInputUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChildInputs.
     */
    data: XOR<ChildInputUpdateManyMutationInput, ChildInputUncheckedUpdateManyInput>
    /**
     * Filter which ChildInputs to update
     */
    where?: ChildInputWhereInput
    /**
     * Limit how many ChildInputs to update.
     */
    limit?: number
  }

  /**
   * ChildInput updateManyAndReturn
   */
  export type ChildInputUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInput
     */
    select?: ChildInputSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChildInput
     */
    omit?: ChildInputOmit<ExtArgs> | null
    /**
     * The data used to update ChildInputs.
     */
    data: XOR<ChildInputUpdateManyMutationInput, ChildInputUncheckedUpdateManyInput>
    /**
     * Filter which ChildInputs to update
     */
    where?: ChildInputWhereInput
    /**
     * Limit how many ChildInputs to update.
     */
    limit?: number
  }

  /**
   * ChildInput upsert
   */
  export type ChildInputUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInput
     */
    select?: ChildInputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChildInput
     */
    omit?: ChildInputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInputInclude<ExtArgs> | null
    /**
     * The filter to search for the ChildInput to update in case it exists.
     */
    where: ChildInputWhereUniqueInput
    /**
     * In case the ChildInput found by the `where` argument doesn't exist, create a new ChildInput with this data.
     */
    create: XOR<ChildInputCreateInput, ChildInputUncheckedCreateInput>
    /**
     * In case the ChildInput was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChildInputUpdateInput, ChildInputUncheckedUpdateInput>
  }

  /**
   * ChildInput delete
   */
  export type ChildInputDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInput
     */
    select?: ChildInputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChildInput
     */
    omit?: ChildInputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInputInclude<ExtArgs> | null
    /**
     * Filter which ChildInput to delete.
     */
    where: ChildInputWhereUniqueInput
  }

  /**
   * ChildInput deleteMany
   */
  export type ChildInputDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChildInputs to delete
     */
    where?: ChildInputWhereInput
    /**
     * Limit how many ChildInputs to delete.
     */
    limit?: number
  }

  /**
   * ChildInput.books
   */
  export type ChildInput$booksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookInclude<ExtArgs> | null
    where?: BookWhereInput
    orderBy?: BookOrderByWithRelationInput | BookOrderByWithRelationInput[]
    cursor?: BookWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookScalarFieldEnum | BookScalarFieldEnum[]
  }

  /**
   * ChildInput without action
   */
  export type ChildInputDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildInput
     */
    select?: ChildInputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChildInput
     */
    omit?: ChildInputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInputInclude<ExtArgs> | null
  }


  /**
   * Model Genre
   */

  export type AggregateGenre = {
    _count: GenreCountAggregateOutputType | null
    _avg: GenreAvgAggregateOutputType | null
    _sum: GenreSumAggregateOutputType | null
    _min: GenreMinAggregateOutputType | null
    _max: GenreMaxAggregateOutputType | null
  }

  export type GenreAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type GenreSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type GenreMinAggregateOutputType = {
    id: string | null
    nameUz: string | null
    nameRu: string | null
    descriptionUz: string | null
    descriptionRu: string | null
    promptTemplate: string | null
    iconEmoji: string | null
    isActive: boolean | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GenreMaxAggregateOutputType = {
    id: string | null
    nameUz: string | null
    nameRu: string | null
    descriptionUz: string | null
    descriptionRu: string | null
    promptTemplate: string | null
    iconEmoji: string | null
    isActive: boolean | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GenreCountAggregateOutputType = {
    id: number
    nameUz: number
    nameRu: number
    descriptionUz: number
    descriptionRu: number
    promptTemplate: number
    iconEmoji: number
    isActive: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GenreAvgAggregateInputType = {
    sortOrder?: true
  }

  export type GenreSumAggregateInputType = {
    sortOrder?: true
  }

  export type GenreMinAggregateInputType = {
    id?: true
    nameUz?: true
    nameRu?: true
    descriptionUz?: true
    descriptionRu?: true
    promptTemplate?: true
    iconEmoji?: true
    isActive?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GenreMaxAggregateInputType = {
    id?: true
    nameUz?: true
    nameRu?: true
    descriptionUz?: true
    descriptionRu?: true
    promptTemplate?: true
    iconEmoji?: true
    isActive?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GenreCountAggregateInputType = {
    id?: true
    nameUz?: true
    nameRu?: true
    descriptionUz?: true
    descriptionRu?: true
    promptTemplate?: true
    iconEmoji?: true
    isActive?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GenreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Genre to aggregate.
     */
    where?: GenreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Genres to fetch.
     */
    orderBy?: GenreOrderByWithRelationInput | GenreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GenreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Genres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Genres.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Genres
    **/
    _count?: true | GenreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GenreAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GenreSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GenreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GenreMaxAggregateInputType
  }

  export type GetGenreAggregateType<T extends GenreAggregateArgs> = {
        [P in keyof T & keyof AggregateGenre]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGenre[P]>
      : GetScalarType<T[P], AggregateGenre[P]>
  }




  export type GenreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GenreWhereInput
    orderBy?: GenreOrderByWithAggregationInput | GenreOrderByWithAggregationInput[]
    by: GenreScalarFieldEnum[] | GenreScalarFieldEnum
    having?: GenreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GenreCountAggregateInputType | true
    _avg?: GenreAvgAggregateInputType
    _sum?: GenreSumAggregateInputType
    _min?: GenreMinAggregateInputType
    _max?: GenreMaxAggregateInputType
  }

  export type GenreGroupByOutputType = {
    id: string
    nameUz: string
    nameRu: string | null
    descriptionUz: string | null
    descriptionRu: string | null
    promptTemplate: string
    iconEmoji: string | null
    isActive: boolean
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: GenreCountAggregateOutputType | null
    _avg: GenreAvgAggregateOutputType | null
    _sum: GenreSumAggregateOutputType | null
    _min: GenreMinAggregateOutputType | null
    _max: GenreMaxAggregateOutputType | null
  }

  type GetGenreGroupByPayload<T extends GenreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GenreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GenreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GenreGroupByOutputType[P]>
            : GetScalarType<T[P], GenreGroupByOutputType[P]>
        }
      >
    >


  export type GenreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nameUz?: boolean
    nameRu?: boolean
    descriptionUz?: boolean
    descriptionRu?: boolean
    promptTemplate?: boolean
    iconEmoji?: boolean
    isActive?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    books?: boolean | Genre$booksArgs<ExtArgs>
    _count?: boolean | GenreCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["genre"]>

  export type GenreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nameUz?: boolean
    nameRu?: boolean
    descriptionUz?: boolean
    descriptionRu?: boolean
    promptTemplate?: boolean
    iconEmoji?: boolean
    isActive?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["genre"]>

  export type GenreSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nameUz?: boolean
    nameRu?: boolean
    descriptionUz?: boolean
    descriptionRu?: boolean
    promptTemplate?: boolean
    iconEmoji?: boolean
    isActive?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["genre"]>

  export type GenreSelectScalar = {
    id?: boolean
    nameUz?: boolean
    nameRu?: boolean
    descriptionUz?: boolean
    descriptionRu?: boolean
    promptTemplate?: boolean
    iconEmoji?: boolean
    isActive?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GenreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nameUz" | "nameRu" | "descriptionUz" | "descriptionRu" | "promptTemplate" | "iconEmoji" | "isActive" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["genre"]>
  export type GenreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    books?: boolean | Genre$booksArgs<ExtArgs>
    _count?: boolean | GenreCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GenreIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type GenreIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GenrePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Genre"
    objects: {
      books: Prisma.$BookPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nameUz: string
      nameRu: string | null
      descriptionUz: string | null
      descriptionRu: string | null
      promptTemplate: string
      iconEmoji: string | null
      isActive: boolean
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["genre"]>
    composites: {}
  }

  type GenreGetPayload<S extends boolean | null | undefined | GenreDefaultArgs> = $Result.GetResult<Prisma.$GenrePayload, S>

  type GenreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GenreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GenreCountAggregateInputType | true
    }

  export interface GenreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Genre'], meta: { name: 'Genre' } }
    /**
     * Find zero or one Genre that matches the filter.
     * @param {GenreFindUniqueArgs} args - Arguments to find a Genre
     * @example
     * // Get one Genre
     * const genre = await prisma.genre.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GenreFindUniqueArgs>(args: SelectSubset<T, GenreFindUniqueArgs<ExtArgs>>): Prisma__GenreClient<$Result.GetResult<Prisma.$GenrePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Genre that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GenreFindUniqueOrThrowArgs} args - Arguments to find a Genre
     * @example
     * // Get one Genre
     * const genre = await prisma.genre.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GenreFindUniqueOrThrowArgs>(args: SelectSubset<T, GenreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GenreClient<$Result.GetResult<Prisma.$GenrePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Genre that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenreFindFirstArgs} args - Arguments to find a Genre
     * @example
     * // Get one Genre
     * const genre = await prisma.genre.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GenreFindFirstArgs>(args?: SelectSubset<T, GenreFindFirstArgs<ExtArgs>>): Prisma__GenreClient<$Result.GetResult<Prisma.$GenrePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Genre that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenreFindFirstOrThrowArgs} args - Arguments to find a Genre
     * @example
     * // Get one Genre
     * const genre = await prisma.genre.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GenreFindFirstOrThrowArgs>(args?: SelectSubset<T, GenreFindFirstOrThrowArgs<ExtArgs>>): Prisma__GenreClient<$Result.GetResult<Prisma.$GenrePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Genres that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Genres
     * const genres = await prisma.genre.findMany()
     * 
     * // Get first 10 Genres
     * const genres = await prisma.genre.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const genreWithIdOnly = await prisma.genre.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GenreFindManyArgs>(args?: SelectSubset<T, GenreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenrePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Genre.
     * @param {GenreCreateArgs} args - Arguments to create a Genre.
     * @example
     * // Create one Genre
     * const Genre = await prisma.genre.create({
     *   data: {
     *     // ... data to create a Genre
     *   }
     * })
     * 
     */
    create<T extends GenreCreateArgs>(args: SelectSubset<T, GenreCreateArgs<ExtArgs>>): Prisma__GenreClient<$Result.GetResult<Prisma.$GenrePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Genres.
     * @param {GenreCreateManyArgs} args - Arguments to create many Genres.
     * @example
     * // Create many Genres
     * const genre = await prisma.genre.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GenreCreateManyArgs>(args?: SelectSubset<T, GenreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Genres and returns the data saved in the database.
     * @param {GenreCreateManyAndReturnArgs} args - Arguments to create many Genres.
     * @example
     * // Create many Genres
     * const genre = await prisma.genre.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Genres and only return the `id`
     * const genreWithIdOnly = await prisma.genre.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GenreCreateManyAndReturnArgs>(args?: SelectSubset<T, GenreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenrePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Genre.
     * @param {GenreDeleteArgs} args - Arguments to delete one Genre.
     * @example
     * // Delete one Genre
     * const Genre = await prisma.genre.delete({
     *   where: {
     *     // ... filter to delete one Genre
     *   }
     * })
     * 
     */
    delete<T extends GenreDeleteArgs>(args: SelectSubset<T, GenreDeleteArgs<ExtArgs>>): Prisma__GenreClient<$Result.GetResult<Prisma.$GenrePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Genre.
     * @param {GenreUpdateArgs} args - Arguments to update one Genre.
     * @example
     * // Update one Genre
     * const genre = await prisma.genre.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GenreUpdateArgs>(args: SelectSubset<T, GenreUpdateArgs<ExtArgs>>): Prisma__GenreClient<$Result.GetResult<Prisma.$GenrePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Genres.
     * @param {GenreDeleteManyArgs} args - Arguments to filter Genres to delete.
     * @example
     * // Delete a few Genres
     * const { count } = await prisma.genre.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GenreDeleteManyArgs>(args?: SelectSubset<T, GenreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Genres.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Genres
     * const genre = await prisma.genre.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GenreUpdateManyArgs>(args: SelectSubset<T, GenreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Genres and returns the data updated in the database.
     * @param {GenreUpdateManyAndReturnArgs} args - Arguments to update many Genres.
     * @example
     * // Update many Genres
     * const genre = await prisma.genre.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Genres and only return the `id`
     * const genreWithIdOnly = await prisma.genre.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GenreUpdateManyAndReturnArgs>(args: SelectSubset<T, GenreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenrePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Genre.
     * @param {GenreUpsertArgs} args - Arguments to update or create a Genre.
     * @example
     * // Update or create a Genre
     * const genre = await prisma.genre.upsert({
     *   create: {
     *     // ... data to create a Genre
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Genre we want to update
     *   }
     * })
     */
    upsert<T extends GenreUpsertArgs>(args: SelectSubset<T, GenreUpsertArgs<ExtArgs>>): Prisma__GenreClient<$Result.GetResult<Prisma.$GenrePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Genres.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenreCountArgs} args - Arguments to filter Genres to count.
     * @example
     * // Count the number of Genres
     * const count = await prisma.genre.count({
     *   where: {
     *     // ... the filter for the Genres we want to count
     *   }
     * })
    **/
    count<T extends GenreCountArgs>(
      args?: Subset<T, GenreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GenreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Genre.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GenreAggregateArgs>(args: Subset<T, GenreAggregateArgs>): Prisma.PrismaPromise<GetGenreAggregateType<T>>

    /**
     * Group by Genre.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenreGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GenreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GenreGroupByArgs['orderBy'] }
        : { orderBy?: GenreGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GenreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGenreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Genre model
   */
  readonly fields: GenreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Genre.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GenreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    books<T extends Genre$booksArgs<ExtArgs> = {}>(args?: Subset<T, Genre$booksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Genre model
   */
  interface GenreFieldRefs {
    readonly id: FieldRef<"Genre", 'String'>
    readonly nameUz: FieldRef<"Genre", 'String'>
    readonly nameRu: FieldRef<"Genre", 'String'>
    readonly descriptionUz: FieldRef<"Genre", 'String'>
    readonly descriptionRu: FieldRef<"Genre", 'String'>
    readonly promptTemplate: FieldRef<"Genre", 'String'>
    readonly iconEmoji: FieldRef<"Genre", 'String'>
    readonly isActive: FieldRef<"Genre", 'Boolean'>
    readonly sortOrder: FieldRef<"Genre", 'Int'>
    readonly createdAt: FieldRef<"Genre", 'DateTime'>
    readonly updatedAt: FieldRef<"Genre", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Genre findUnique
   */
  export type GenreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Genre
     */
    select?: GenreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Genre
     */
    omit?: GenreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenreInclude<ExtArgs> | null
    /**
     * Filter, which Genre to fetch.
     */
    where: GenreWhereUniqueInput
  }

  /**
   * Genre findUniqueOrThrow
   */
  export type GenreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Genre
     */
    select?: GenreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Genre
     */
    omit?: GenreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenreInclude<ExtArgs> | null
    /**
     * Filter, which Genre to fetch.
     */
    where: GenreWhereUniqueInput
  }

  /**
   * Genre findFirst
   */
  export type GenreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Genre
     */
    select?: GenreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Genre
     */
    omit?: GenreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenreInclude<ExtArgs> | null
    /**
     * Filter, which Genre to fetch.
     */
    where?: GenreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Genres to fetch.
     */
    orderBy?: GenreOrderByWithRelationInput | GenreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Genres.
     */
    cursor?: GenreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Genres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Genres.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Genres.
     */
    distinct?: GenreScalarFieldEnum | GenreScalarFieldEnum[]
  }

  /**
   * Genre findFirstOrThrow
   */
  export type GenreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Genre
     */
    select?: GenreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Genre
     */
    omit?: GenreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenreInclude<ExtArgs> | null
    /**
     * Filter, which Genre to fetch.
     */
    where?: GenreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Genres to fetch.
     */
    orderBy?: GenreOrderByWithRelationInput | GenreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Genres.
     */
    cursor?: GenreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Genres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Genres.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Genres.
     */
    distinct?: GenreScalarFieldEnum | GenreScalarFieldEnum[]
  }

  /**
   * Genre findMany
   */
  export type GenreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Genre
     */
    select?: GenreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Genre
     */
    omit?: GenreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenreInclude<ExtArgs> | null
    /**
     * Filter, which Genres to fetch.
     */
    where?: GenreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Genres to fetch.
     */
    orderBy?: GenreOrderByWithRelationInput | GenreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Genres.
     */
    cursor?: GenreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Genres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Genres.
     */
    skip?: number
    distinct?: GenreScalarFieldEnum | GenreScalarFieldEnum[]
  }

  /**
   * Genre create
   */
  export type GenreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Genre
     */
    select?: GenreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Genre
     */
    omit?: GenreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenreInclude<ExtArgs> | null
    /**
     * The data needed to create a Genre.
     */
    data: XOR<GenreCreateInput, GenreUncheckedCreateInput>
  }

  /**
   * Genre createMany
   */
  export type GenreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Genres.
     */
    data: GenreCreateManyInput | GenreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Genre createManyAndReturn
   */
  export type GenreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Genre
     */
    select?: GenreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Genre
     */
    omit?: GenreOmit<ExtArgs> | null
    /**
     * The data used to create many Genres.
     */
    data: GenreCreateManyInput | GenreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Genre update
   */
  export type GenreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Genre
     */
    select?: GenreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Genre
     */
    omit?: GenreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenreInclude<ExtArgs> | null
    /**
     * The data needed to update a Genre.
     */
    data: XOR<GenreUpdateInput, GenreUncheckedUpdateInput>
    /**
     * Choose, which Genre to update.
     */
    where: GenreWhereUniqueInput
  }

  /**
   * Genre updateMany
   */
  export type GenreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Genres.
     */
    data: XOR<GenreUpdateManyMutationInput, GenreUncheckedUpdateManyInput>
    /**
     * Filter which Genres to update
     */
    where?: GenreWhereInput
    /**
     * Limit how many Genres to update.
     */
    limit?: number
  }

  /**
   * Genre updateManyAndReturn
   */
  export type GenreUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Genre
     */
    select?: GenreSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Genre
     */
    omit?: GenreOmit<ExtArgs> | null
    /**
     * The data used to update Genres.
     */
    data: XOR<GenreUpdateManyMutationInput, GenreUncheckedUpdateManyInput>
    /**
     * Filter which Genres to update
     */
    where?: GenreWhereInput
    /**
     * Limit how many Genres to update.
     */
    limit?: number
  }

  /**
   * Genre upsert
   */
  export type GenreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Genre
     */
    select?: GenreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Genre
     */
    omit?: GenreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenreInclude<ExtArgs> | null
    /**
     * The filter to search for the Genre to update in case it exists.
     */
    where: GenreWhereUniqueInput
    /**
     * In case the Genre found by the `where` argument doesn't exist, create a new Genre with this data.
     */
    create: XOR<GenreCreateInput, GenreUncheckedCreateInput>
    /**
     * In case the Genre was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GenreUpdateInput, GenreUncheckedUpdateInput>
  }

  /**
   * Genre delete
   */
  export type GenreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Genre
     */
    select?: GenreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Genre
     */
    omit?: GenreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenreInclude<ExtArgs> | null
    /**
     * Filter which Genre to delete.
     */
    where: GenreWhereUniqueInput
  }

  /**
   * Genre deleteMany
   */
  export type GenreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Genres to delete
     */
    where?: GenreWhereInput
    /**
     * Limit how many Genres to delete.
     */
    limit?: number
  }

  /**
   * Genre.books
   */
  export type Genre$booksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Book
     */
    omit?: BookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookInclude<ExtArgs> | null
    where?: BookWhereInput
    orderBy?: BookOrderByWithRelationInput | BookOrderByWithRelationInput[]
    cursor?: BookWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookScalarFieldEnum | BookScalarFieldEnum[]
  }

  /**
   * Genre without action
   */
  export type GenreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Genre
     */
    select?: GenreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Genre
     */
    omit?: GenreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenreInclude<ExtArgs> | null
  }


  /**
   * Model BookPage
   */

  export type AggregateBookPage = {
    _count: BookPageCountAggregateOutputType | null
    _avg: BookPageAvgAggregateOutputType | null
    _sum: BookPageSumAggregateOutputType | null
    _min: BookPageMinAggregateOutputType | null
    _max: BookPageMaxAggregateOutputType | null
  }

  export type BookPageAvgAggregateOutputType = {
    pageNumber: number | null
  }

  export type BookPageSumAggregateOutputType = {
    pageNumber: number | null
  }

  export type BookPageMinAggregateOutputType = {
    id: string | null
    bookId: string | null
    pageNumber: number | null
    text: string | null
    sceneDescription: string | null
    imageUrl: string | null
    imageKey: string | null
    backgroundImageUrl: string | null
    backgroundImageKey: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookPageMaxAggregateOutputType = {
    id: string | null
    bookId: string | null
    pageNumber: number | null
    text: string | null
    sceneDescription: string | null
    imageUrl: string | null
    imageKey: string | null
    backgroundImageUrl: string | null
    backgroundImageKey: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookPageCountAggregateOutputType = {
    id: number
    bookId: number
    pageNumber: number
    text: number
    sceneDescription: number
    imageUrl: number
    imageKey: number
    backgroundImageUrl: number
    backgroundImageKey: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BookPageAvgAggregateInputType = {
    pageNumber?: true
  }

  export type BookPageSumAggregateInputType = {
    pageNumber?: true
  }

  export type BookPageMinAggregateInputType = {
    id?: true
    bookId?: true
    pageNumber?: true
    text?: true
    sceneDescription?: true
    imageUrl?: true
    imageKey?: true
    backgroundImageUrl?: true
    backgroundImageKey?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookPageMaxAggregateInputType = {
    id?: true
    bookId?: true
    pageNumber?: true
    text?: true
    sceneDescription?: true
    imageUrl?: true
    imageKey?: true
    backgroundImageUrl?: true
    backgroundImageKey?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookPageCountAggregateInputType = {
    id?: true
    bookId?: true
    pageNumber?: true
    text?: true
    sceneDescription?: true
    imageUrl?: true
    imageKey?: true
    backgroundImageUrl?: true
    backgroundImageKey?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BookPageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookPage to aggregate.
     */
    where?: BookPageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookPages to fetch.
     */
    orderBy?: BookPageOrderByWithRelationInput | BookPageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookPageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookPages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookPages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookPages
    **/
    _count?: true | BookPageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookPageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookPageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookPageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookPageMaxAggregateInputType
  }

  export type GetBookPageAggregateType<T extends BookPageAggregateArgs> = {
        [P in keyof T & keyof AggregateBookPage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookPage[P]>
      : GetScalarType<T[P], AggregateBookPage[P]>
  }




  export type BookPageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookPageWhereInput
    orderBy?: BookPageOrderByWithAggregationInput | BookPageOrderByWithAggregationInput[]
    by: BookPageScalarFieldEnum[] | BookPageScalarFieldEnum
    having?: BookPageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookPageCountAggregateInputType | true
    _avg?: BookPageAvgAggregateInputType
    _sum?: BookPageSumAggregateInputType
    _min?: BookPageMinAggregateInputType
    _max?: BookPageMaxAggregateInputType
  }

  export type BookPageGroupByOutputType = {
    id: string
    bookId: string
    pageNumber: number
    text: string
    sceneDescription: string | null
    imageUrl: string | null
    imageKey: string | null
    backgroundImageUrl: string | null
    backgroundImageKey: string | null
    createdAt: Date
    updatedAt: Date
    _count: BookPageCountAggregateOutputType | null
    _avg: BookPageAvgAggregateOutputType | null
    _sum: BookPageSumAggregateOutputType | null
    _min: BookPageMinAggregateOutputType | null
    _max: BookPageMaxAggregateOutputType | null
  }

  type GetBookPageGroupByPayload<T extends BookPageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookPageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookPageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookPageGroupByOutputType[P]>
            : GetScalarType<T[P], BookPageGroupByOutputType[P]>
        }
      >
    >


  export type BookPageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookId?: boolean
    pageNumber?: boolean
    text?: boolean
    sceneDescription?: boolean
    imageUrl?: boolean
    imageKey?: boolean
    backgroundImageUrl?: boolean
    backgroundImageKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    book?: boolean | BookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookPage"]>

  export type BookPageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookId?: boolean
    pageNumber?: boolean
    text?: boolean
    sceneDescription?: boolean
    imageUrl?: boolean
    imageKey?: boolean
    backgroundImageUrl?: boolean
    backgroundImageKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    book?: boolean | BookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookPage"]>

  export type BookPageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookId?: boolean
    pageNumber?: boolean
    text?: boolean
    sceneDescription?: boolean
    imageUrl?: boolean
    imageKey?: boolean
    backgroundImageUrl?: boolean
    backgroundImageKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    book?: boolean | BookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookPage"]>

  export type BookPageSelectScalar = {
    id?: boolean
    bookId?: boolean
    pageNumber?: boolean
    text?: boolean
    sceneDescription?: boolean
    imageUrl?: boolean
    imageKey?: boolean
    backgroundImageUrl?: boolean
    backgroundImageKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BookPageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bookId" | "pageNumber" | "text" | "sceneDescription" | "imageUrl" | "imageKey" | "backgroundImageUrl" | "backgroundImageKey" | "createdAt" | "updatedAt", ExtArgs["result"]["bookPage"]>
  export type BookPageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    book?: boolean | BookDefaultArgs<ExtArgs>
  }
  export type BookPageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    book?: boolean | BookDefaultArgs<ExtArgs>
  }
  export type BookPageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    book?: boolean | BookDefaultArgs<ExtArgs>
  }

  export type $BookPagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookPage"
    objects: {
      book: Prisma.$BookPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bookId: string
      pageNumber: number
      text: string
      sceneDescription: string | null
      imageUrl: string | null
      imageKey: string | null
      backgroundImageUrl: string | null
      backgroundImageKey: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["bookPage"]>
    composites: {}
  }

  type BookPageGetPayload<S extends boolean | null | undefined | BookPageDefaultArgs> = $Result.GetResult<Prisma.$BookPagePayload, S>

  type BookPageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookPageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookPageCountAggregateInputType | true
    }

  export interface BookPageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookPage'], meta: { name: 'BookPage' } }
    /**
     * Find zero or one BookPage that matches the filter.
     * @param {BookPageFindUniqueArgs} args - Arguments to find a BookPage
     * @example
     * // Get one BookPage
     * const bookPage = await prisma.bookPage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookPageFindUniqueArgs>(args: SelectSubset<T, BookPageFindUniqueArgs<ExtArgs>>): Prisma__BookPageClient<$Result.GetResult<Prisma.$BookPagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BookPage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookPageFindUniqueOrThrowArgs} args - Arguments to find a BookPage
     * @example
     * // Get one BookPage
     * const bookPage = await prisma.bookPage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookPageFindUniqueOrThrowArgs>(args: SelectSubset<T, BookPageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookPageClient<$Result.GetResult<Prisma.$BookPagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookPage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPageFindFirstArgs} args - Arguments to find a BookPage
     * @example
     * // Get one BookPage
     * const bookPage = await prisma.bookPage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookPageFindFirstArgs>(args?: SelectSubset<T, BookPageFindFirstArgs<ExtArgs>>): Prisma__BookPageClient<$Result.GetResult<Prisma.$BookPagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookPage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPageFindFirstOrThrowArgs} args - Arguments to find a BookPage
     * @example
     * // Get one BookPage
     * const bookPage = await prisma.bookPage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookPageFindFirstOrThrowArgs>(args?: SelectSubset<T, BookPageFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookPageClient<$Result.GetResult<Prisma.$BookPagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BookPages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookPages
     * const bookPages = await prisma.bookPage.findMany()
     * 
     * // Get first 10 BookPages
     * const bookPages = await prisma.bookPage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookPageWithIdOnly = await prisma.bookPage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookPageFindManyArgs>(args?: SelectSubset<T, BookPageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BookPage.
     * @param {BookPageCreateArgs} args - Arguments to create a BookPage.
     * @example
     * // Create one BookPage
     * const BookPage = await prisma.bookPage.create({
     *   data: {
     *     // ... data to create a BookPage
     *   }
     * })
     * 
     */
    create<T extends BookPageCreateArgs>(args: SelectSubset<T, BookPageCreateArgs<ExtArgs>>): Prisma__BookPageClient<$Result.GetResult<Prisma.$BookPagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BookPages.
     * @param {BookPageCreateManyArgs} args - Arguments to create many BookPages.
     * @example
     * // Create many BookPages
     * const bookPage = await prisma.bookPage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookPageCreateManyArgs>(args?: SelectSubset<T, BookPageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookPages and returns the data saved in the database.
     * @param {BookPageCreateManyAndReturnArgs} args - Arguments to create many BookPages.
     * @example
     * // Create many BookPages
     * const bookPage = await prisma.bookPage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookPages and only return the `id`
     * const bookPageWithIdOnly = await prisma.bookPage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookPageCreateManyAndReturnArgs>(args?: SelectSubset<T, BookPageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BookPage.
     * @param {BookPageDeleteArgs} args - Arguments to delete one BookPage.
     * @example
     * // Delete one BookPage
     * const BookPage = await prisma.bookPage.delete({
     *   where: {
     *     // ... filter to delete one BookPage
     *   }
     * })
     * 
     */
    delete<T extends BookPageDeleteArgs>(args: SelectSubset<T, BookPageDeleteArgs<ExtArgs>>): Prisma__BookPageClient<$Result.GetResult<Prisma.$BookPagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BookPage.
     * @param {BookPageUpdateArgs} args - Arguments to update one BookPage.
     * @example
     * // Update one BookPage
     * const bookPage = await prisma.bookPage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookPageUpdateArgs>(args: SelectSubset<T, BookPageUpdateArgs<ExtArgs>>): Prisma__BookPageClient<$Result.GetResult<Prisma.$BookPagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BookPages.
     * @param {BookPageDeleteManyArgs} args - Arguments to filter BookPages to delete.
     * @example
     * // Delete a few BookPages
     * const { count } = await prisma.bookPage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookPageDeleteManyArgs>(args?: SelectSubset<T, BookPageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookPages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookPages
     * const bookPage = await prisma.bookPage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookPageUpdateManyArgs>(args: SelectSubset<T, BookPageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookPages and returns the data updated in the database.
     * @param {BookPageUpdateManyAndReturnArgs} args - Arguments to update many BookPages.
     * @example
     * // Update many BookPages
     * const bookPage = await prisma.bookPage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BookPages and only return the `id`
     * const bookPageWithIdOnly = await prisma.bookPage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookPageUpdateManyAndReturnArgs>(args: SelectSubset<T, BookPageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BookPage.
     * @param {BookPageUpsertArgs} args - Arguments to update or create a BookPage.
     * @example
     * // Update or create a BookPage
     * const bookPage = await prisma.bookPage.upsert({
     *   create: {
     *     // ... data to create a BookPage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookPage we want to update
     *   }
     * })
     */
    upsert<T extends BookPageUpsertArgs>(args: SelectSubset<T, BookPageUpsertArgs<ExtArgs>>): Prisma__BookPageClient<$Result.GetResult<Prisma.$BookPagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BookPages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPageCountArgs} args - Arguments to filter BookPages to count.
     * @example
     * // Count the number of BookPages
     * const count = await prisma.bookPage.count({
     *   where: {
     *     // ... the filter for the BookPages we want to count
     *   }
     * })
    **/
    count<T extends BookPageCountArgs>(
      args?: Subset<T, BookPageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookPageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookPage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookPageAggregateArgs>(args: Subset<T, BookPageAggregateArgs>): Prisma.PrismaPromise<GetBookPageAggregateType<T>>

    /**
     * Group by BookPage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookPageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookPageGroupByArgs['orderBy'] }
        : { orderBy?: BookPageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookPageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookPageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookPage model
   */
  readonly fields: BookPageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookPage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookPageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    book<T extends BookDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookDefaultArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BookPage model
   */
  interface BookPageFieldRefs {
    readonly id: FieldRef<"BookPage", 'String'>
    readonly bookId: FieldRef<"BookPage", 'String'>
    readonly pageNumber: FieldRef<"BookPage", 'Int'>
    readonly text: FieldRef<"BookPage", 'String'>
    readonly sceneDescription: FieldRef<"BookPage", 'String'>
    readonly imageUrl: FieldRef<"BookPage", 'String'>
    readonly imageKey: FieldRef<"BookPage", 'String'>
    readonly backgroundImageUrl: FieldRef<"BookPage", 'String'>
    readonly backgroundImageKey: FieldRef<"BookPage", 'String'>
    readonly createdAt: FieldRef<"BookPage", 'DateTime'>
    readonly updatedAt: FieldRef<"BookPage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BookPage findUnique
   */
  export type BookPageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageInclude<ExtArgs> | null
    /**
     * Filter, which BookPage to fetch.
     */
    where: BookPageWhereUniqueInput
  }

  /**
   * BookPage findUniqueOrThrow
   */
  export type BookPageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageInclude<ExtArgs> | null
    /**
     * Filter, which BookPage to fetch.
     */
    where: BookPageWhereUniqueInput
  }

  /**
   * BookPage findFirst
   */
  export type BookPageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageInclude<ExtArgs> | null
    /**
     * Filter, which BookPage to fetch.
     */
    where?: BookPageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookPages to fetch.
     */
    orderBy?: BookPageOrderByWithRelationInput | BookPageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookPages.
     */
    cursor?: BookPageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookPages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookPages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookPages.
     */
    distinct?: BookPageScalarFieldEnum | BookPageScalarFieldEnum[]
  }

  /**
   * BookPage findFirstOrThrow
   */
  export type BookPageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageInclude<ExtArgs> | null
    /**
     * Filter, which BookPage to fetch.
     */
    where?: BookPageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookPages to fetch.
     */
    orderBy?: BookPageOrderByWithRelationInput | BookPageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookPages.
     */
    cursor?: BookPageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookPages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookPages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookPages.
     */
    distinct?: BookPageScalarFieldEnum | BookPageScalarFieldEnum[]
  }

  /**
   * BookPage findMany
   */
  export type BookPageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageInclude<ExtArgs> | null
    /**
     * Filter, which BookPages to fetch.
     */
    where?: BookPageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookPages to fetch.
     */
    orderBy?: BookPageOrderByWithRelationInput | BookPageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookPages.
     */
    cursor?: BookPageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookPages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookPages.
     */
    skip?: number
    distinct?: BookPageScalarFieldEnum | BookPageScalarFieldEnum[]
  }

  /**
   * BookPage create
   */
  export type BookPageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageInclude<ExtArgs> | null
    /**
     * The data needed to create a BookPage.
     */
    data: XOR<BookPageCreateInput, BookPageUncheckedCreateInput>
  }

  /**
   * BookPage createMany
   */
  export type BookPageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookPages.
     */
    data: BookPageCreateManyInput | BookPageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookPage createManyAndReturn
   */
  export type BookPageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * The data used to create many BookPages.
     */
    data: BookPageCreateManyInput | BookPageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookPage update
   */
  export type BookPageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageInclude<ExtArgs> | null
    /**
     * The data needed to update a BookPage.
     */
    data: XOR<BookPageUpdateInput, BookPageUncheckedUpdateInput>
    /**
     * Choose, which BookPage to update.
     */
    where: BookPageWhereUniqueInput
  }

  /**
   * BookPage updateMany
   */
  export type BookPageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookPages.
     */
    data: XOR<BookPageUpdateManyMutationInput, BookPageUncheckedUpdateManyInput>
    /**
     * Filter which BookPages to update
     */
    where?: BookPageWhereInput
    /**
     * Limit how many BookPages to update.
     */
    limit?: number
  }

  /**
   * BookPage updateManyAndReturn
   */
  export type BookPageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * The data used to update BookPages.
     */
    data: XOR<BookPageUpdateManyMutationInput, BookPageUncheckedUpdateManyInput>
    /**
     * Filter which BookPages to update
     */
    where?: BookPageWhereInput
    /**
     * Limit how many BookPages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookPage upsert
   */
  export type BookPageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageInclude<ExtArgs> | null
    /**
     * The filter to search for the BookPage to update in case it exists.
     */
    where: BookPageWhereUniqueInput
    /**
     * In case the BookPage found by the `where` argument doesn't exist, create a new BookPage with this data.
     */
    create: XOR<BookPageCreateInput, BookPageUncheckedCreateInput>
    /**
     * In case the BookPage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookPageUpdateInput, BookPageUncheckedUpdateInput>
  }

  /**
   * BookPage delete
   */
  export type BookPageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageInclude<ExtArgs> | null
    /**
     * Filter which BookPage to delete.
     */
    where: BookPageWhereUniqueInput
  }

  /**
   * BookPage deleteMany
   */
  export type BookPageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookPages to delete
     */
    where?: BookPageWhereInput
    /**
     * Limit how many BookPages to delete.
     */
    limit?: number
  }

  /**
   * BookPage without action
   */
  export type BookPageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPage
     */
    select?: BookPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookPage
     */
    omit?: BookPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPageInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const GenerationJobScalarFieldEnum: {
    id: 'id',
    bookId: 'bookId',
    status: 'status',
    progress: 'progress',
    errorMessage: 'errorMessage',
    retryCount: 'retryCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    completedAt: 'completedAt'
  };

  export type GenerationJobScalarFieldEnum = (typeof GenerationJobScalarFieldEnum)[keyof typeof GenerationJobScalarFieldEnum]


  export const BookScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    childInputId: 'childInputId',
    genreId: 'genreId',
    title: 'title',
    status: 'status',
    pdfUrl: 'pdfUrl',
    illustrationStyle: 'illustrationStyle',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BookScalarFieldEnum = (typeof BookScalarFieldEnum)[keyof typeof BookScalarFieldEnum]


  export const ChildInputScalarFieldEnum: {
    id: 'id',
    name: 'name',
    age: 'age',
    gender: 'gender',
    photoUrl: 'photoUrl',
    photoKey: 'photoKey',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChildInputScalarFieldEnum = (typeof ChildInputScalarFieldEnum)[keyof typeof ChildInputScalarFieldEnum]


  export const GenreScalarFieldEnum: {
    id: 'id',
    nameUz: 'nameUz',
    nameRu: 'nameRu',
    descriptionUz: 'descriptionUz',
    descriptionRu: 'descriptionRu',
    promptTemplate: 'promptTemplate',
    iconEmoji: 'iconEmoji',
    isActive: 'isActive',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GenreScalarFieldEnum = (typeof GenreScalarFieldEnum)[keyof typeof GenreScalarFieldEnum]


  export const BookPageScalarFieldEnum: {
    id: 'id',
    bookId: 'bookId',
    pageNumber: 'pageNumber',
    text: 'text',
    sceneDescription: 'sceneDescription',
    imageUrl: 'imageUrl',
    imageKey: 'imageKey',
    backgroundImageUrl: 'backgroundImageUrl',
    backgroundImageKey: 'backgroundImageKey',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BookPageScalarFieldEnum = (typeof BookPageScalarFieldEnum)[keyof typeof BookPageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'GenerationJobStatus'
   */
  export type EnumGenerationJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GenerationJobStatus'>
    


  /**
   * Reference to a field of type 'GenerationJobStatus[]'
   */
  export type ListEnumGenerationJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GenerationJobStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'BookStatus'
   */
  export type EnumBookStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookStatus'>
    


  /**
   * Reference to a field of type 'BookStatus[]'
   */
  export type ListEnumBookStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type GenerationJobWhereInput = {
    AND?: GenerationJobWhereInput | GenerationJobWhereInput[]
    OR?: GenerationJobWhereInput[]
    NOT?: GenerationJobWhereInput | GenerationJobWhereInput[]
    id?: StringFilter<"GenerationJob"> | string
    bookId?: StringFilter<"GenerationJob"> | string
    status?: EnumGenerationJobStatusFilter<"GenerationJob"> | $Enums.GenerationJobStatus
    progress?: IntFilter<"GenerationJob"> | number
    errorMessage?: StringNullableFilter<"GenerationJob"> | string | null
    retryCount?: IntFilter<"GenerationJob"> | number
    createdAt?: DateTimeFilter<"GenerationJob"> | Date | string
    updatedAt?: DateTimeFilter<"GenerationJob"> | Date | string
    completedAt?: DateTimeNullableFilter<"GenerationJob"> | Date | string | null
    book?: XOR<BookScalarRelationFilter, BookWhereInput>
  }

  export type GenerationJobOrderByWithRelationInput = {
    id?: SortOrder
    bookId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    retryCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    book?: BookOrderByWithRelationInput
  }

  export type GenerationJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    bookId?: string
    AND?: GenerationJobWhereInput | GenerationJobWhereInput[]
    OR?: GenerationJobWhereInput[]
    NOT?: GenerationJobWhereInput | GenerationJobWhereInput[]
    status?: EnumGenerationJobStatusFilter<"GenerationJob"> | $Enums.GenerationJobStatus
    progress?: IntFilter<"GenerationJob"> | number
    errorMessage?: StringNullableFilter<"GenerationJob"> | string | null
    retryCount?: IntFilter<"GenerationJob"> | number
    createdAt?: DateTimeFilter<"GenerationJob"> | Date | string
    updatedAt?: DateTimeFilter<"GenerationJob"> | Date | string
    completedAt?: DateTimeNullableFilter<"GenerationJob"> | Date | string | null
    book?: XOR<BookScalarRelationFilter, BookWhereInput>
  }, "id" | "bookId">

  export type GenerationJobOrderByWithAggregationInput = {
    id?: SortOrder
    bookId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    retryCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: GenerationJobCountOrderByAggregateInput
    _avg?: GenerationJobAvgOrderByAggregateInput
    _max?: GenerationJobMaxOrderByAggregateInput
    _min?: GenerationJobMinOrderByAggregateInput
    _sum?: GenerationJobSumOrderByAggregateInput
  }

  export type GenerationJobScalarWhereWithAggregatesInput = {
    AND?: GenerationJobScalarWhereWithAggregatesInput | GenerationJobScalarWhereWithAggregatesInput[]
    OR?: GenerationJobScalarWhereWithAggregatesInput[]
    NOT?: GenerationJobScalarWhereWithAggregatesInput | GenerationJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GenerationJob"> | string
    bookId?: StringWithAggregatesFilter<"GenerationJob"> | string
    status?: EnumGenerationJobStatusWithAggregatesFilter<"GenerationJob"> | $Enums.GenerationJobStatus
    progress?: IntWithAggregatesFilter<"GenerationJob"> | number
    errorMessage?: StringNullableWithAggregatesFilter<"GenerationJob"> | string | null
    retryCount?: IntWithAggregatesFilter<"GenerationJob"> | number
    createdAt?: DateTimeWithAggregatesFilter<"GenerationJob"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GenerationJob"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"GenerationJob"> | Date | string | null
  }

  export type BookWhereInput = {
    AND?: BookWhereInput | BookWhereInput[]
    OR?: BookWhereInput[]
    NOT?: BookWhereInput | BookWhereInput[]
    id?: StringFilter<"Book"> | string
    userId?: StringFilter<"Book"> | string
    childInputId?: StringFilter<"Book"> | string
    genreId?: StringFilter<"Book"> | string
    title?: StringNullableFilter<"Book"> | string | null
    status?: EnumBookStatusFilter<"Book"> | $Enums.BookStatus
    pdfUrl?: StringNullableFilter<"Book"> | string | null
    illustrationStyle?: StringNullableFilter<"Book"> | string | null
    createdAt?: DateTimeFilter<"Book"> | Date | string
    updatedAt?: DateTimeFilter<"Book"> | Date | string
    childInput?: XOR<ChildInputScalarRelationFilter, ChildInputWhereInput>
    genre?: XOR<GenreScalarRelationFilter, GenreWhereInput>
    pages?: BookPageListRelationFilter
    generationJob?: XOR<GenerationJobNullableScalarRelationFilter, GenerationJobWhereInput> | null
  }

  export type BookOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    childInputId?: SortOrder
    genreId?: SortOrder
    title?: SortOrderInput | SortOrder
    status?: SortOrder
    pdfUrl?: SortOrderInput | SortOrder
    illustrationStyle?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    childInput?: ChildInputOrderByWithRelationInput
    genre?: GenreOrderByWithRelationInput
    pages?: BookPageOrderByRelationAggregateInput
    generationJob?: GenerationJobOrderByWithRelationInput
  }

  export type BookWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookWhereInput | BookWhereInput[]
    OR?: BookWhereInput[]
    NOT?: BookWhereInput | BookWhereInput[]
    userId?: StringFilter<"Book"> | string
    childInputId?: StringFilter<"Book"> | string
    genreId?: StringFilter<"Book"> | string
    title?: StringNullableFilter<"Book"> | string | null
    status?: EnumBookStatusFilter<"Book"> | $Enums.BookStatus
    pdfUrl?: StringNullableFilter<"Book"> | string | null
    illustrationStyle?: StringNullableFilter<"Book"> | string | null
    createdAt?: DateTimeFilter<"Book"> | Date | string
    updatedAt?: DateTimeFilter<"Book"> | Date | string
    childInput?: XOR<ChildInputScalarRelationFilter, ChildInputWhereInput>
    genre?: XOR<GenreScalarRelationFilter, GenreWhereInput>
    pages?: BookPageListRelationFilter
    generationJob?: XOR<GenerationJobNullableScalarRelationFilter, GenerationJobWhereInput> | null
  }, "id">

  export type BookOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    childInputId?: SortOrder
    genreId?: SortOrder
    title?: SortOrderInput | SortOrder
    status?: SortOrder
    pdfUrl?: SortOrderInput | SortOrder
    illustrationStyle?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BookCountOrderByAggregateInput
    _max?: BookMaxOrderByAggregateInput
    _min?: BookMinOrderByAggregateInput
  }

  export type BookScalarWhereWithAggregatesInput = {
    AND?: BookScalarWhereWithAggregatesInput | BookScalarWhereWithAggregatesInput[]
    OR?: BookScalarWhereWithAggregatesInput[]
    NOT?: BookScalarWhereWithAggregatesInput | BookScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Book"> | string
    userId?: StringWithAggregatesFilter<"Book"> | string
    childInputId?: StringWithAggregatesFilter<"Book"> | string
    genreId?: StringWithAggregatesFilter<"Book"> | string
    title?: StringNullableWithAggregatesFilter<"Book"> | string | null
    status?: EnumBookStatusWithAggregatesFilter<"Book"> | $Enums.BookStatus
    pdfUrl?: StringNullableWithAggregatesFilter<"Book"> | string | null
    illustrationStyle?: StringNullableWithAggregatesFilter<"Book"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Book"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Book"> | Date | string
  }

  export type ChildInputWhereInput = {
    AND?: ChildInputWhereInput | ChildInputWhereInput[]
    OR?: ChildInputWhereInput[]
    NOT?: ChildInputWhereInput | ChildInputWhereInput[]
    id?: StringFilter<"ChildInput"> | string
    name?: StringFilter<"ChildInput"> | string
    age?: IntNullableFilter<"ChildInput"> | number | null
    gender?: StringNullableFilter<"ChildInput"> | string | null
    photoUrl?: StringFilter<"ChildInput"> | string
    photoKey?: StringFilter<"ChildInput"> | string
    userId?: StringFilter<"ChildInput"> | string
    createdAt?: DateTimeFilter<"ChildInput"> | Date | string
    updatedAt?: DateTimeFilter<"ChildInput"> | Date | string
    books?: BookListRelationFilter
  }

  export type ChildInputOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    age?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    photoUrl?: SortOrder
    photoKey?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    books?: BookOrderByRelationAggregateInput
  }

  export type ChildInputWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChildInputWhereInput | ChildInputWhereInput[]
    OR?: ChildInputWhereInput[]
    NOT?: ChildInputWhereInput | ChildInputWhereInput[]
    name?: StringFilter<"ChildInput"> | string
    age?: IntNullableFilter<"ChildInput"> | number | null
    gender?: StringNullableFilter<"ChildInput"> | string | null
    photoUrl?: StringFilter<"ChildInput"> | string
    photoKey?: StringFilter<"ChildInput"> | string
    userId?: StringFilter<"ChildInput"> | string
    createdAt?: DateTimeFilter<"ChildInput"> | Date | string
    updatedAt?: DateTimeFilter<"ChildInput"> | Date | string
    books?: BookListRelationFilter
  }, "id">

  export type ChildInputOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    age?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    photoUrl?: SortOrder
    photoKey?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChildInputCountOrderByAggregateInput
    _avg?: ChildInputAvgOrderByAggregateInput
    _max?: ChildInputMaxOrderByAggregateInput
    _min?: ChildInputMinOrderByAggregateInput
    _sum?: ChildInputSumOrderByAggregateInput
  }

  export type ChildInputScalarWhereWithAggregatesInput = {
    AND?: ChildInputScalarWhereWithAggregatesInput | ChildInputScalarWhereWithAggregatesInput[]
    OR?: ChildInputScalarWhereWithAggregatesInput[]
    NOT?: ChildInputScalarWhereWithAggregatesInput | ChildInputScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChildInput"> | string
    name?: StringWithAggregatesFilter<"ChildInput"> | string
    age?: IntNullableWithAggregatesFilter<"ChildInput"> | number | null
    gender?: StringNullableWithAggregatesFilter<"ChildInput"> | string | null
    photoUrl?: StringWithAggregatesFilter<"ChildInput"> | string
    photoKey?: StringWithAggregatesFilter<"ChildInput"> | string
    userId?: StringWithAggregatesFilter<"ChildInput"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ChildInput"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChildInput"> | Date | string
  }

  export type GenreWhereInput = {
    AND?: GenreWhereInput | GenreWhereInput[]
    OR?: GenreWhereInput[]
    NOT?: GenreWhereInput | GenreWhereInput[]
    id?: StringFilter<"Genre"> | string
    nameUz?: StringFilter<"Genre"> | string
    nameRu?: StringNullableFilter<"Genre"> | string | null
    descriptionUz?: StringNullableFilter<"Genre"> | string | null
    descriptionRu?: StringNullableFilter<"Genre"> | string | null
    promptTemplate?: StringFilter<"Genre"> | string
    iconEmoji?: StringNullableFilter<"Genre"> | string | null
    isActive?: BoolFilter<"Genre"> | boolean
    sortOrder?: IntFilter<"Genre"> | number
    createdAt?: DateTimeFilter<"Genre"> | Date | string
    updatedAt?: DateTimeFilter<"Genre"> | Date | string
    books?: BookListRelationFilter
  }

  export type GenreOrderByWithRelationInput = {
    id?: SortOrder
    nameUz?: SortOrder
    nameRu?: SortOrderInput | SortOrder
    descriptionUz?: SortOrderInput | SortOrder
    descriptionRu?: SortOrderInput | SortOrder
    promptTemplate?: SortOrder
    iconEmoji?: SortOrderInput | SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    books?: BookOrderByRelationAggregateInput
  }

  export type GenreWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GenreWhereInput | GenreWhereInput[]
    OR?: GenreWhereInput[]
    NOT?: GenreWhereInput | GenreWhereInput[]
    nameUz?: StringFilter<"Genre"> | string
    nameRu?: StringNullableFilter<"Genre"> | string | null
    descriptionUz?: StringNullableFilter<"Genre"> | string | null
    descriptionRu?: StringNullableFilter<"Genre"> | string | null
    promptTemplate?: StringFilter<"Genre"> | string
    iconEmoji?: StringNullableFilter<"Genre"> | string | null
    isActive?: BoolFilter<"Genre"> | boolean
    sortOrder?: IntFilter<"Genre"> | number
    createdAt?: DateTimeFilter<"Genre"> | Date | string
    updatedAt?: DateTimeFilter<"Genre"> | Date | string
    books?: BookListRelationFilter
  }, "id">

  export type GenreOrderByWithAggregationInput = {
    id?: SortOrder
    nameUz?: SortOrder
    nameRu?: SortOrderInput | SortOrder
    descriptionUz?: SortOrderInput | SortOrder
    descriptionRu?: SortOrderInput | SortOrder
    promptTemplate?: SortOrder
    iconEmoji?: SortOrderInput | SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GenreCountOrderByAggregateInput
    _avg?: GenreAvgOrderByAggregateInput
    _max?: GenreMaxOrderByAggregateInput
    _min?: GenreMinOrderByAggregateInput
    _sum?: GenreSumOrderByAggregateInput
  }

  export type GenreScalarWhereWithAggregatesInput = {
    AND?: GenreScalarWhereWithAggregatesInput | GenreScalarWhereWithAggregatesInput[]
    OR?: GenreScalarWhereWithAggregatesInput[]
    NOT?: GenreScalarWhereWithAggregatesInput | GenreScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Genre"> | string
    nameUz?: StringWithAggregatesFilter<"Genre"> | string
    nameRu?: StringNullableWithAggregatesFilter<"Genre"> | string | null
    descriptionUz?: StringNullableWithAggregatesFilter<"Genre"> | string | null
    descriptionRu?: StringNullableWithAggregatesFilter<"Genre"> | string | null
    promptTemplate?: StringWithAggregatesFilter<"Genre"> | string
    iconEmoji?: StringNullableWithAggregatesFilter<"Genre"> | string | null
    isActive?: BoolWithAggregatesFilter<"Genre"> | boolean
    sortOrder?: IntWithAggregatesFilter<"Genre"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Genre"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Genre"> | Date | string
  }

  export type BookPageWhereInput = {
    AND?: BookPageWhereInput | BookPageWhereInput[]
    OR?: BookPageWhereInput[]
    NOT?: BookPageWhereInput | BookPageWhereInput[]
    id?: StringFilter<"BookPage"> | string
    bookId?: StringFilter<"BookPage"> | string
    pageNumber?: IntFilter<"BookPage"> | number
    text?: StringFilter<"BookPage"> | string
    sceneDescription?: StringNullableFilter<"BookPage"> | string | null
    imageUrl?: StringNullableFilter<"BookPage"> | string | null
    imageKey?: StringNullableFilter<"BookPage"> | string | null
    backgroundImageUrl?: StringNullableFilter<"BookPage"> | string | null
    backgroundImageKey?: StringNullableFilter<"BookPage"> | string | null
    createdAt?: DateTimeFilter<"BookPage"> | Date | string
    updatedAt?: DateTimeFilter<"BookPage"> | Date | string
    book?: XOR<BookScalarRelationFilter, BookWhereInput>
  }

  export type BookPageOrderByWithRelationInput = {
    id?: SortOrder
    bookId?: SortOrder
    pageNumber?: SortOrder
    text?: SortOrder
    sceneDescription?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    imageKey?: SortOrderInput | SortOrder
    backgroundImageUrl?: SortOrderInput | SortOrder
    backgroundImageKey?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    book?: BookOrderByWithRelationInput
  }

  export type BookPageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    bookId_pageNumber?: BookPageBookIdPageNumberCompoundUniqueInput
    AND?: BookPageWhereInput | BookPageWhereInput[]
    OR?: BookPageWhereInput[]
    NOT?: BookPageWhereInput | BookPageWhereInput[]
    bookId?: StringFilter<"BookPage"> | string
    pageNumber?: IntFilter<"BookPage"> | number
    text?: StringFilter<"BookPage"> | string
    sceneDescription?: StringNullableFilter<"BookPage"> | string | null
    imageUrl?: StringNullableFilter<"BookPage"> | string | null
    imageKey?: StringNullableFilter<"BookPage"> | string | null
    backgroundImageUrl?: StringNullableFilter<"BookPage"> | string | null
    backgroundImageKey?: StringNullableFilter<"BookPage"> | string | null
    createdAt?: DateTimeFilter<"BookPage"> | Date | string
    updatedAt?: DateTimeFilter<"BookPage"> | Date | string
    book?: XOR<BookScalarRelationFilter, BookWhereInput>
  }, "id" | "bookId_pageNumber">

  export type BookPageOrderByWithAggregationInput = {
    id?: SortOrder
    bookId?: SortOrder
    pageNumber?: SortOrder
    text?: SortOrder
    sceneDescription?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    imageKey?: SortOrderInput | SortOrder
    backgroundImageUrl?: SortOrderInput | SortOrder
    backgroundImageKey?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BookPageCountOrderByAggregateInput
    _avg?: BookPageAvgOrderByAggregateInput
    _max?: BookPageMaxOrderByAggregateInput
    _min?: BookPageMinOrderByAggregateInput
    _sum?: BookPageSumOrderByAggregateInput
  }

  export type BookPageScalarWhereWithAggregatesInput = {
    AND?: BookPageScalarWhereWithAggregatesInput | BookPageScalarWhereWithAggregatesInput[]
    OR?: BookPageScalarWhereWithAggregatesInput[]
    NOT?: BookPageScalarWhereWithAggregatesInput | BookPageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BookPage"> | string
    bookId?: StringWithAggregatesFilter<"BookPage"> | string
    pageNumber?: IntWithAggregatesFilter<"BookPage"> | number
    text?: StringWithAggregatesFilter<"BookPage"> | string
    sceneDescription?: StringNullableWithAggregatesFilter<"BookPage"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"BookPage"> | string | null
    imageKey?: StringNullableWithAggregatesFilter<"BookPage"> | string | null
    backgroundImageUrl?: StringNullableWithAggregatesFilter<"BookPage"> | string | null
    backgroundImageKey?: StringNullableWithAggregatesFilter<"BookPage"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BookPage"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BookPage"> | Date | string
  }

  export type GenerationJobCreateInput = {
    id?: string
    status?: $Enums.GenerationJobStatus
    progress?: number
    errorMessage?: string | null
    retryCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    book: BookCreateNestedOneWithoutGenerationJobInput
  }

  export type GenerationJobUncheckedCreateInput = {
    id?: string
    bookId: string
    status?: $Enums.GenerationJobStatus
    progress?: number
    errorMessage?: string | null
    retryCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type GenerationJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGenerationJobStatusFieldUpdateOperationsInput | $Enums.GenerationJobStatus
    progress?: IntFieldUpdateOperationsInput | number
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    book?: BookUpdateOneRequiredWithoutGenerationJobNestedInput
  }

  export type GenerationJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    status?: EnumGenerationJobStatusFieldUpdateOperationsInput | $Enums.GenerationJobStatus
    progress?: IntFieldUpdateOperationsInput | number
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GenerationJobCreateManyInput = {
    id?: string
    bookId: string
    status?: $Enums.GenerationJobStatus
    progress?: number
    errorMessage?: string | null
    retryCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type GenerationJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGenerationJobStatusFieldUpdateOperationsInput | $Enums.GenerationJobStatus
    progress?: IntFieldUpdateOperationsInput | number
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GenerationJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    status?: EnumGenerationJobStatusFieldUpdateOperationsInput | $Enums.GenerationJobStatus
    progress?: IntFieldUpdateOperationsInput | number
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BookCreateInput = {
    id?: string
    userId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    childInput: ChildInputCreateNestedOneWithoutBooksInput
    genre: GenreCreateNestedOneWithoutBooksInput
    pages?: BookPageCreateNestedManyWithoutBookInput
    generationJob?: GenerationJobCreateNestedOneWithoutBookInput
  }

  export type BookUncheckedCreateInput = {
    id?: string
    userId: string
    childInputId: string
    genreId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pages?: BookPageUncheckedCreateNestedManyWithoutBookInput
    generationJob?: GenerationJobUncheckedCreateNestedOneWithoutBookInput
  }

  export type BookUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    childInput?: ChildInputUpdateOneRequiredWithoutBooksNestedInput
    genre?: GenreUpdateOneRequiredWithoutBooksNestedInput
    pages?: BookPageUpdateManyWithoutBookNestedInput
    generationJob?: GenerationJobUpdateOneWithoutBookNestedInput
  }

  export type BookUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    childInputId?: StringFieldUpdateOperationsInput | string
    genreId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pages?: BookPageUncheckedUpdateManyWithoutBookNestedInput
    generationJob?: GenerationJobUncheckedUpdateOneWithoutBookNestedInput
  }

  export type BookCreateManyInput = {
    id?: string
    userId: string
    childInputId: string
    genreId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    childInputId?: StringFieldUpdateOperationsInput | string
    genreId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChildInputCreateInput = {
    id?: string
    name: string
    age?: number | null
    gender?: string | null
    photoUrl: string
    photoKey: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    books?: BookCreateNestedManyWithoutChildInputInput
  }

  export type ChildInputUncheckedCreateInput = {
    id?: string
    name: string
    age?: number | null
    gender?: string | null
    photoUrl: string
    photoKey: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    books?: BookUncheckedCreateNestedManyWithoutChildInputInput
  }

  export type ChildInputUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    photoKey?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    books?: BookUpdateManyWithoutChildInputNestedInput
  }

  export type ChildInputUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    photoKey?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    books?: BookUncheckedUpdateManyWithoutChildInputNestedInput
  }

  export type ChildInputCreateManyInput = {
    id?: string
    name: string
    age?: number | null
    gender?: string | null
    photoUrl: string
    photoKey: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChildInputUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    photoKey?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChildInputUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    photoKey?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenreCreateInput = {
    id?: string
    nameUz: string
    nameRu?: string | null
    descriptionUz?: string | null
    descriptionRu?: string | null
    promptTemplate: string
    iconEmoji?: string | null
    isActive?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    books?: BookCreateNestedManyWithoutGenreInput
  }

  export type GenreUncheckedCreateInput = {
    id?: string
    nameUz: string
    nameRu?: string | null
    descriptionUz?: string | null
    descriptionRu?: string | null
    promptTemplate: string
    iconEmoji?: string | null
    isActive?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    books?: BookUncheckedCreateNestedManyWithoutGenreInput
  }

  export type GenreUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameUz?: StringFieldUpdateOperationsInput | string
    nameRu?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionUz?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionRu?: NullableStringFieldUpdateOperationsInput | string | null
    promptTemplate?: StringFieldUpdateOperationsInput | string
    iconEmoji?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    books?: BookUpdateManyWithoutGenreNestedInput
  }

  export type GenreUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameUz?: StringFieldUpdateOperationsInput | string
    nameRu?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionUz?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionRu?: NullableStringFieldUpdateOperationsInput | string | null
    promptTemplate?: StringFieldUpdateOperationsInput | string
    iconEmoji?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    books?: BookUncheckedUpdateManyWithoutGenreNestedInput
  }

  export type GenreCreateManyInput = {
    id?: string
    nameUz: string
    nameRu?: string | null
    descriptionUz?: string | null
    descriptionRu?: string | null
    promptTemplate: string
    iconEmoji?: string | null
    isActive?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GenreUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameUz?: StringFieldUpdateOperationsInput | string
    nameRu?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionUz?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionRu?: NullableStringFieldUpdateOperationsInput | string | null
    promptTemplate?: StringFieldUpdateOperationsInput | string
    iconEmoji?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenreUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameUz?: StringFieldUpdateOperationsInput | string
    nameRu?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionUz?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionRu?: NullableStringFieldUpdateOperationsInput | string | null
    promptTemplate?: StringFieldUpdateOperationsInput | string
    iconEmoji?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookPageCreateInput = {
    id?: string
    pageNumber: number
    text: string
    sceneDescription?: string | null
    imageUrl?: string | null
    imageKey?: string | null
    backgroundImageUrl?: string | null
    backgroundImageKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    book: BookCreateNestedOneWithoutPagesInput
  }

  export type BookPageUncheckedCreateInput = {
    id?: string
    bookId: string
    pageNumber: number
    text: string
    sceneDescription?: string | null
    imageUrl?: string | null
    imageKey?: string | null
    backgroundImageUrl?: string | null
    backgroundImageKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookPageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pageNumber?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    sceneDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageKey?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    book?: BookUpdateOneRequiredWithoutPagesNestedInput
  }

  export type BookPageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    pageNumber?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    sceneDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageKey?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookPageCreateManyInput = {
    id?: string
    bookId: string
    pageNumber: number
    text: string
    sceneDescription?: string | null
    imageUrl?: string | null
    imageKey?: string | null
    backgroundImageUrl?: string | null
    backgroundImageKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookPageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pageNumber?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    sceneDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageKey?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookPageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookId?: StringFieldUpdateOperationsInput | string
    pageNumber?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    sceneDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageKey?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumGenerationJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GenerationJobStatus | EnumGenerationJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GenerationJobStatus[] | ListEnumGenerationJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GenerationJobStatus[] | ListEnumGenerationJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGenerationJobStatusFilter<$PrismaModel> | $Enums.GenerationJobStatus
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BookScalarRelationFilter = {
    is?: BookWhereInput
    isNot?: BookWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type GenerationJobCountOrderByAggregateInput = {
    id?: SortOrder
    bookId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    errorMessage?: SortOrder
    retryCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type GenerationJobAvgOrderByAggregateInput = {
    progress?: SortOrder
    retryCount?: SortOrder
  }

  export type GenerationJobMaxOrderByAggregateInput = {
    id?: SortOrder
    bookId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    errorMessage?: SortOrder
    retryCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type GenerationJobMinOrderByAggregateInput = {
    id?: SortOrder
    bookId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    errorMessage?: SortOrder
    retryCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type GenerationJobSumOrderByAggregateInput = {
    progress?: SortOrder
    retryCount?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumGenerationJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GenerationJobStatus | EnumGenerationJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GenerationJobStatus[] | ListEnumGenerationJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GenerationJobStatus[] | ListEnumGenerationJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGenerationJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.GenerationJobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGenerationJobStatusFilter<$PrismaModel>
    _max?: NestedEnumGenerationJobStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumBookStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookStatus | EnumBookStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookStatus[] | ListEnumBookStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookStatus[] | ListEnumBookStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookStatusFilter<$PrismaModel> | $Enums.BookStatus
  }

  export type ChildInputScalarRelationFilter = {
    is?: ChildInputWhereInput
    isNot?: ChildInputWhereInput
  }

  export type GenreScalarRelationFilter = {
    is?: GenreWhereInput
    isNot?: GenreWhereInput
  }

  export type BookPageListRelationFilter = {
    every?: BookPageWhereInput
    some?: BookPageWhereInput
    none?: BookPageWhereInput
  }

  export type GenerationJobNullableScalarRelationFilter = {
    is?: GenerationJobWhereInput | null
    isNot?: GenerationJobWhereInput | null
  }

  export type BookPageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    childInputId?: SortOrder
    genreId?: SortOrder
    title?: SortOrder
    status?: SortOrder
    pdfUrl?: SortOrder
    illustrationStyle?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    childInputId?: SortOrder
    genreId?: SortOrder
    title?: SortOrder
    status?: SortOrder
    pdfUrl?: SortOrder
    illustrationStyle?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    childInputId?: SortOrder
    genreId?: SortOrder
    title?: SortOrder
    status?: SortOrder
    pdfUrl?: SortOrder
    illustrationStyle?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumBookStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookStatus | EnumBookStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookStatus[] | ListEnumBookStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookStatus[] | ListEnumBookStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookStatusFilter<$PrismaModel>
    _max?: NestedEnumBookStatusFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BookListRelationFilter = {
    every?: BookWhereInput
    some?: BookWhereInput
    none?: BookWhereInput
  }

  export type BookOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChildInputCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    age?: SortOrder
    gender?: SortOrder
    photoUrl?: SortOrder
    photoKey?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChildInputAvgOrderByAggregateInput = {
    age?: SortOrder
  }

  export type ChildInputMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    age?: SortOrder
    gender?: SortOrder
    photoUrl?: SortOrder
    photoKey?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChildInputMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    age?: SortOrder
    gender?: SortOrder
    photoUrl?: SortOrder
    photoKey?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChildInputSumOrderByAggregateInput = {
    age?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type GenreCountOrderByAggregateInput = {
    id?: SortOrder
    nameUz?: SortOrder
    nameRu?: SortOrder
    descriptionUz?: SortOrder
    descriptionRu?: SortOrder
    promptTemplate?: SortOrder
    iconEmoji?: SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GenreAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type GenreMaxOrderByAggregateInput = {
    id?: SortOrder
    nameUz?: SortOrder
    nameRu?: SortOrder
    descriptionUz?: SortOrder
    descriptionRu?: SortOrder
    promptTemplate?: SortOrder
    iconEmoji?: SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GenreMinOrderByAggregateInput = {
    id?: SortOrder
    nameUz?: SortOrder
    nameRu?: SortOrder
    descriptionUz?: SortOrder
    descriptionRu?: SortOrder
    promptTemplate?: SortOrder
    iconEmoji?: SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GenreSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BookPageBookIdPageNumberCompoundUniqueInput = {
    bookId: string
    pageNumber: number
  }

  export type BookPageCountOrderByAggregateInput = {
    id?: SortOrder
    bookId?: SortOrder
    pageNumber?: SortOrder
    text?: SortOrder
    sceneDescription?: SortOrder
    imageUrl?: SortOrder
    imageKey?: SortOrder
    backgroundImageUrl?: SortOrder
    backgroundImageKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookPageAvgOrderByAggregateInput = {
    pageNumber?: SortOrder
  }

  export type BookPageMaxOrderByAggregateInput = {
    id?: SortOrder
    bookId?: SortOrder
    pageNumber?: SortOrder
    text?: SortOrder
    sceneDescription?: SortOrder
    imageUrl?: SortOrder
    imageKey?: SortOrder
    backgroundImageUrl?: SortOrder
    backgroundImageKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookPageMinOrderByAggregateInput = {
    id?: SortOrder
    bookId?: SortOrder
    pageNumber?: SortOrder
    text?: SortOrder
    sceneDescription?: SortOrder
    imageUrl?: SortOrder
    imageKey?: SortOrder
    backgroundImageUrl?: SortOrder
    backgroundImageKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookPageSumOrderByAggregateInput = {
    pageNumber?: SortOrder
  }

  export type BookCreateNestedOneWithoutGenerationJobInput = {
    create?: XOR<BookCreateWithoutGenerationJobInput, BookUncheckedCreateWithoutGenerationJobInput>
    connectOrCreate?: BookCreateOrConnectWithoutGenerationJobInput
    connect?: BookWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumGenerationJobStatusFieldUpdateOperationsInput = {
    set?: $Enums.GenerationJobStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BookUpdateOneRequiredWithoutGenerationJobNestedInput = {
    create?: XOR<BookCreateWithoutGenerationJobInput, BookUncheckedCreateWithoutGenerationJobInput>
    connectOrCreate?: BookCreateOrConnectWithoutGenerationJobInput
    upsert?: BookUpsertWithoutGenerationJobInput
    connect?: BookWhereUniqueInput
    update?: XOR<XOR<BookUpdateToOneWithWhereWithoutGenerationJobInput, BookUpdateWithoutGenerationJobInput>, BookUncheckedUpdateWithoutGenerationJobInput>
  }

  export type ChildInputCreateNestedOneWithoutBooksInput = {
    create?: XOR<ChildInputCreateWithoutBooksInput, ChildInputUncheckedCreateWithoutBooksInput>
    connectOrCreate?: ChildInputCreateOrConnectWithoutBooksInput
    connect?: ChildInputWhereUniqueInput
  }

  export type GenreCreateNestedOneWithoutBooksInput = {
    create?: XOR<GenreCreateWithoutBooksInput, GenreUncheckedCreateWithoutBooksInput>
    connectOrCreate?: GenreCreateOrConnectWithoutBooksInput
    connect?: GenreWhereUniqueInput
  }

  export type BookPageCreateNestedManyWithoutBookInput = {
    create?: XOR<BookPageCreateWithoutBookInput, BookPageUncheckedCreateWithoutBookInput> | BookPageCreateWithoutBookInput[] | BookPageUncheckedCreateWithoutBookInput[]
    connectOrCreate?: BookPageCreateOrConnectWithoutBookInput | BookPageCreateOrConnectWithoutBookInput[]
    createMany?: BookPageCreateManyBookInputEnvelope
    connect?: BookPageWhereUniqueInput | BookPageWhereUniqueInput[]
  }

  export type GenerationJobCreateNestedOneWithoutBookInput = {
    create?: XOR<GenerationJobCreateWithoutBookInput, GenerationJobUncheckedCreateWithoutBookInput>
    connectOrCreate?: GenerationJobCreateOrConnectWithoutBookInput
    connect?: GenerationJobWhereUniqueInput
  }

  export type BookPageUncheckedCreateNestedManyWithoutBookInput = {
    create?: XOR<BookPageCreateWithoutBookInput, BookPageUncheckedCreateWithoutBookInput> | BookPageCreateWithoutBookInput[] | BookPageUncheckedCreateWithoutBookInput[]
    connectOrCreate?: BookPageCreateOrConnectWithoutBookInput | BookPageCreateOrConnectWithoutBookInput[]
    createMany?: BookPageCreateManyBookInputEnvelope
    connect?: BookPageWhereUniqueInput | BookPageWhereUniqueInput[]
  }

  export type GenerationJobUncheckedCreateNestedOneWithoutBookInput = {
    create?: XOR<GenerationJobCreateWithoutBookInput, GenerationJobUncheckedCreateWithoutBookInput>
    connectOrCreate?: GenerationJobCreateOrConnectWithoutBookInput
    connect?: GenerationJobWhereUniqueInput
  }

  export type EnumBookStatusFieldUpdateOperationsInput = {
    set?: $Enums.BookStatus
  }

  export type ChildInputUpdateOneRequiredWithoutBooksNestedInput = {
    create?: XOR<ChildInputCreateWithoutBooksInput, ChildInputUncheckedCreateWithoutBooksInput>
    connectOrCreate?: ChildInputCreateOrConnectWithoutBooksInput
    upsert?: ChildInputUpsertWithoutBooksInput
    connect?: ChildInputWhereUniqueInput
    update?: XOR<XOR<ChildInputUpdateToOneWithWhereWithoutBooksInput, ChildInputUpdateWithoutBooksInput>, ChildInputUncheckedUpdateWithoutBooksInput>
  }

  export type GenreUpdateOneRequiredWithoutBooksNestedInput = {
    create?: XOR<GenreCreateWithoutBooksInput, GenreUncheckedCreateWithoutBooksInput>
    connectOrCreate?: GenreCreateOrConnectWithoutBooksInput
    upsert?: GenreUpsertWithoutBooksInput
    connect?: GenreWhereUniqueInput
    update?: XOR<XOR<GenreUpdateToOneWithWhereWithoutBooksInput, GenreUpdateWithoutBooksInput>, GenreUncheckedUpdateWithoutBooksInput>
  }

  export type BookPageUpdateManyWithoutBookNestedInput = {
    create?: XOR<BookPageCreateWithoutBookInput, BookPageUncheckedCreateWithoutBookInput> | BookPageCreateWithoutBookInput[] | BookPageUncheckedCreateWithoutBookInput[]
    connectOrCreate?: BookPageCreateOrConnectWithoutBookInput | BookPageCreateOrConnectWithoutBookInput[]
    upsert?: BookPageUpsertWithWhereUniqueWithoutBookInput | BookPageUpsertWithWhereUniqueWithoutBookInput[]
    createMany?: BookPageCreateManyBookInputEnvelope
    set?: BookPageWhereUniqueInput | BookPageWhereUniqueInput[]
    disconnect?: BookPageWhereUniqueInput | BookPageWhereUniqueInput[]
    delete?: BookPageWhereUniqueInput | BookPageWhereUniqueInput[]
    connect?: BookPageWhereUniqueInput | BookPageWhereUniqueInput[]
    update?: BookPageUpdateWithWhereUniqueWithoutBookInput | BookPageUpdateWithWhereUniqueWithoutBookInput[]
    updateMany?: BookPageUpdateManyWithWhereWithoutBookInput | BookPageUpdateManyWithWhereWithoutBookInput[]
    deleteMany?: BookPageScalarWhereInput | BookPageScalarWhereInput[]
  }

  export type GenerationJobUpdateOneWithoutBookNestedInput = {
    create?: XOR<GenerationJobCreateWithoutBookInput, GenerationJobUncheckedCreateWithoutBookInput>
    connectOrCreate?: GenerationJobCreateOrConnectWithoutBookInput
    upsert?: GenerationJobUpsertWithoutBookInput
    disconnect?: GenerationJobWhereInput | boolean
    delete?: GenerationJobWhereInput | boolean
    connect?: GenerationJobWhereUniqueInput
    update?: XOR<XOR<GenerationJobUpdateToOneWithWhereWithoutBookInput, GenerationJobUpdateWithoutBookInput>, GenerationJobUncheckedUpdateWithoutBookInput>
  }

  export type BookPageUncheckedUpdateManyWithoutBookNestedInput = {
    create?: XOR<BookPageCreateWithoutBookInput, BookPageUncheckedCreateWithoutBookInput> | BookPageCreateWithoutBookInput[] | BookPageUncheckedCreateWithoutBookInput[]
    connectOrCreate?: BookPageCreateOrConnectWithoutBookInput | BookPageCreateOrConnectWithoutBookInput[]
    upsert?: BookPageUpsertWithWhereUniqueWithoutBookInput | BookPageUpsertWithWhereUniqueWithoutBookInput[]
    createMany?: BookPageCreateManyBookInputEnvelope
    set?: BookPageWhereUniqueInput | BookPageWhereUniqueInput[]
    disconnect?: BookPageWhereUniqueInput | BookPageWhereUniqueInput[]
    delete?: BookPageWhereUniqueInput | BookPageWhereUniqueInput[]
    connect?: BookPageWhereUniqueInput | BookPageWhereUniqueInput[]
    update?: BookPageUpdateWithWhereUniqueWithoutBookInput | BookPageUpdateWithWhereUniqueWithoutBookInput[]
    updateMany?: BookPageUpdateManyWithWhereWithoutBookInput | BookPageUpdateManyWithWhereWithoutBookInput[]
    deleteMany?: BookPageScalarWhereInput | BookPageScalarWhereInput[]
  }

  export type GenerationJobUncheckedUpdateOneWithoutBookNestedInput = {
    create?: XOR<GenerationJobCreateWithoutBookInput, GenerationJobUncheckedCreateWithoutBookInput>
    connectOrCreate?: GenerationJobCreateOrConnectWithoutBookInput
    upsert?: GenerationJobUpsertWithoutBookInput
    disconnect?: GenerationJobWhereInput | boolean
    delete?: GenerationJobWhereInput | boolean
    connect?: GenerationJobWhereUniqueInput
    update?: XOR<XOR<GenerationJobUpdateToOneWithWhereWithoutBookInput, GenerationJobUpdateWithoutBookInput>, GenerationJobUncheckedUpdateWithoutBookInput>
  }

  export type BookCreateNestedManyWithoutChildInputInput = {
    create?: XOR<BookCreateWithoutChildInputInput, BookUncheckedCreateWithoutChildInputInput> | BookCreateWithoutChildInputInput[] | BookUncheckedCreateWithoutChildInputInput[]
    connectOrCreate?: BookCreateOrConnectWithoutChildInputInput | BookCreateOrConnectWithoutChildInputInput[]
    createMany?: BookCreateManyChildInputInputEnvelope
    connect?: BookWhereUniqueInput | BookWhereUniqueInput[]
  }

  export type BookUncheckedCreateNestedManyWithoutChildInputInput = {
    create?: XOR<BookCreateWithoutChildInputInput, BookUncheckedCreateWithoutChildInputInput> | BookCreateWithoutChildInputInput[] | BookUncheckedCreateWithoutChildInputInput[]
    connectOrCreate?: BookCreateOrConnectWithoutChildInputInput | BookCreateOrConnectWithoutChildInputInput[]
    createMany?: BookCreateManyChildInputInputEnvelope
    connect?: BookWhereUniqueInput | BookWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BookUpdateManyWithoutChildInputNestedInput = {
    create?: XOR<BookCreateWithoutChildInputInput, BookUncheckedCreateWithoutChildInputInput> | BookCreateWithoutChildInputInput[] | BookUncheckedCreateWithoutChildInputInput[]
    connectOrCreate?: BookCreateOrConnectWithoutChildInputInput | BookCreateOrConnectWithoutChildInputInput[]
    upsert?: BookUpsertWithWhereUniqueWithoutChildInputInput | BookUpsertWithWhereUniqueWithoutChildInputInput[]
    createMany?: BookCreateManyChildInputInputEnvelope
    set?: BookWhereUniqueInput | BookWhereUniqueInput[]
    disconnect?: BookWhereUniqueInput | BookWhereUniqueInput[]
    delete?: BookWhereUniqueInput | BookWhereUniqueInput[]
    connect?: BookWhereUniqueInput | BookWhereUniqueInput[]
    update?: BookUpdateWithWhereUniqueWithoutChildInputInput | BookUpdateWithWhereUniqueWithoutChildInputInput[]
    updateMany?: BookUpdateManyWithWhereWithoutChildInputInput | BookUpdateManyWithWhereWithoutChildInputInput[]
    deleteMany?: BookScalarWhereInput | BookScalarWhereInput[]
  }

  export type BookUncheckedUpdateManyWithoutChildInputNestedInput = {
    create?: XOR<BookCreateWithoutChildInputInput, BookUncheckedCreateWithoutChildInputInput> | BookCreateWithoutChildInputInput[] | BookUncheckedCreateWithoutChildInputInput[]
    connectOrCreate?: BookCreateOrConnectWithoutChildInputInput | BookCreateOrConnectWithoutChildInputInput[]
    upsert?: BookUpsertWithWhereUniqueWithoutChildInputInput | BookUpsertWithWhereUniqueWithoutChildInputInput[]
    createMany?: BookCreateManyChildInputInputEnvelope
    set?: BookWhereUniqueInput | BookWhereUniqueInput[]
    disconnect?: BookWhereUniqueInput | BookWhereUniqueInput[]
    delete?: BookWhereUniqueInput | BookWhereUniqueInput[]
    connect?: BookWhereUniqueInput | BookWhereUniqueInput[]
    update?: BookUpdateWithWhereUniqueWithoutChildInputInput | BookUpdateWithWhereUniqueWithoutChildInputInput[]
    updateMany?: BookUpdateManyWithWhereWithoutChildInputInput | BookUpdateManyWithWhereWithoutChildInputInput[]
    deleteMany?: BookScalarWhereInput | BookScalarWhereInput[]
  }

  export type BookCreateNestedManyWithoutGenreInput = {
    create?: XOR<BookCreateWithoutGenreInput, BookUncheckedCreateWithoutGenreInput> | BookCreateWithoutGenreInput[] | BookUncheckedCreateWithoutGenreInput[]
    connectOrCreate?: BookCreateOrConnectWithoutGenreInput | BookCreateOrConnectWithoutGenreInput[]
    createMany?: BookCreateManyGenreInputEnvelope
    connect?: BookWhereUniqueInput | BookWhereUniqueInput[]
  }

  export type BookUncheckedCreateNestedManyWithoutGenreInput = {
    create?: XOR<BookCreateWithoutGenreInput, BookUncheckedCreateWithoutGenreInput> | BookCreateWithoutGenreInput[] | BookUncheckedCreateWithoutGenreInput[]
    connectOrCreate?: BookCreateOrConnectWithoutGenreInput | BookCreateOrConnectWithoutGenreInput[]
    createMany?: BookCreateManyGenreInputEnvelope
    connect?: BookWhereUniqueInput | BookWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type BookUpdateManyWithoutGenreNestedInput = {
    create?: XOR<BookCreateWithoutGenreInput, BookUncheckedCreateWithoutGenreInput> | BookCreateWithoutGenreInput[] | BookUncheckedCreateWithoutGenreInput[]
    connectOrCreate?: BookCreateOrConnectWithoutGenreInput | BookCreateOrConnectWithoutGenreInput[]
    upsert?: BookUpsertWithWhereUniqueWithoutGenreInput | BookUpsertWithWhereUniqueWithoutGenreInput[]
    createMany?: BookCreateManyGenreInputEnvelope
    set?: BookWhereUniqueInput | BookWhereUniqueInput[]
    disconnect?: BookWhereUniqueInput | BookWhereUniqueInput[]
    delete?: BookWhereUniqueInput | BookWhereUniqueInput[]
    connect?: BookWhereUniqueInput | BookWhereUniqueInput[]
    update?: BookUpdateWithWhereUniqueWithoutGenreInput | BookUpdateWithWhereUniqueWithoutGenreInput[]
    updateMany?: BookUpdateManyWithWhereWithoutGenreInput | BookUpdateManyWithWhereWithoutGenreInput[]
    deleteMany?: BookScalarWhereInput | BookScalarWhereInput[]
  }

  export type BookUncheckedUpdateManyWithoutGenreNestedInput = {
    create?: XOR<BookCreateWithoutGenreInput, BookUncheckedCreateWithoutGenreInput> | BookCreateWithoutGenreInput[] | BookUncheckedCreateWithoutGenreInput[]
    connectOrCreate?: BookCreateOrConnectWithoutGenreInput | BookCreateOrConnectWithoutGenreInput[]
    upsert?: BookUpsertWithWhereUniqueWithoutGenreInput | BookUpsertWithWhereUniqueWithoutGenreInput[]
    createMany?: BookCreateManyGenreInputEnvelope
    set?: BookWhereUniqueInput | BookWhereUniqueInput[]
    disconnect?: BookWhereUniqueInput | BookWhereUniqueInput[]
    delete?: BookWhereUniqueInput | BookWhereUniqueInput[]
    connect?: BookWhereUniqueInput | BookWhereUniqueInput[]
    update?: BookUpdateWithWhereUniqueWithoutGenreInput | BookUpdateWithWhereUniqueWithoutGenreInput[]
    updateMany?: BookUpdateManyWithWhereWithoutGenreInput | BookUpdateManyWithWhereWithoutGenreInput[]
    deleteMany?: BookScalarWhereInput | BookScalarWhereInput[]
  }

  export type BookCreateNestedOneWithoutPagesInput = {
    create?: XOR<BookCreateWithoutPagesInput, BookUncheckedCreateWithoutPagesInput>
    connectOrCreate?: BookCreateOrConnectWithoutPagesInput
    connect?: BookWhereUniqueInput
  }

  export type BookUpdateOneRequiredWithoutPagesNestedInput = {
    create?: XOR<BookCreateWithoutPagesInput, BookUncheckedCreateWithoutPagesInput>
    connectOrCreate?: BookCreateOrConnectWithoutPagesInput
    upsert?: BookUpsertWithoutPagesInput
    connect?: BookWhereUniqueInput
    update?: XOR<XOR<BookUpdateToOneWithWhereWithoutPagesInput, BookUpdateWithoutPagesInput>, BookUncheckedUpdateWithoutPagesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumGenerationJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GenerationJobStatus | EnumGenerationJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GenerationJobStatus[] | ListEnumGenerationJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GenerationJobStatus[] | ListEnumGenerationJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGenerationJobStatusFilter<$PrismaModel> | $Enums.GenerationJobStatus
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumGenerationJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GenerationJobStatus | EnumGenerationJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GenerationJobStatus[] | ListEnumGenerationJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GenerationJobStatus[] | ListEnumGenerationJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGenerationJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.GenerationJobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGenerationJobStatusFilter<$PrismaModel>
    _max?: NestedEnumGenerationJobStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumBookStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookStatus | EnumBookStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookStatus[] | ListEnumBookStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookStatus[] | ListEnumBookStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookStatusFilter<$PrismaModel> | $Enums.BookStatus
  }

  export type NestedEnumBookStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookStatus | EnumBookStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookStatus[] | ListEnumBookStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookStatus[] | ListEnumBookStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookStatusFilter<$PrismaModel>
    _max?: NestedEnumBookStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BookCreateWithoutGenerationJobInput = {
    id?: string
    userId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    childInput: ChildInputCreateNestedOneWithoutBooksInput
    genre: GenreCreateNestedOneWithoutBooksInput
    pages?: BookPageCreateNestedManyWithoutBookInput
  }

  export type BookUncheckedCreateWithoutGenerationJobInput = {
    id?: string
    userId: string
    childInputId: string
    genreId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pages?: BookPageUncheckedCreateNestedManyWithoutBookInput
  }

  export type BookCreateOrConnectWithoutGenerationJobInput = {
    where: BookWhereUniqueInput
    create: XOR<BookCreateWithoutGenerationJobInput, BookUncheckedCreateWithoutGenerationJobInput>
  }

  export type BookUpsertWithoutGenerationJobInput = {
    update: XOR<BookUpdateWithoutGenerationJobInput, BookUncheckedUpdateWithoutGenerationJobInput>
    create: XOR<BookCreateWithoutGenerationJobInput, BookUncheckedCreateWithoutGenerationJobInput>
    where?: BookWhereInput
  }

  export type BookUpdateToOneWithWhereWithoutGenerationJobInput = {
    where?: BookWhereInput
    data: XOR<BookUpdateWithoutGenerationJobInput, BookUncheckedUpdateWithoutGenerationJobInput>
  }

  export type BookUpdateWithoutGenerationJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    childInput?: ChildInputUpdateOneRequiredWithoutBooksNestedInput
    genre?: GenreUpdateOneRequiredWithoutBooksNestedInput
    pages?: BookPageUpdateManyWithoutBookNestedInput
  }

  export type BookUncheckedUpdateWithoutGenerationJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    childInputId?: StringFieldUpdateOperationsInput | string
    genreId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pages?: BookPageUncheckedUpdateManyWithoutBookNestedInput
  }

  export type ChildInputCreateWithoutBooksInput = {
    id?: string
    name: string
    age?: number | null
    gender?: string | null
    photoUrl: string
    photoKey: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChildInputUncheckedCreateWithoutBooksInput = {
    id?: string
    name: string
    age?: number | null
    gender?: string | null
    photoUrl: string
    photoKey: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChildInputCreateOrConnectWithoutBooksInput = {
    where: ChildInputWhereUniqueInput
    create: XOR<ChildInputCreateWithoutBooksInput, ChildInputUncheckedCreateWithoutBooksInput>
  }

  export type GenreCreateWithoutBooksInput = {
    id?: string
    nameUz: string
    nameRu?: string | null
    descriptionUz?: string | null
    descriptionRu?: string | null
    promptTemplate: string
    iconEmoji?: string | null
    isActive?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GenreUncheckedCreateWithoutBooksInput = {
    id?: string
    nameUz: string
    nameRu?: string | null
    descriptionUz?: string | null
    descriptionRu?: string | null
    promptTemplate: string
    iconEmoji?: string | null
    isActive?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GenreCreateOrConnectWithoutBooksInput = {
    where: GenreWhereUniqueInput
    create: XOR<GenreCreateWithoutBooksInput, GenreUncheckedCreateWithoutBooksInput>
  }

  export type BookPageCreateWithoutBookInput = {
    id?: string
    pageNumber: number
    text: string
    sceneDescription?: string | null
    imageUrl?: string | null
    imageKey?: string | null
    backgroundImageUrl?: string | null
    backgroundImageKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookPageUncheckedCreateWithoutBookInput = {
    id?: string
    pageNumber: number
    text: string
    sceneDescription?: string | null
    imageUrl?: string | null
    imageKey?: string | null
    backgroundImageUrl?: string | null
    backgroundImageKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookPageCreateOrConnectWithoutBookInput = {
    where: BookPageWhereUniqueInput
    create: XOR<BookPageCreateWithoutBookInput, BookPageUncheckedCreateWithoutBookInput>
  }

  export type BookPageCreateManyBookInputEnvelope = {
    data: BookPageCreateManyBookInput | BookPageCreateManyBookInput[]
    skipDuplicates?: boolean
  }

  export type GenerationJobCreateWithoutBookInput = {
    id?: string
    status?: $Enums.GenerationJobStatus
    progress?: number
    errorMessage?: string | null
    retryCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type GenerationJobUncheckedCreateWithoutBookInput = {
    id?: string
    status?: $Enums.GenerationJobStatus
    progress?: number
    errorMessage?: string | null
    retryCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type GenerationJobCreateOrConnectWithoutBookInput = {
    where: GenerationJobWhereUniqueInput
    create: XOR<GenerationJobCreateWithoutBookInput, GenerationJobUncheckedCreateWithoutBookInput>
  }

  export type ChildInputUpsertWithoutBooksInput = {
    update: XOR<ChildInputUpdateWithoutBooksInput, ChildInputUncheckedUpdateWithoutBooksInput>
    create: XOR<ChildInputCreateWithoutBooksInput, ChildInputUncheckedCreateWithoutBooksInput>
    where?: ChildInputWhereInput
  }

  export type ChildInputUpdateToOneWithWhereWithoutBooksInput = {
    where?: ChildInputWhereInput
    data: XOR<ChildInputUpdateWithoutBooksInput, ChildInputUncheckedUpdateWithoutBooksInput>
  }

  export type ChildInputUpdateWithoutBooksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    photoKey?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChildInputUncheckedUpdateWithoutBooksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    photoKey?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenreUpsertWithoutBooksInput = {
    update: XOR<GenreUpdateWithoutBooksInput, GenreUncheckedUpdateWithoutBooksInput>
    create: XOR<GenreCreateWithoutBooksInput, GenreUncheckedCreateWithoutBooksInput>
    where?: GenreWhereInput
  }

  export type GenreUpdateToOneWithWhereWithoutBooksInput = {
    where?: GenreWhereInput
    data: XOR<GenreUpdateWithoutBooksInput, GenreUncheckedUpdateWithoutBooksInput>
  }

  export type GenreUpdateWithoutBooksInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameUz?: StringFieldUpdateOperationsInput | string
    nameRu?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionUz?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionRu?: NullableStringFieldUpdateOperationsInput | string | null
    promptTemplate?: StringFieldUpdateOperationsInput | string
    iconEmoji?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenreUncheckedUpdateWithoutBooksInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameUz?: StringFieldUpdateOperationsInput | string
    nameRu?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionUz?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionRu?: NullableStringFieldUpdateOperationsInput | string | null
    promptTemplate?: StringFieldUpdateOperationsInput | string
    iconEmoji?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookPageUpsertWithWhereUniqueWithoutBookInput = {
    where: BookPageWhereUniqueInput
    update: XOR<BookPageUpdateWithoutBookInput, BookPageUncheckedUpdateWithoutBookInput>
    create: XOR<BookPageCreateWithoutBookInput, BookPageUncheckedCreateWithoutBookInput>
  }

  export type BookPageUpdateWithWhereUniqueWithoutBookInput = {
    where: BookPageWhereUniqueInput
    data: XOR<BookPageUpdateWithoutBookInput, BookPageUncheckedUpdateWithoutBookInput>
  }

  export type BookPageUpdateManyWithWhereWithoutBookInput = {
    where: BookPageScalarWhereInput
    data: XOR<BookPageUpdateManyMutationInput, BookPageUncheckedUpdateManyWithoutBookInput>
  }

  export type BookPageScalarWhereInput = {
    AND?: BookPageScalarWhereInput | BookPageScalarWhereInput[]
    OR?: BookPageScalarWhereInput[]
    NOT?: BookPageScalarWhereInput | BookPageScalarWhereInput[]
    id?: StringFilter<"BookPage"> | string
    bookId?: StringFilter<"BookPage"> | string
    pageNumber?: IntFilter<"BookPage"> | number
    text?: StringFilter<"BookPage"> | string
    sceneDescription?: StringNullableFilter<"BookPage"> | string | null
    imageUrl?: StringNullableFilter<"BookPage"> | string | null
    imageKey?: StringNullableFilter<"BookPage"> | string | null
    backgroundImageUrl?: StringNullableFilter<"BookPage"> | string | null
    backgroundImageKey?: StringNullableFilter<"BookPage"> | string | null
    createdAt?: DateTimeFilter<"BookPage"> | Date | string
    updatedAt?: DateTimeFilter<"BookPage"> | Date | string
  }

  export type GenerationJobUpsertWithoutBookInput = {
    update: XOR<GenerationJobUpdateWithoutBookInput, GenerationJobUncheckedUpdateWithoutBookInput>
    create: XOR<GenerationJobCreateWithoutBookInput, GenerationJobUncheckedCreateWithoutBookInput>
    where?: GenerationJobWhereInput
  }

  export type GenerationJobUpdateToOneWithWhereWithoutBookInput = {
    where?: GenerationJobWhereInput
    data: XOR<GenerationJobUpdateWithoutBookInput, GenerationJobUncheckedUpdateWithoutBookInput>
  }

  export type GenerationJobUpdateWithoutBookInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGenerationJobStatusFieldUpdateOperationsInput | $Enums.GenerationJobStatus
    progress?: IntFieldUpdateOperationsInput | number
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GenerationJobUncheckedUpdateWithoutBookInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGenerationJobStatusFieldUpdateOperationsInput | $Enums.GenerationJobStatus
    progress?: IntFieldUpdateOperationsInput | number
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BookCreateWithoutChildInputInput = {
    id?: string
    userId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    genre: GenreCreateNestedOneWithoutBooksInput
    pages?: BookPageCreateNestedManyWithoutBookInput
    generationJob?: GenerationJobCreateNestedOneWithoutBookInput
  }

  export type BookUncheckedCreateWithoutChildInputInput = {
    id?: string
    userId: string
    genreId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pages?: BookPageUncheckedCreateNestedManyWithoutBookInput
    generationJob?: GenerationJobUncheckedCreateNestedOneWithoutBookInput
  }

  export type BookCreateOrConnectWithoutChildInputInput = {
    where: BookWhereUniqueInput
    create: XOR<BookCreateWithoutChildInputInput, BookUncheckedCreateWithoutChildInputInput>
  }

  export type BookCreateManyChildInputInputEnvelope = {
    data: BookCreateManyChildInputInput | BookCreateManyChildInputInput[]
    skipDuplicates?: boolean
  }

  export type BookUpsertWithWhereUniqueWithoutChildInputInput = {
    where: BookWhereUniqueInput
    update: XOR<BookUpdateWithoutChildInputInput, BookUncheckedUpdateWithoutChildInputInput>
    create: XOR<BookCreateWithoutChildInputInput, BookUncheckedCreateWithoutChildInputInput>
  }

  export type BookUpdateWithWhereUniqueWithoutChildInputInput = {
    where: BookWhereUniqueInput
    data: XOR<BookUpdateWithoutChildInputInput, BookUncheckedUpdateWithoutChildInputInput>
  }

  export type BookUpdateManyWithWhereWithoutChildInputInput = {
    where: BookScalarWhereInput
    data: XOR<BookUpdateManyMutationInput, BookUncheckedUpdateManyWithoutChildInputInput>
  }

  export type BookScalarWhereInput = {
    AND?: BookScalarWhereInput | BookScalarWhereInput[]
    OR?: BookScalarWhereInput[]
    NOT?: BookScalarWhereInput | BookScalarWhereInput[]
    id?: StringFilter<"Book"> | string
    userId?: StringFilter<"Book"> | string
    childInputId?: StringFilter<"Book"> | string
    genreId?: StringFilter<"Book"> | string
    title?: StringNullableFilter<"Book"> | string | null
    status?: EnumBookStatusFilter<"Book"> | $Enums.BookStatus
    pdfUrl?: StringNullableFilter<"Book"> | string | null
    illustrationStyle?: StringNullableFilter<"Book"> | string | null
    createdAt?: DateTimeFilter<"Book"> | Date | string
    updatedAt?: DateTimeFilter<"Book"> | Date | string
  }

  export type BookCreateWithoutGenreInput = {
    id?: string
    userId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    childInput: ChildInputCreateNestedOneWithoutBooksInput
    pages?: BookPageCreateNestedManyWithoutBookInput
    generationJob?: GenerationJobCreateNestedOneWithoutBookInput
  }

  export type BookUncheckedCreateWithoutGenreInput = {
    id?: string
    userId: string
    childInputId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pages?: BookPageUncheckedCreateNestedManyWithoutBookInput
    generationJob?: GenerationJobUncheckedCreateNestedOneWithoutBookInput
  }

  export type BookCreateOrConnectWithoutGenreInput = {
    where: BookWhereUniqueInput
    create: XOR<BookCreateWithoutGenreInput, BookUncheckedCreateWithoutGenreInput>
  }

  export type BookCreateManyGenreInputEnvelope = {
    data: BookCreateManyGenreInput | BookCreateManyGenreInput[]
    skipDuplicates?: boolean
  }

  export type BookUpsertWithWhereUniqueWithoutGenreInput = {
    where: BookWhereUniqueInput
    update: XOR<BookUpdateWithoutGenreInput, BookUncheckedUpdateWithoutGenreInput>
    create: XOR<BookCreateWithoutGenreInput, BookUncheckedCreateWithoutGenreInput>
  }

  export type BookUpdateWithWhereUniqueWithoutGenreInput = {
    where: BookWhereUniqueInput
    data: XOR<BookUpdateWithoutGenreInput, BookUncheckedUpdateWithoutGenreInput>
  }

  export type BookUpdateManyWithWhereWithoutGenreInput = {
    where: BookScalarWhereInput
    data: XOR<BookUpdateManyMutationInput, BookUncheckedUpdateManyWithoutGenreInput>
  }

  export type BookCreateWithoutPagesInput = {
    id?: string
    userId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    childInput: ChildInputCreateNestedOneWithoutBooksInput
    genre: GenreCreateNestedOneWithoutBooksInput
    generationJob?: GenerationJobCreateNestedOneWithoutBookInput
  }

  export type BookUncheckedCreateWithoutPagesInput = {
    id?: string
    userId: string
    childInputId: string
    genreId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    generationJob?: GenerationJobUncheckedCreateNestedOneWithoutBookInput
  }

  export type BookCreateOrConnectWithoutPagesInput = {
    where: BookWhereUniqueInput
    create: XOR<BookCreateWithoutPagesInput, BookUncheckedCreateWithoutPagesInput>
  }

  export type BookUpsertWithoutPagesInput = {
    update: XOR<BookUpdateWithoutPagesInput, BookUncheckedUpdateWithoutPagesInput>
    create: XOR<BookCreateWithoutPagesInput, BookUncheckedCreateWithoutPagesInput>
    where?: BookWhereInput
  }

  export type BookUpdateToOneWithWhereWithoutPagesInput = {
    where?: BookWhereInput
    data: XOR<BookUpdateWithoutPagesInput, BookUncheckedUpdateWithoutPagesInput>
  }

  export type BookUpdateWithoutPagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    childInput?: ChildInputUpdateOneRequiredWithoutBooksNestedInput
    genre?: GenreUpdateOneRequiredWithoutBooksNestedInput
    generationJob?: GenerationJobUpdateOneWithoutBookNestedInput
  }

  export type BookUncheckedUpdateWithoutPagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    childInputId?: StringFieldUpdateOperationsInput | string
    genreId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    generationJob?: GenerationJobUncheckedUpdateOneWithoutBookNestedInput
  }

  export type BookPageCreateManyBookInput = {
    id?: string
    pageNumber: number
    text: string
    sceneDescription?: string | null
    imageUrl?: string | null
    imageKey?: string | null
    backgroundImageUrl?: string | null
    backgroundImageKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookPageUpdateWithoutBookInput = {
    id?: StringFieldUpdateOperationsInput | string
    pageNumber?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    sceneDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageKey?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookPageUncheckedUpdateWithoutBookInput = {
    id?: StringFieldUpdateOperationsInput | string
    pageNumber?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    sceneDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageKey?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookPageUncheckedUpdateManyWithoutBookInput = {
    id?: StringFieldUpdateOperationsInput | string
    pageNumber?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    sceneDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageKey?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    backgroundImageKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookCreateManyChildInputInput = {
    id?: string
    userId: string
    genreId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookUpdateWithoutChildInputInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    genre?: GenreUpdateOneRequiredWithoutBooksNestedInput
    pages?: BookPageUpdateManyWithoutBookNestedInput
    generationJob?: GenerationJobUpdateOneWithoutBookNestedInput
  }

  export type BookUncheckedUpdateWithoutChildInputInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    genreId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pages?: BookPageUncheckedUpdateManyWithoutBookNestedInput
    generationJob?: GenerationJobUncheckedUpdateOneWithoutBookNestedInput
  }

  export type BookUncheckedUpdateManyWithoutChildInputInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    genreId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookCreateManyGenreInput = {
    id?: string
    userId: string
    childInputId: string
    title?: string | null
    status?: $Enums.BookStatus
    pdfUrl?: string | null
    illustrationStyle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookUpdateWithoutGenreInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    childInput?: ChildInputUpdateOneRequiredWithoutBooksNestedInput
    pages?: BookPageUpdateManyWithoutBookNestedInput
    generationJob?: GenerationJobUpdateOneWithoutBookNestedInput
  }

  export type BookUncheckedUpdateWithoutGenreInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    childInputId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pages?: BookPageUncheckedUpdateManyWithoutBookNestedInput
    generationJob?: GenerationJobUncheckedUpdateOneWithoutBookNestedInput
  }

  export type BookUncheckedUpdateManyWithoutGenreInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    childInputId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookStatusFieldUpdateOperationsInput | $Enums.BookStatus
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    illustrationStyle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
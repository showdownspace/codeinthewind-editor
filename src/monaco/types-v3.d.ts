import * as postcss from 'postcss'

type KeyValuePair<TKey extends keyof any = string, TValue = string> = Record<
  TKey,
  TValue
>;

type ConfigUtils = {
  negative<TInput, TOutput>(input: TInput): TOutput;
  breakpoints<TInput, TOutput>(input: TInput): TOutput;
};

type ConfigDotNotationPath = string;

type ResolvableTo<TResult> =
  | TResult
  | ((
      theme: (path: ConfigDotNotationPath) => TResult,
      utils: ConfigUtils
    ) => TResult);

type BaseConfig = {
  important: boolean | string;
  target: "relaxed" | "ie11";
  prefix: string | ((className: string) => string);
  separator: string;
};

type ContentConfig =
  | string[]
  | {
    files: string[];
    safelist?: Array<string | { pattern: RegExp, variants?: string[] }>;
    transform?: Record<string, (content: string) => string>;
    extract?: Record<string, (content: string) => string[]>;
  };

type FutureConfig = "all" | Record<any, never> | [];

type ExperimentalConfig =
  | "all"
  | Record<any, never>
  | [];

type DarkModeConfig =
  | false
  | "media"
  | "class";

type ThemeConfig = Partial<{
  extend: Partial<Omit<ThemeConfig, "extend">>;

  /** Responsiveness */
  screens: ResolvableTo<KeyValuePair>;

  /** Reusable base configs */
  colors: ResolvableTo<
    KeyValuePair | Record<string, Record<string | number, string>>
  >;
  spacing: ResolvableTo<KeyValuePair>;

  /** Background */
  backgroundColor: ThemeConfig["colors"];
  backgroundImage: ResolvableTo<KeyValuePair>;
  gradientColorStops: ThemeConfig["colors"];
  backgroundOpacity: ThemeConfig["opacity"];
  backgroundPosition: ResolvableTo<KeyValuePair>;
  backgroundSize: ResolvableTo<KeyValuePair>;
  backgroundOrigin: ResolvableTo<KeyValuePair>;

  /** Border */
  borderColor: ThemeConfig["colors"];
  borderOpacity: ThemeConfig["opacity"];
  borderRadius: ResolvableTo<KeyValuePair>;
  borderWidth: ResolvableTo<KeyValuePair>;

  /** Shadow */
  boxShadow: ResolvableTo<KeyValuePair>;

  /** Outline */
  outline: ResolvableTo<KeyValuePair>;

  /** Cursor */
  cursor: ResolvableTo<KeyValuePair>;

  /** Content */
  content: ResolvableTo<KeyValuePair>;

  /** Divider */
  divideColor: ThemeConfig["borderColor"];
  divideOpacity: ThemeConfig["borderOpacity"];
  devideWidth: ThemeConfig["borderWidth"];

  /** Svg */
  fill: ResolvableTo<KeyValuePair>;
  stroke: ResolvableTo<KeyValuePair>;
  strokeWidth: ResolvableTo<KeyValuePair>;

  /** Flexbox */
  flex: ResolvableTo<KeyValuePair>;
  flexGrow: ResolvableTo<KeyValuePair>;
  flexShrink: ResolvableTo<KeyValuePair>;

  /** Fonts */
  fontFamily: ResolvableTo<Record<string, string[]>>;
  fontSize: ResolvableTo<KeyValuePair>;
  fontWeight: ResolvableTo<KeyValuePair>;

  /** Sizes */
  height: ThemeConfig["spacing"];
  minHeight: ResolvableTo<KeyValuePair>;
  maxHeight: ResolvableTo<KeyValuePair>;
  width: ThemeConfig["spacing"];
  minWidth: ResolvableTo<KeyValuePair>;
  maxWidth: ResolvableTo<KeyValuePair>;
  aspectRatio: ResolvableTo<KeyValuePair>;

  /** Positioning */
  inset: ResolvableTo<KeyValuePair>;
  zIndex: ResolvableTo<KeyValuePair>;

  /** Text */
  letterSpacing: ResolvableTo<KeyValuePair>;
  lineHeight: ResolvableTo<KeyValuePair>;
  textColor: ThemeConfig["colors"];
  textOpacity: ThemeConfig["opacity"];
  textIndent: ThemeConfig["spacing"];

  /** Input */
  placeholderColor: ThemeConfig["colors"];
  placeholderOpacity: ThemeConfig["opacity"];
  caretColor: ThemeConfig["colors"];

  /** Lists */
  listStyleType: ResolvableTo<KeyValuePair>;

  /** Layout */
  margin: ThemeConfig["spacing"];
  padding: ThemeConfig["spacing"];
  space: ThemeConfig["spacing"];
  opacity: ResolvableTo<KeyValuePair>;
  order: ResolvableTo<KeyValuePair>;
  columns: ResolvableTo<KeyValuePair>;

  /** Images */
  objectPosition: ResolvableTo<KeyValuePair>;

  /** Grid */
  gap: ThemeConfig["spacing"];
  gridTemplateColumns: ResolvableTo<KeyValuePair>;
  gridColumn: ResolvableTo<KeyValuePair>;
  gridColumnStart: ResolvableTo<KeyValuePair>;
  gridColumnEnd: ResolvableTo<KeyValuePair>;
  gridTemplateRows: ResolvableTo<KeyValuePair>;
  gridRow: ResolvableTo<KeyValuePair>;
  gridRowStart: ResolvableTo<KeyValuePair>;
  gridRowEnd: ResolvableTo<KeyValuePair>;

  /** Transformations */
  transformOrigin: ResolvableTo<KeyValuePair>;
  scale: ResolvableTo<KeyValuePair>;
  rotate: ResolvableTo<KeyValuePair>;
  translate: ThemeConfig["spacing"];
  skew: ResolvableTo<KeyValuePair>;

  /** Transitions */
  transitionProperty: ResolvableTo<KeyValuePair>;
  transitionTimingFunction: ResolvableTo<KeyValuePair>;
  transitionDuration: ResolvableTo<KeyValuePair>;
  transitionDelay: ResolvableTo<KeyValuePair>;
  willChange: ResolvableTo<KeyValuePair>;

  /** Animations */
  animation: ResolvableTo<KeyValuePair>;
  keyframes: ResolvableTo<
    Record<string, Record<string, KeyValuePair | string>>
  >;

  /** Filters */
  blur: ResolvableTo<Record<string, string | string[]>>;
  brightness: ResolvableTo<Record<string, string | string[]>>;
  contrast: ResolvableTo<Record<string, string | string[]>>;
  dropShadow: ResolvableTo<Record<string, string | string[]>>;
  grayscale: ResolvableTo<Record<string, string | string[]>>;
  hueRotate: ResolvableTo<Record<string, string | string[]>>;
  invert: ResolvableTo<Record<string, string | string[]>>;
  saturate: ResolvableTo<Record<string, string | string[]>>;
  sepia: ResolvableTo<Record<string, string | string[]>>;
  backdropFilter: ResolvableTo<Record<string, string | string[]>>;
  backdropBlur: ResolvableTo<Record<string, string | string[]>>;
  backdropBrightness: ResolvableTo<Record<string, string | string[]>>;
  backdropContrast: ResolvableTo<Record<string, string | string[]>>;
  backdropGrayscale: ResolvableTo<Record<string, string | string[]>>;
  backdropHueRotate: ResolvableTo<Record<string, string | string[]>>;
  backdropInvert: ResolvableTo<Record<string, string | string[]>>;
  backdropOpacity: ResolvableTo<Record<string, string | string[]>>;
  backdropSaturate: ResolvableTo<Record<string, string | string[]>>;
  backdropSepia: ResolvableTo<Record<string, string | string[]>>;

  /** Components */
  container: Partial<{
    screens:
      | string[] /** List of breakpoints. E.g.: '400px', '500px' */
      /** Named breakpoints. E.g.: { sm: '400px' } */
      | Record<string, string>
      /** Name breakpoints with explicit min and max values. E.g.: { sm: { min: '300px', max: '400px' } } */
      | Record<string, { min: string; max: string }>;
    center: boolean;
    padding: string | KeyValuePair;
  }>;

  /** Custom */
  [key: string]: any;
}>;

type VariantsAPI = {
  variants: (path: string) => string[];
  before: (toInsert: string[], variant?: string, existingPluginVariants?: string[]) => string[];
  after: (toInsert: string[], variant?: string, existingPluginVariants?: string[]) => string[];
  without: (toRemove: string[], existingPluginVariants?: string[]) => string[];
}
type VariantsConfig =
  | string[]
  | Record<string, string[] | ((api: VariantsAPI) => string[])>
  | { extend: Record<string, string[]> };

type CorePluginsConfig = string[] | Record<string, boolean>;

type VariantConfig =
  | string[]
  | Partial<{
      variants: string[];
      respectPrefix: false;
      respectImportant: false;
    }>;
type ValueType = 'any' | 'color' | 'url' | 'image' | 'length' | 'percentage' | 'position' | 'lookup' | 'generic-name' | 'family-name' | 'number' | 'line-width' | 'absolute-size' | 'relative-size';
type VariantDefinition =
  | string
  | ((api: {
      container: postcss.Container
      separator: string
      modifySelectors: (
        modifierFunction: (api: { className: string; selector: string }) => void
      ) => void
    }) => string | null | void)
type PluginAPI = {
  /** Get access to the whole config */
  config: <TDefaultValue = TailwindConfig>(
    path?: ConfigDotNotationPath,
    defaultValue?: TDefaultValue
  ) => TDefaultValue; // TODO: Or return value at path
  /** Escape classNames */
  e: (className: string) => string;
  /** Shortcut for the theme section of the config */
  theme: <TDefaultValue>(
    path: ConfigDotNotationPath,
    defaultValue: TDefaultValue
  ) => TDefaultValue; // TODO: Or return value at path
  target: (path: ConfigDotNotationPath) => string;
  prefix: (selector: string) => string;
  /** Ability to add utilities. E.g.: .p-4 */
  addUtilities: (
    utilities: Record<string, KeyValuePair | Record<string, KeyValuePair>>,
    variantConfig?: VariantConfig
  ) => void;
  /** Ability to add components. E.g.: .btn */
  addComponents: (
    components: Record<string, KeyValuePair | Record<string, KeyValuePair>>,
    variantConfig?: VariantConfig
  ) => void;
  addBase: (
    base: Record<string, KeyValuePair | Record<string, KeyValuePair>>,
  ) => void;
  addVariant: (
    name: string,
    definition: VariantDefinition | Array<VariantDefinition>
  ) => void;
  matchUtilities: <T>(
    utilities: Record<string, (value: T) => Record>,
    options?: Partial<{
      values: Record<string, T>,
      type: ValueType | Array<ValueType>,
      respectPrefix: boolean,
      respectImportant: boolean,
      respectVariants: boolean,
    }>
  ) => void;
  corePlugins: (path: string) => boolean;
  postcss: typeof postcss;
};
export type PluginCreator = (api: PluginAPI) => void;
type PluginsConfig = (PluginCreator | { handler: PluginCreator, config?: TailwindConfig })[];

/** The holy grail Tailwind config definition */
export type TailwindConfig = Partial<
  BaseConfig & {
    presets: TailwindConfig[];
    future: FutureConfig;
    experimental: ExperimentalConfig;
    content: ContentConfig;
    darkMode: DarkModeConfig;
    theme: ThemeConfig;
    corePlugins: CorePluginsConfig;
    plugins: PluginsConfig;
    /** Custom */
    [key: string]: any;
  }
>;

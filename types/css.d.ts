// TypeScript 6 errors on side-effect imports of unknown extensions (TS2882);
// Next's bundler handles .css imports, so declare them ambiently.
declare module "*.css";

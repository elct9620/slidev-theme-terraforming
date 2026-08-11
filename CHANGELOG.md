# Changelog

## [0.7.2](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.7.1...v0.7.2) (2026-08-11)


### Bug Fixes

* **layout:** deepen the sidebar's overlap past a subpixel seam ([11a8ddf](https://github.com/elct9620/slidev-theme-terraforming/commit/11a8ddf42383a8ee02f59e8ae643a8d2008e01d9))

## [0.7.1](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.7.0...v0.7.1) (2026-08-06)


### Bug Fixes

* **layout:** let the sidebar's diagonal overlap the block it grows from ([a935b32](https://github.com/elct9620/slidev-theme-terraforming/commit/a935b324457db714da2325ffea47426dfddeaee1))

## [0.7.0](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.6.1...v0.7.0) (2026-08-06)


### ⚠ BREAKING CHANGES

* **bars:** Bars takes Bar children in place of `items`, and `steps` names a row through Bar's `name` rather than through the label it shows.
* About takes Name, Title and Contact in place of its name and title props, Caption takes Line in place of a v-switch, and Map2D takes Point in place of points.
* **layout:** --container-content and --spacing-sidebar are gone, and a deck that named either should let the page decide instead. --spacing-logo replaces them as the single measurement the sidebar is given.
* **axis:** Axis takes `start` and `end` in place of `startLabel` and `endLabel`.

### Features

* **axis:** name the ends of an axis the way every chart does ([5f97acd](https://github.com/elct9620/slidev-theme-terraforming/commit/5f97acdbb7e5005a544679733118efb5b2d8becf))
* **bars:** write a chart as the rows it is of ([f6cb501](https://github.com/elct9620/slidev-theme-terraforming/commit/f6cb5017010dd501ef3a430e4be495a867a784dc))
* write what the audience reads as children, not as props ([07c164c](https://github.com/elct9620/slidev-theme-terraforming/commit/07c164c5e6ba5ecada2d43792739e2684054ba91))


### Bug Fixes

* **bars:** let a chart say the width it spans, as the other figures do ([0dbaaec](https://github.com/elct9620/slidev-theme-terraforming/commit/0dbaaeca0905577c9361d024554af93d683e30a9))
* **code:** let a listing fade between steps like everything else ([5e53b69](https://github.com/elct9620/slidev-theme-terraforming/commit/5e53b69142be4638cdda530b9cf5f0ac9d6f2549))
* **focus:** watch the pieces a frame is drawn around, not just the stage ([028bf3b](https://github.com/elct9620/slidev-theme-terraforming/commit/028bf3b7af49a4966f3c386c9092b392bb1e8d1d))
* **layout:** let the page hand its width down instead of naming it everywhere ([92803b8](https://github.com/elct9620/slidev-theme-terraforming/commit/92803b88ba4be99b1466fd317f747c140761e8cc))
* **pkg:** publish only the files a deck loads ([f808880](https://github.com/elct9620/slidev-theme-terraforming/commit/f80888066039dfc0f7805f50c8b9b041c33092d3))

## [0.6.1](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.6.0...v0.6.1) (2026-07-25)


### Bug Fixes

* **focus:** measure a piece against the stage, not against its arrival ([b86b41e](https://github.com/elct9620/slidev-theme-terraforming/commit/b86b41e0db83ba4fa78dbf7ad047f06c4e6726b2))

## [0.6.0](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.5.0...v0.6.0) (2026-07-25)


### ⚠ BREAKING CHANGES

* the modifier classes .tf-block--*, .tf-group--column, .tf-stroke-group--y, .tf-stroke-group--flip, .tf-focus--*, .is-hidden and .is-off are replaced by data-tf-color, data-tf-column, data-tf-axis, data-tf-flip, data-tf-hidden and data-tf-off. A deck styling those classes directly needs the attribute selectors instead.

### Features

* **charts:** let Bars and Map2D declare their own clicks with steps ([537b170](https://github.com/elct9620/slidev-theme-terraforming/commit/537b17057bf2839622ed818fb10660d127b93db0))
* **focus:** let a Focus declare its own clicks with steps ([2ee55ee](https://github.com/elct9620/slidev-theme-terraforming/commit/2ee55ee73ffb54ee8bd76e01d6333567478729d7))
* give the theme a slide transition that leaves the sidebar alone ([e944959](https://github.com/elct9620/slidev-theme-terraforming/commit/e9449595c5f21a81df78f6441df785fba0e6aa5f))
* let a figure's pieces arrive in the order they are read ([a0aa5ed](https://github.com/elct9620/slidev-theme-terraforming/commit/a0aa5ede452dd2f7e6490b9c4de19f75a492268d))
* **motion:** make motion a design token instead of eight literals ([a52fd80](https://github.com/elct9620/slidev-theme-terraforming/commit/a52fd8024514e2deef88fedcb895c0b7febdb91e))
* **motion:** take the arrival's timing from a published motion scale ([4f84e2f](https://github.com/elct9620/slidev-theme-terraforming/commit/4f84e2f4c4457ece4a142c4c2345838cd9f85d37))
* **stroke:** let a stroke arrive with the pieces it connects ([8dc43c4](https://github.com/elct9620/slidev-theme-terraforming/commit/8dc43c4c0952a8d9ff3f5c622d8c470063c589cf))


### Bug Fixes

* drop the view-transition default that made v-click content flash ([ce3db25](https://github.com/elct9620/slidev-theme-terraforming/commit/ce3db2561050ba0f64f2e14a17c085de64cd02e0))
* keep component state off the class attribute so v-click works ([6cd50b7](https://github.com/elct9620/slidev-theme-terraforming/commit/6cd50b714286a8e78b99a295bab0182b6cd55beb))
* **motion:** give a fade the duration it was told to take ([b0d7a6b](https://github.com/elct9620/slidev-theme-terraforming/commit/b0d7a6b5941f5ae7d019aed365356db17da8b4f8))
* **motion:** let the focus wait for its pieces without outlasting the speaker ([f074bd0](https://github.com/elct9620/slidev-theme-terraforming/commit/f074bd0e18936f37fb72aeca720801f3ec39f732))
* **type:** state leading through tokens so copy stops overlapping ([cfacc6a](https://github.com/elct9620/slidev-theme-terraforming/commit/cfacc6aeb15196751d2088f4a16fb317eafe5823))

## [0.5.0](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.4.6...v0.5.0) (2026-07-25)


### ⚠ BREAKING CHANGES

* the canvas is 1920 wide. A deck built against the old 980 canvas needs `canvasWidth: 980` in its headmatter.

### Features

* rebuild the theme on the 1920 design canvas ([ea692c0](https://github.com/elct9620/slidev-theme-terraforming/commit/ea692c044b8756f5dcdf360c64796bd58a85ebb5))

## [0.4.6](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.4.5...v0.4.6) (2026-07-01)


### Bug Fixes

* add repository metadata for npm provenance ([a6eb43b](https://github.com/elct9620/slidev-theme-terraforming/commit/a6eb43b5db943d2f08802ea347bdf044fa58f154))

## [0.4.5](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.4.4...v0.4.5) (2026-07-01)


### Bug Fixes

* **ci:** publish to npm via OIDC trusted publishing ([d674c18](https://github.com/elct9620/slidev-theme-terraforming/commit/d674c181f0467c28040438f4592778ff9bd39695))

## [0.4.4](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.4.3...v0.4.4) (2026-07-01)


### Bug Fixes

* **layout:** keep sidebar width consistent across slides ([3df7a80](https://github.com/elct9620/slidev-theme-terraforming/commit/3df7a804ded7ce6dc7e288bba9b5489fcfe408a2))

## [0.4.3](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.4.2...v0.4.3) (2025-11-06)


### Bug Fixes

* trigger release for security updates ([b48fa2c](https://github.com/elct9620/slidev-theme-terraforming/commit/b48fa2c1caf2cf80b76d7baba64b9f8e20e9f396))

## [0.4.2](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.4.1...v0.4.2) (2025-05-22)


### Bug Fixes

* update Senobi Gothic font family name and font-face declarations ([9f716c7](https://github.com/elct9620/slidev-theme-terraforming/commit/9f716c7edff3764742c4a5577a21f5f21816563b))

## [0.4.1](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.4.0...v0.4.1) (2025-05-22)


### Miscellaneous Chores

* release 0.4.1 ([1425d08](https://github.com/elct9620/slidev-theme-terraforming/commit/1425d0886e6023be7efb3cab41f77833a4822744))

## [0.4.0](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.3.2...v0.4.0) (2025-05-22)


### Features

* add About component, avatar, and Senobi Gothic fonts ([f7c6bcf](https://github.com/elct9620/slidev-theme-terraforming/commit/f7c6bcf2ccd0196a5cf439b9fd8a89d97b96bb1d))
* add Senobi-Gothic font-face declarations to layout.css ([aa8219b](https://github.com/elct9620/slidev-theme-terraforming/commit/aa8219b44b3381bef3c1d35ce668983edf315c94))

## [0.3.2](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.3.1...v0.3.2) (2025-05-19)


### Bug Fixes

* remove LayoutHelper and simplify logo import ([f878397](https://github.com/elct9620/slidev-theme-terraforming/commit/f8783975fa88efacedac842a0a377cd0d0ae624a))

## [0.3.1](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.3.0...v0.3.1) (2025-05-19)


### Bug Fixes

* update logo import path and file extension ([bd4cbc8](https://github.com/elct9620/slidev-theme-terraforming/commit/bd4cbc86434d46c7949eb300b27a452373c4232c))

## [0.3.0](https://github.com/elct9620/slidev-theme-terraforming/compare/v0.2.0...v0.3.0) (2025-05-19)


### Features

* add resolveAssetUrl helper and update logo source path ([f2a5bba](https://github.com/elct9620/slidev-theme-terraforming/commit/f2a5bba67c4f3ff8d68455849fc29fbf4042d8e9))

Branded Bootstrap 2. This is a fork of the Twitter Bootstrap 3.X package that has been 
designed for development in the Walmart environment. It has branded colors, extended 
functionality, and patterns that are designed for applications we built in ISD. 


Documentation for this version can be found on the Walmart Wiki 
(http://wmlink/styleguide).

Version 2.2.0

New Features/Patterns
- Added a new pattern for tabs to fix the tabbar to the left, right, and bottom of the tab window. This pattern exists in Legacy/TWBS 2.x, but was removed in 3. There are a limited number of use cases for this, so we want it back in there. 
- Removed the integrated styles for DataTables.net, which were causing warnings from the linter. The styles have been re-written, and will be implemented in a patter in a future version
- Added a pattern for fixed and static footers 
Bug Fixes
- Fixed an icon style that was missing an @ prefix
- Changed the navbar-brand>img style to display:inline-block instead of block to prevent wrapping
- Merged changes from Twitter Bootstrap 3.3.0 and 3.3.1 into Branded Bootstrap
- Added a minimum height to the branded-navbar to keep it from shrinking if the nav UL is not used (simple header)

Version 2.1.3
- No changes to the library, this change adds the zip tag to jQuery in the POM file used by Nexus

Version 2.1.2
- [Sam’s Club] Changed the btn-primary to use blue-light instead of the orange/yellow. That’s now a secondary style
- Updated the btn-alternate style to use black instead of blue for text and the outline; blue is now the hover/active color for the button
- Reduced the opacity on [disabled] buttons from 65% to 50%
- Darkened the color of borders around btn-alternate and the outline 
- Fixed the caret color on btn-alternate when used on button dropdowns

Version 2.1.1
- Fixed the folder structure in bootstrap-asda and bootstrap-walmart
- Changed btn-alternate to a link style, and current btn-alternate to btn-tertiary


Version 2.1.0

- Updated the colors to be in line with the brand center and expanded brand color palettes

- Font changed from Glyphicons + FontAwesome to IcoMoon packaged fonts. 
  Aliases for glyphicons and FA have been added, and will be kept in place until 
  version 2.3 of the branded package

- Removed the date-time-picker javascript from the base package, and packaged it as an 
  additional JavaScript file. This should prevent the moment.js error from coming up 
  unless it's absolutely needed
- Removed carousel from the base JavaScript package

- Added pattern for Loading in Panels
- Added pattern for inline validation

- Styles for loading icons, and css classes for animation, brand colors, and backgrounds

- Added classes for Panel modals
- Merged changes from Bootstrap 3.1.0, 3.1.1, and 3.2.0



Note: Documentation for earlier versions can be found at http://wmlink/styleguide

Version 2.0.3
- Fixed issue with validation states on forms appearing in black instead of the correct branded colors
- Fixed the color for the Primary Button styles for ASDA 
- Updated the version of the Gylphicon font included the same as what's in Bootstrap 3.0.3. This fixes an issue with the calendar icon not displaying correctly

Version 2.0.2
- Incorporates fixed from Twitter Bootstrap 3.0.3
- Adds classes to correctly color carets used in header dropdowns, buttons, and navs
- Added 20px Padding to the logo in branded navbar

Version 2.0.1
- Incorporates fixes from Twitter Bootstrap 3.0.1 and 3.0.2
- Changes to alerts, navs, panels to match the color schema from Branded Bootstrap 1.0
- Package now includes the unminified files for use in debugging. Only minified files should be referenced to code outside of a development environment
- the bootstrap-theme.css file has been removed, as this is redundant with the branding work done in this package
- A new extension has been added to the JS and CSS styles, a date/time picker based on the bootstrap-datetimepicker library passed through the Open Source CoC

Version 2.0.0
- Initial Release of the branded libraries for Bootstrap 3.0.0
- Changes to base classes for buttons. The branded versions uses 
  the same structure as 2.3.2 with primary/secondary/alternate
- Added "navbar-branded" for use with logos. This is a slight change from 2.3.2, 
  since "navbar-brand" is now part of the structure of a standard navbar
- Added colors for data visualization

For more information on using this library, please visit http://wmlink/styleguide. For 
updates on this and future releases, please follow the Branded Bootstrap Blog, http://wmlink/bootstrap
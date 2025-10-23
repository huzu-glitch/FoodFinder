# FoodFetish UI Redesign - CSS Structure

This directory contains the organized CSS structure for the FoodFetish application redesign.

## Directory Structure

```
src/styles/
├── README.md                 # This documentation file
├── globals.css              # Global styles and Tailwind imports
├── variables.css            # CSS custom properties (color palette, spacing, etc.)
├── animations.css           # Reusable animations and keyframes
└── components/
    ├── index.css           # Component styles index file
    ├── header.css          # Header component styles
    ├── search-input.css    # Animated search input styles
    ├── recipe-card.css     # Recipe card component styles
    ├── loading.css         # Loading component styles
    └── footer.css          # Footer component styles
```

## Configuration Files

- `tailwind.config.js` - Tailwind CSS v4 configuration with custom colors and animations
- `postcss.config.js` - PostCSS configuration for Tailwind processing

## CSS Variables

The design system uses CSS custom properties defined in `variables.css`:

### Colors
- `--primary-blue: #5264AE` - Primary brand color
- `--light-blue: #3B82F6` - Secondary blue
- `--dark-gray: #323b40` - Dark backgrounds
- `--teal: #0096a1` - Accent color for social buttons

### Animation Timing
- `--transition-fast: 0.2s ease` - Quick transitions
- `--transition-medium: 0.3s ease-in-out` - Standard transitions
- `--transition-slow: 0.5s ease-in-out` - Slow transitions

### Spacing & Layout
- Responsive header padding
- Consistent card padding
- Button sizing standards

## Component Styles

Each component has its own CSS file with:
- Base styles using CSS variables
- Hover and focus states
- Responsive design considerations
- Accessibility features

## Animations

Custom animations include:
- Wave animation for search input labels
- Float animation for loading elements
- Hover effects with transforms and shadows
- Fade transitions for state changes

## Usage

Import the global styles in your main CSS file:

```css
@import './styles/globals.css';
```

Individual component styles are automatically included via the component index file.

## Tailwind Integration

The project uses Tailwind CSS v4 with:
- Custom color palette matching the design system
- Extended animation utilities
- Responsive design utilities
- Custom keyframe animations

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS custom properties support
- Prefers-reduced-motion media query support
- High contrast mode compatibility
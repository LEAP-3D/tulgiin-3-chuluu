# Design System

## Color Palette

### Light Theme

- **Primary**: #F59E0B (Orange)
- **Primary Dark**: #D97706 (Deep Orange)
- **Background**: #FFFFFF (White)
- **Surface**: #F8F8F8 (Light Gray)
- **Border**: #E5E5E5 (Border Gray)
- **Text Primary**: #1F1F1F (Dark)
- **Text Secondary**: #5F5F5F (Medium Gray)
- **Text Muted**: #8E8E8E (Light Gray)

### Dark Theme

- **Primary**: #FBBF24 (Light Orange)
- **Background**: #0F172A (Near Black)
- **Surface**: #1E293B (Dark Slate)
- **Text Primary**: #F1F5F9 (Off White)
- **Text Secondary**: #CBD5E1 (Light Slate)

### Status Colors

- **Success**: #10B981 (Green) ✓
- **Error**: #EF4444 (Red) ✗
- **Warning**: #F59E0B (Orange) ⚠️
- **Info**: #3B82F6 (Blue) ⓘ

## Typography

### Font Sizes

- **h1**: 20px, Bold (700)
- **h2**: 18px, Bold (700)
- **h3**: 16px, Semi-bold (600)
- **body**: 14px, Regular (400)
- **body-md**: 14px, Medium (500)
- **body-sm**: 12px, Regular (400)
- **caption**: 11px, Regular (400)

## Spacing (8px Grid)

- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 20px
- **xxl**: 24px

## Border Radius

- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **full**: 9999px

## Components

### Buttons

- Height: 40px (minimum 44px for touch targets)
- Border Radius: 12px
- Padding: 16px horizontal

### Cards

- Border Radius: 16px
- Padding: 16px
- Shadow: elevation 2-4

### Input Fields

- Height: 44px
- Border Radius: 12px
- Padding: 12px
- Border: 1px #E5E5E5

## Shadows

- **sm**: elevation 2
- **md**: elevation 4
- **lg**: elevation 8

## Animations

- **Standard**: 300ms ease-out
- **Quick**: 150ms ease-out
- **Slow**: 500ms ease-out
- **Easing**: ease-out or ease-in-out

## Dark Mode

Automatically activated based on system preference.
Can be overridden in app settings.

Use `useTheme()` to access current theme.

## Usage

```tsx
import { useTheme } from "@/lib/theme-context";

const MyComponent = () => {
  const { theme, isDark } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text.primary }}>Content</Text>
    </View>
  );
};
```

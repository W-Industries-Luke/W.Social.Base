# Text Overflow Tooltip Directive

The `TextOverflowTooltipDirective` automatically displays a MatTooltip whenever text content overflows its container element. It handles all necessary CSS setup and provides configurable width constraints.

## Features

- ✅ Automatic overflow detection using DOM measurements
- ✅ Dynamic tooltip showing/hiding based on content overflow
- ✅ Automatic CSS setup (overflow: hidden, white-space: nowrap, text-overflow: ellipsis)
- ✅ Configurable width and max-width via `@Input()` properties
- ✅ Real-time content and size change detection
- ✅ Full MatTooltip integration with customizable options
- ✅ Standalone directive - no module imports required

## Usage

### Basic Usage

```html
<div wTextOverflowTooltip>
  Long text content that might overflow
</div>
```

### With Width Constraints

```html
<!-- Fixed width -->
<div wTextOverflowTooltip width="200px">
  Long text content
</div>

<!-- Max width -->
<div wTextOverflowTooltip maxWidth="300px">
  Long text content
</div>

<!-- Both width and max-width -->
<div wTextOverflowTooltip width="400px" maxWidth="300px">
  Long text content (will use 300px max-width)
</div>
```

### With MatTooltip Options

```html
<div 
  wTextOverflowTooltip 
  width="200px"
  matTooltipPosition="above"
  matTooltipShowDelay="500"
  matTooltipClass="custom-tooltip">
  Long text content
</div>
```

## Available Inputs

| Input | Type | Description |
|-------|------|-------------|
| `width` | `string?` | Sets the CSS width of the element (e.g., '200px', '50%') |
| `maxWidth` | `string?` | Sets the CSS max-width of the element (e.g., '300px', '80%') |

## MatTooltip Integration

The directive uses Angular Material's `MatTooltip` via `hostDirectives`, so you can use any MatTooltip input:

- `matTooltipPosition` - Tooltip position (above, below, left, right)
- `matTooltipClass` - Custom CSS class for the tooltip
- `matTooltipShowDelay` - Delay before showing tooltip (milliseconds)
- `matTooltipHideDelay` - Delay before hiding tooltip (milliseconds)

## Import

```typescript
import { TextOverflowTooltipDirective } from 'w-social-base';

@Component({
  standalone: true,
  imports: [TextOverflowTooltipDirective],
  // ...
})
export class MyComponent { }
```

## How It Works

1. **CSS Setup**: Automatically applies `overflow: hidden`, `white-space: nowrap`, and `text-overflow: ellipsis`
2. **Width Handling**: Sets width/max-width if provided, converts inline elements to inline-block
3. **Overflow Detection**: Compares `scrollWidth` vs `clientWidth` to detect overflow
4. **Dynamic Updates**: Uses `ResizeObserver` and `MutationObserver` to detect changes
5. **Tooltip Management**: Shows tooltip with full text content when overflowing, hides when not

## Browser Support

- Modern browsers with ResizeObserver and MutationObserver support
- Graceful degradation for older browsers (observers are optional)
- Requires Angular Material for tooltip functionality

## Example Output

```html
<!-- Before (long text) -->
<div wTextOverflowTooltip width="200px">
  This is a very long text that will overflow
</div>

<!-- After (rendered with overflow) -->
<div 
  wTextOverflowTooltip
  width="200px"
  style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; width: 200px;"
  matTooltip="This is a very long text that will overflow">
  This is a very long text that will overflow
</div>
```

The text will be visually truncated with "..." but the full text appears in the tooltip on hover.
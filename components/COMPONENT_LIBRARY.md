# Component Library

Organized and reusable React Native components.

## Structure

```
components/
├── ui/              # Base UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── BottomSheet.tsx
├── Skeleton.tsx     # Loading states
├── EmptyState.tsx   # Empty state UI
├── ToastContainer.tsx
├── EnhancedTimeline.tsx
├── OrderMap.tsx
└── index.ts         # Central exports
```

## Available Components

### Loading

- `<Skeleton />` - Generic skeleton loader
- `<OrderCardSkeleton />` - Order card skeleton
- `<OrderListSkeleton />` - List of skeletons
- `<OrderDetailSkeleton />` - Detail view skeleton

### Feedback

- `<EmptyState type="orders" />` - Empty state display
- `<ToastContainer />` - Toast notifications
- Toast via `useToast()` hook

### Display

- `<EnhancedTimeline order={order} />` - Status timeline
- `<OrderMap lat={} lng={} address={} />` - Location map

### Modals

- `<BottomSheet isVisible={} onClose={} />` - Bottom sheet modal

## Usage

```tsx
import {
  Skeleton,
  EmptyState,
  EnhancedTimeline,
  OrderMap,
  BottomSheet,
} from "@/components";
import { useToast } from "@/lib/toast-context";
```

## Customization

All components support style prop for overrides.
Refer to individual component files for full prop documentation.

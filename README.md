# Operation Ofer - Angular ECharts Axis Positioning

An Angular 11.1.1 application showcasing Apache ECharts drag-and-drop positioning with real-time coordinate tracking on X/Y axes.

## Features

- **Drag & Drop Interface**: Drag items from a data table onto the positioning canvas
- **Real-Time Coordinate Tracking**: See exact X/Y positions as you drag
- **Visual Grid**: ECharts grid lines for precise positioning
- **Axis Configuration**: Customizable X/Y axis ranges (0-10 by default)
- **Item Management**: Add, view, and remove positioned items
- **Dark Theme**: Modern dark interface with responsive design

## Prerequisites

- Node.js 12.x or higher
- npm 6.x or higher
- Angular CLI 11.1.1

## Installation

```bash
cd operation-ofer
npm install
```

## Development Server

```bash
ng serve
# or
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

## Build

```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## Key Components

### AxisPositioningComponent

- **File**: `src/app/axis-positioning/axis-positioning.component.ts`
- **Purpose**: Main component handling drag-drop positioning
- **Features**:
  - Configurable axis ranges
  - Real-time position updates
  - Item tracking and management
  - ECharts integration via ngx-echarts

## Technologies Used

- **Angular**: 11.1.1
- **ECharts**: 5.0.0+ (via ngx-echarts)
- **TypeScript**: 4.0.2
- **SCSS**: For styling

## Project Structure

```
operation-ofer/
├── src/
│   ├── app/
│   │   ├── axis-positioning/
│   │   │   ├── axis-positioning.component.ts
│   │   │   ├── axis-positioning.component.html
│   │   │   └── axis-positioning.component.scss
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.module.ts
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

1. **Start Development Server**: `npm start`
2. **Drag Items**: Click and drag items from the left table
3. **Position on Axis**: Drag into the chart area and position exactly where needed
4. **Drop**: Release to place the item at the current coordinates
5. **View Results**: See all placed items with their exact coordinates in the "Placed Items" section
6. **Remove Items**: Click "Remove" button to delete any placed item

## Customization

### Change Axis Ranges

Edit `axis-positioning.component.ts`:

```typescript
CONFIG = {
  xMin: 0,
  xMax: 10,  // Change max X value
  yMin: 0,
  yMax: 10,  // Change max Y value
  gridSize: 1
};
```

### Modify Sample Data

Edit `axis-positioning.component.ts` dataItems array:

```typescript
dataItems: DataItem[] = [
  { value: 45, label: 'Custom Name' },
  // Add more items...
];
```

## Performance Notes

- Uses ngx-echarts wrapper for efficient ECharts integration
- Lazy-loads ECharts library on module import
- Real-time position updates with minimal DOM manipulation

## Future Enhancements

- Add Z-axis for 3D positioning
- Grid snapping for precise alignment
- Keyboard input for coordinate entry
- Export positioned items to JSON/CSV
- Undo/Redo functionality
- Custom shape support beyond rectangles

## License

MIT

## Support

For issues or feature requests, please check the Angular and ECharts documentation:
- [Angular Documentation](https://angular.io/docs)
- [ngx-echarts](https://github.com/xieziyu/ngx-echarts)
- [Apache ECharts](https://echarts.apache.org/)

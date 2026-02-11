import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as echarts from 'echarts';

interface PlacedItem {
  id: number;
  name: string;
  size: number;        // How much length it takes on X axis
  x: number;           // Start position on X axis
  y: number;           // Position on Y axis
  x2: number;          // End position (x + size)
}

@Component({
  selector: 'app-dual-axis-positioning',
  templateUrl: './dual-axis-positioning.component.html',
  styleUrls: ['./dual-axis-positioning.component.scss']
})
export class DualAxisPositioningComponent implements OnInit, AfterViewInit {
  @ViewChild('chart1') chart1Ref: any;
  @ViewChild('chart2') chart2Ref: any;

  // Configuration for both charts
  CONFIG = {
    xMin: 0,
    xMax: 10,
    yMin: 0,
    yMax: 10,
    gridSize: 1
  };

  // Chart 1 (Canvas A)
  chartOptions1: any;
  placedItems1: PlacedItem[] = [];
  draggedItem1: PlacedItem | null = null;
  chart1Instance: any = null;
  chart1Container: any = null;
  
  // Chart 2 (Canvas B)
  chartOptions2: any;
  placedItems2: PlacedItem[] = [];
  draggedItem2: PlacedItem | null = null;
  chart2Instance: any = null;
  chart2Container: any = null;
  
  // Chart dragging state
  chartDraggingItem1: PlacedItem | null = null;
  chartDraggingItem2: PlacedItem | null = null;
  isDraggingChart1: boolean = false;
  isDraggingChart2: boolean = false;

  // Sample items to add to charts
  availableItems = [
    { name: 'Cube A', size: 2.0 },
    { name: 'Block B', size: 1.5 },
    { name: 'Shape C', size: 2.5 },
    { name: 'Object D', size: 1.0 },
    { name: 'Element E', size: 3.0 },
    { name: 'Module F', size: 1.8 }
  ];

  constructor() {
    this.initializeCharts();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Set up chart references and mouse event listeners
    setTimeout(() => {
      this.setupChartMouseListeners();
    }, 500);
  }

  initializeCharts(): void {
    const baseChartOptions = {
      title: {
        textStyle: { color: '#bfdbfe' }
      },
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        type: 'value',
        min: this.CONFIG.xMin,
        max: this.CONFIG.xMax,
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        axisLine: { lineStyle: { color: '#475569', width: 2 } },
        splitLine: {
          show: true,
          lineStyle: { color: '#334155', type: 'dashed' }
        },
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        min: this.CONFIG.yMin,
        max: this.CONFIG.yMax,
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        axisLine: { lineStyle: { color: '#475569', width: 2 } },
        splitLine: {
          show: true,
          lineStyle: { color: '#334155', type: 'dashed' }
        },
        boundaryGap: false
      },
      series: [
        {
          data: [],
          type: 'scatter',
          symbol: 'rect',
          symbolSize: [20, 20],
          itemStyle: { color: 'rgba(96, 165, 250, 0.7)' },
          label: {
            show: true,
            position: 'right',
            color: '#60a5fa',
            fontSize: 10,
            formatter: (params: any) => params.name || ''
          }
        }
      ],
      grid: { left: 50, right: 50, bottom: 50, top: 40 },
      backgroundColor: 'transparent'
    };

    // Chart 1 - Blue theme
    this.chartOptions1 = {
      ...baseChartOptions,
      title: { text: 'Canvas A (Blue)', textStyle: { color: '#60a5fa' } },
      series: [{
        ...baseChartOptions.series[0],
        itemStyle: { color: 'rgba(59, 130, 246, 0.8)' },
        label: { ...baseChartOptions.series[0].label, color: '#3b82f6' }
      }]
    };

    // Chart 2 - Purple theme
    this.chartOptions2 = {
      ...baseChartOptions,
      title: { text: 'Canvas B (Purple)', textStyle: { color: '#d946ef' } },
      series: [{
        ...baseChartOptions.series[0],
        itemStyle: { color: 'rgba(217, 70, 239, 0.8)' },
        label: { ...baseChartOptions.series[0].label, color: '#d946ef' }
      }]
    };
  }

  // ============ ADD ITEM TO CHART ============
  addItemToChart1(itemTemplate: any): void {
    const newItem: PlacedItem = {
      id: Date.now() + Math.random(),
      name: itemTemplate.name,
      size: itemTemplate.size,
      x: 2.0,
      y: 5.0,
      x2: 0
    };
    newItem.x2 = newItem.x + newItem.size;
    this.placedItems1.push(newItem);
    this.updateChart1();
  }

  addItemToChart2(itemTemplate: any): void {
    const newItem: PlacedItem = {
      id: Date.now() + Math.random(),
      name: itemTemplate.name,
      size: itemTemplate.size,
      x: 2.0,
      y: 5.0,
      x2: 0
    };
    newItem.x2 = newItem.x + newItem.size;
    this.placedItems2.push(newItem);
    this.updateChart2();
  }

  // ============ CHART 1 DRAG & DROP ============
  onDragStartItem1(event: DragEvent, item: PlacedItem): void {
    this.draggedItem1 = item;
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/plain', item.id.toString());
  }

  onDragOverChart1(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDropChart1(event: DragEvent): void {
    event.preventDefault();
    
    if (!this.draggedItem1) return;

    const container = (event.target as any).closest('.chart-container');
    if (!container) return;

    // Calculate new position based on drop
    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * (this.CONFIG.xMax - this.CONFIG.xMin);
    const y = ((rect.height - (event.clientY - rect.top)) / rect.height) * (this.CONFIG.yMax - this.CONFIG.yMin);

    // Update the item position
    this.draggedItem1.x = Math.max(this.CONFIG.xMin, Math.min(this.CONFIG.xMax - this.draggedItem1.size, parseFloat(x.toFixed(2))));
    this.draggedItem1.y = Math.max(this.CONFIG.yMin, Math.min(this.CONFIG.yMax, parseFloat(y.toFixed(2))));
    this.draggedItem1.x2 = this.draggedItem1.x + this.draggedItem1.size;

    this.updateChart1();
    this.draggedItem1 = null;
  }

  updateChart1(): void {
    const scatterData = this.placedItems1.map(item => ({
      value: [item.x, item.y],
      name: item.name,
      itemStyle: {
        color: 'rgba(59, 130, 246, 0.9)'
      }
    }));

    this.chartOptions1 = {
      ...this.chartOptions1,
      series: [
        {
          ...this.chartOptions1.series[0],
          data: scatterData
        }
      ]
    };
  }

  // ============ CHART 2 DRAG & DROP ============
  onDragStartItem2(event: DragEvent, item: PlacedItem): void {
    this.draggedItem2 = item;
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/plain', item.id.toString());
  }

  onDragOverChart2(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDropChart2(event: DragEvent): void {
    event.preventDefault();
    
    if (!this.draggedItem2) return;

    const container = (event.target as any).closest('.chart-container');
    if (!container) return;

    // Calculate new position based on drop
    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * (this.CONFIG.xMax - this.CONFIG.xMin);
    const y = ((rect.height - (event.clientY - rect.top)) / rect.height) * (this.CONFIG.yMax - this.CONFIG.yMin);

    // Update the item position
    this.draggedItem2.x = Math.max(this.CONFIG.xMin, Math.min(this.CONFIG.xMax - this.draggedItem2.size, parseFloat(x.toFixed(2))));
    this.draggedItem2.y = Math.max(this.CONFIG.yMin, Math.min(this.CONFIG.yMax, parseFloat(y.toFixed(2))));
    this.draggedItem2.x2 = this.draggedItem2.x + this.draggedItem2.size;

    this.updateChart2();
    this.draggedItem2 = null;
  }

  updateChart2(): void {
    const scatterData = this.placedItems2.map(item => ({
      value: [item.x, item.y],
      name: item.name,
      itemStyle: {
        color: 'rgba(217, 70, 239, 0.9)'
      }
    }));

    this.chartOptions2 = {
      ...this.chartOptions2,
      series: [
        {
          ...this.chartOptions2.series[0],
          data: scatterData
        }
      ]
    };
  }

  // ============ REMOVE ITEMS ============
  removeItem1(id: number): void {
    this.placedItems1 = this.placedItems1.filter(item => item.id !== id);
    this.updateChart1();
  }

  removeItem2(id: number): void {
    this.placedItems2 = this.placedItems2.filter(item => item.id !== id);
    this.updateChart2();
  }

  // ============ CHART MOUSE EVENT LISTENERS ============
  setupChartMouseListeners(): void {
    // Get chart containers
    const chart1Container = document.querySelector('[class*="chart-container"]:nth-of-type(1)') as HTMLElement;
    const chart2Container = document.querySelector('[class*="chart-container"]:nth-of-type(2)') as HTMLElement;

    if (chart1Container) {
      this.chart1Container = chart1Container;
      chart1Container.addEventListener('mousedown', (e) => this.onChart1MouseDown(e as MouseEvent));
      document.addEventListener('mousemove', (e) => this.onChart1MouseMove(e as MouseEvent));
      document.addEventListener('mouseup', (e) => this.onChart1MouseUp(e as MouseEvent));
    }

    if (chart2Container) {
      this.chart2Container = chart2Container;
      chart2Container.addEventListener('mousedown', (e) => this.onChart2MouseDown(e as MouseEvent));
      document.addEventListener('mousemove', (e) => this.onChart2MouseMove(e as MouseEvent));
      document.addEventListener('mouseup', (e) => this.onChart2MouseUp(e as MouseEvent));
    }
  }

  // ============ CHART 1 MOUSE DRAGGING ============
  onChart1MouseDown(event: MouseEvent): void {
    if (!this.chart1Container) return;
    
    const rect = this.chart1Container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * (this.CONFIG.xMax - this.CONFIG.xMin);
    const y = ((rect.height - (event.clientY - rect.top)) / rect.height) * (this.CONFIG.yMax - this.CONFIG.yMin);

    // Find which item is closest to click position
    let closestItem = null;
    let closestDistance = 0.5; // threshold

    this.placedItems1.forEach(item => {
      const distance = Math.sqrt(Math.pow(item.x - x, 2) + Math.pow(item.y - y, 2));
      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });

    if (closestItem) {
      this.isDraggingChart1 = true;
      this.chartDraggingItem1 = closestItem;
    }
  }

  onChart1MouseMove(event: MouseEvent): void {
    if (!this.isDraggingChart1 || !this.chartDraggingItem1 || !this.chart1Container) return;

    const rect = this.chart1Container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * (this.CONFIG.xMax - this.CONFIG.xMin);
    const y = ((rect.height - (event.clientY - rect.top)) / rect.height) * (this.CONFIG.yMax - this.CONFIG.yMin);

    // Update item position with boundary checking
    this.chartDraggingItem1.x = Math.max(this.CONFIG.xMin, Math.min(this.CONFIG.xMax - this.chartDraggingItem1.size, parseFloat(x.toFixed(2))));
    this.chartDraggingItem1.y = Math.max(this.CONFIG.yMin, Math.min(this.CONFIG.yMax, parseFloat(y.toFixed(2))));
    this.chartDraggingItem1.x2 = this.chartDraggingItem1.x + this.chartDraggingItem1.size;

    this.updateChart1();
  }

  onChart1MouseUp(event: MouseEvent): void {
    if (this.isDraggingChart1 && this.chartDraggingItem1) {
      this.isDraggingChart1 = false;
      this.chartDraggingItem1 = null;
      this.updateChart1();
    }
  }

  // ============ CHART 2 MOUSE DRAGGING ============
  onChart2MouseDown(event: MouseEvent): void {
    if (!this.chart2Container) return;
    
    const rect = this.chart2Container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * (this.CONFIG.xMax - this.CONFIG.xMin);
    const y = ((rect.height - (event.clientY - rect.top)) / rect.height) * (this.CONFIG.yMax - this.CONFIG.yMin);

    // Find which item is closest to click position
    let closestItem = null;
    let closestDistance = 0.5; // threshold

    this.placedItems2.forEach(item => {
      const distance = Math.sqrt(Math.pow(item.x - x, 2) + Math.pow(item.y - y, 2));
      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });

    if (closestItem) {
      this.isDraggingChart2 = true;
      this.chartDraggingItem2 = closestItem;
    }
  }

  onChart2MouseMove(event: MouseEvent): void {
    if (!this.isDraggingChart2 || !this.chartDraggingItem2 || !this.chart2Container) return;

    const rect = this.chart2Container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * (this.CONFIG.xMax - this.CONFIG.xMin);
    const y = ((rect.height - (event.clientY - rect.top)) / rect.height) * (this.CONFIG.yMax - this.CONFIG.yMin);

    // Update item position with boundary checking
    this.chartDraggingItem2.x = Math.max(this.CONFIG.xMin, Math.min(this.CONFIG.xMax - this.chartDraggingItem2.size, parseFloat(x.toFixed(2))));
    this.chartDraggingItem2.y = Math.max(this.CONFIG.yMin, Math.min(this.CONFIG.yMax, parseFloat(y.toFixed(2))));
    this.chartDraggingItem2.x2 = this.chartDraggingItem2.x + this.chartDraggingItem2.size;

    this.updateChart2();
  }

  onChart2MouseUp(event: MouseEvent): void {
    if (this.isDraggingChart2 && this.chartDraggingItem2) {
      this.isDraggingChart2 = false;
      this.chartDraggingItem2 = null;
      this.updateChart2();
    }
  }

  // ============ HELPERS ============
  getItemCoordinates(item: PlacedItem): string {
    return `X: ${item.x.toFixed(2)} → ${item.x2.toFixed(2)} | Y: ${item.y.toFixed(2)} | Size: ${item.size.toFixed(1)}`;
  }

  getTotalItems(): number {
    return this.placedItems1.length + this.placedItems2.length;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import * as echarts from 'echarts';

interface PlacedItem {
  id: number;
  name: string;
  size: number;
  x: number;
  y: number;
  x2: number;
}

interface DataItem {
  value: number;
  label: string;
}

@Component({
  selector: 'app-axis-positioning',
  templateUrl: './axis-positioning.component.html',
  styleUrls: ['./axis-positioning.component.scss']
})
export class AxisPositioningComponent implements OnInit {
  @ViewChild('chartElement') chartElement: any;

  // Configuration
  CONFIG = {
    xMin: 0,
    xMax: 10,
    yMin: 0,
    yMax: 10,
    gridSize: 1
  };

  // Data
  chartOptions: any;
  placedItems: PlacedItem[] = [];
  draggedData: any = null;
  currentMousePos = { x: null, y: null };

  // Sample data for drag table
  dataItems: DataItem[] = [
    { value: 45, label: 'Cube A' },
    { value: 72, label: 'Block B' },
    { value: 38, label: 'Shape C' },
    { value: 91, label: 'Object D' },
    { value: 62, label: 'Element E' },
    { value: 55, label: 'Module F' },
    { value: 88, label: 'Component G' },
    { value: 41, label: 'Widget H' }
  ];

  constructor() {
    this.initializeChart();
  }

  ngOnInit(): void {
  }

  initializeChart(): void {
    this.chartOptions = {
      title: {
        text: 'Axis Position Canvas',
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
  }

  onDragStart(item: DataItem): void {
    this.draggedData = {
      value: item.value,
      label: item.label,
      size: item.value / 20 // Use value as proxy for size
    };
  }

  onDragOver(event: any): void {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();

    if (!this.draggedData) return;

    // Simple calculation - in real app use ECharts convertToPixel API
    const rect = (event.target as any).getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * (this.CONFIG.xMax - this.CONFIG.xMin);
    const y = ((rect.height - (event.clientY - rect.top)) / rect.height) * (this.CONFIG.yMax - this.CONFIG.yMin);

    const placedItem: PlacedItem = {
      id: Date.now(),
      name: this.draggedData.label,
      size: this.draggedData.size,
      x: Math.max(this.CONFIG.xMin, Math.min(this.CONFIG.xMax, parseFloat(x.toFixed(2)))),
      y: Math.max(this.CONFIG.yMin, Math.min(this.CONFIG.yMax, parseFloat(y.toFixed(2)))),
      x2: 0
    };

    placedItem.x2 = placedItem.x + placedItem.size;
    this.placedItems.push(placedItem);
    this.updateChart();
  }

  updateChart(): void {
    const scatterData = this.placedItems.map(item => ({
      value: [item.x, item.y],
      name: item.name,
      itemStyle: {
        color: `hsla(${Math.random() * 360}, 70%, 50%, 0.7)`
      }
    }));

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          ...this.chartOptions.series[0],
          data: scatterData
        }
      ]
    };
  }

  removeItem(id: number): void {
    this.placedItems = this.placedItems.filter(item => item.id !== id);
    this.updateChart();
  }

  getItemCoordinates(item: PlacedItem): string {
    return `X: ${item.x.toFixed(2)} → ${item.x2.toFixed(2)} | Y: ${item.y.toFixed(2)} | Size: ${item.size.toFixed(1)}`;
  }
}

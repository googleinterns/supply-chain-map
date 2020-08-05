import { Component, OnInit, OnChanges, Input, ElementRef, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'scm-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnChanges {

    @Input() data: { name: string, value: number, valueOf: () => number }[];
    @Input() legend: { title: string, iconColor: string }[];
    hostElement; // Native element hosting the SVG container
    svg; // Top level SVG element
    g; // SVG Group element
    arc; // D3 Arc generator
    innerRadius; // Inner radius of donut chart
    radius; // Outer radius of donut chart
    slices; // Donut chart slice elements
    labels; // SVG data label elements
    rawData; // Raw chart values array
    total: number; // Total of chart values
    colorScale; // D3 color provider
    pieData: any; // Arc segment parameters for current data set
    pieDataPrevious: any; // Arc segment parameters for previous data set - used for transitions
    colors = d3.scaleOrdinal(d3.schemeCategory10);

    // Pie function - transforms raw data to arc segment parameters
    pie = d3.pie()
        .sort(null)
        .value((d: { name: string, value: number, valueOf: () => number }) => d.valueOf());

    constructor(private elRef: ElementRef) {
        this.hostElement = this.elRef.nativeElement;
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data) {
            this.createChart(changes.data.currentValue);
        }
    }

    private createChart(data: { name: string, value: number, valueOf: () => number }[]) {

        this.processPieData(data);

        this.removeExistingChartFromParent();

        this.setChartDimensions();

        this.setColorScale();

        this.addGraphicsElement();

        this.setupArcGenerator();

        this.addSlicesToTheDonut();

        this.addLabelsToTheDonut();
    }


    private setChartDimensions() {
        const viewBoxHeight = 200;
        const viewBoxWidth = 200;
        this.svg = d3.select(this.hostElement).append('svg')
            .attr('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight)
            .style('max-width', '500px')
            .style('max-height', '500px');
    }

    private addGraphicsElement() {
        this.g = this.svg.append('g')
            .attr('style', 'transform: translate(50%,50%)');
    }

    private setColorScale() {
        this.colorScale = d3.scaleOrdinal().range(['#eff7ff', '#cfe2f3', '#3d85c6', '#073763']);
        // this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    }

    private processPieData(data: { name: string, value: number, valueOf: () => number }[], initial = true) {
        this.rawData = data;
        this.total = this.rawData.reduce((sum, next) => sum + next, 0);

        this.pieData = this.pie(data);
        if (initial) {
            this.pieDataPrevious = this.pieData;
        }
    }

    private setupArcGenerator() {
        this.innerRadius = 0;
        this.radius = 100;
        this.arc = d3.arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.radius);
    }

    private addSlicesToTheDonut() {
        this.slices = this.g.selectAll('allSlices')
            .data(this.pieData)
            .enter()
            .append('path')
            .attr('d', this.arc)
            .attr('fill', (datum, index) => {
                return this.colorScale(`${index}`);
            })
            .style('opacity', 1);
    }

    // Creates an "interpolator" for animated transition for arc slices
    //   given previous and new arc shapes,
    //   generates a series of arc shapes (be)tween start and end state
    arcTween = (datum, index) => {
        const interpolation = d3.interpolate(this.pieDataPrevious[index], datum);
        this.pieDataPrevious[index] = interpolation(0);
        return (t) => {
            return this.arc(interpolation(t));
        };
    }

    // Creates an "interpolator" for animated transition for arc labels
    //   given previous and new label positions,
    //   generates a series of arc states (be)tween start and end state
    labelTween = (datum, index) => {
        const interpolation = d3.interpolate(this.pieDataPrevious[index], datum);
        this.pieDataPrevious[index] = interpolation(0);
        return (t) => {
            return 'translate(' + this.arc.centroid(interpolation(t)) + ')';
        };
    }

    public updateChart(data: { name: string, value: number, valueOf: () => number }[]) {
        if (!this.svg) {
            this.createChart(data);
            return;
        }

        this.processPieData(data, false);

        this.updateSlices();

        this.updateLabels();

    }

    private updateSlices() {
        this.slices = this.slices.data(this.pieData);
        this.slices.transition().duration(750).attrTween('d', this.arcTween);
    }

    private updateLabels() {
        this.labels.data(this.pieData);
        this.labels.each((datum, index, n) => {
            d3.select(n[index]).text(this.labelValueGetter(datum, index));
        });
        this.labels.transition().duration(750).attrTween('transform', this.labelTween);
    }

    private removeExistingChartFromParent() {
        // !!!!Caution!!!
        // Make sure not to do;
        //     d3.select('svg').remove();
        // That will clear all other SVG elements in the DOM
        d3.select(this.hostElement).select('svg').remove();
    }

    private addLabelsToTheDonut() {
        this.labels = this.g
            .selectAll('allLabels')
            .data(this.pieData)
            .enter()
            .append('text')
            .text(this.labelValueGetter)
            .attr('transform', (datum, index) => {
                return 'translate(' + this.arc.centroid(datum) + ')';
            })
            .style('font-size', '0.4rem')
            .style('text-anchor', 'middle');

    }

    private labelValueGetter = (datum, index) => {
        return `${this.data[index].value} (${Math.floor(this.data[index].value * 100 / this.total)}%)`;
    }
}

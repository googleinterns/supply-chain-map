import { Component, OnInit, OnChanges, Input, ElementRef, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'scm-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() data: { name: string, series: { name: string, value: number }[] }[];
    @Input() legend: { title: string, iconColor: string }[];
    @Input() fontSize: string;
    svg; // Top level SVG element
    colorScale;
    x;
    y;

    margin = { top: 10, right: 15, bottom: 60, left: 50 };

    barData;
    rawData;

    width = 450;
    height = 400;
    viewBoxHeight = this.height - this.margin.top - this.margin.bottom;
    viewBoxWidth = this.width - this.margin.left - this.margin.right;

    @ViewChild('container') hostElement: ElementRef<HTMLElement>;

    constructor() {
    }
    ngAfterViewInit(): void {
        this.createChart();
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data) {
            this.rawData = changes.data.currentValue;
            this.createChart();
        }
    }

    private createChart() {
        if (this.rawData && this.hostElement) {

            this.removeExistingChartFromParent();

            this.setChartDimensions();

            this.processBarData();

        }
    }


    private setChartDimensions() {
        this.svg = d3.select(this.hostElement.nativeElement).append('svg')
            .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    private processBarData(initial = true) {
        this.barData = [];
        let maxY = -1;
        for (const row of this.rawData) {
            const t = {
                name: row.name,
                total: 0
            };
            let total = 0;
            for (const innerRow of row.series) {
                t[innerRow.name] = innerRow.value;
                total += innerRow.value;
            }
            t.total = total;
            maxY = Math.max(maxY, total);
            this.barData.push(t);
        }

        const groups = this.barData.map(d => d.name);
        const subgroups = this.legend.map(l => l.title);

        this.x = d3.scaleBand()
            .domain(groups)
            .range([0, this.viewBoxWidth])
            .padding(0.2);
        this.svg.append('g')
            .attr('transform', 'translate(0,' + this.viewBoxHeight + ')')
            .call(d3.axisBottom(this.x))
            .append('text')
            .text('Supplier')
            .attr('y', 50)
            .attr('transform', (datum, index) => {
                return 'translate(' + (this.viewBoxWidth / 2) + ')';
            })
            .attr('stroke', 'black')
            .attr('fill', 'black')
            .style('text-anchor', 'middle')
            .style('font-size', this.fontSize ? this.fontSize : '0.8rem');

        // Add Y axis
        this.y = d3.scaleLinear()
            .domain([0, maxY])
            .range([this.viewBoxHeight, 0]);
        this.svg.append('g')
            .call(d3.axisLeft(this.y))
            .append('text')
            .text('Count')
            .attr('transform', 'rotate(-90)')
            .attr('x', -(this.viewBoxHeight / 2))
            .attr('y', -35)
            .attr('stroke', 'black')
            .attr('fill', 'black')
            .style('text-anchor', 'middle')
            .style('font-size', this.fontSize ? this.fontSize : '0.8rem');


        if (this.fontSize) {
            this.svg.selectAll('.tick')
                .selectAll("text")
                .style('font-size', this.fontSize);
        }

        this.colorScale = d3.scaleOrdinal().domain(subgroups).range(this.legend.map(l => l.iconColor));

        const stackedData = d3.stack()
            .keys(subgroups)
            (this.barData);

        const enter = this.svg.append('g')
            .selectAll('g')
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter().append('g')
            .attr('fill', d => this.colorScale(d.key))
            .selectAll('rect');


        // enter a second time = loop subgroup per subgroup to add all rectangles
        enter
            .data(d => d)
            .enter().append('rect')
            .attr('x', d => this.x(d.data.name))
            .attr('y', d => this.y(d[1]))
            .attr('height', d => this.y(d[0]) - this.y(d[1]))
            .attr('width', this.x.bandwidth());

        enter
            .data(d => d)
            .enter().append('text')
            .text(d => {
                const cnt = d[1] - d[0];
                const height = this.y(d[0]) - this.y(d[1]);
                if (cnt === 0 || height < 15) {
                    return '';
                }
                const pntg = Math.floor(cnt * 100 / d.data.total);
                return cnt + ' (' + pntg + '%)';
            })
            .attr('transform', (datum, index) => {
                return 'translate(' + (this.x(datum.data.name) + this.x.bandwidth() / 2) + ')';
            })
            .attr('y', d => this.y(d[1]) + ((this.y(d[0]) - this.y(d[1])) / 2))
            .style('stroke', '#000000')
            .style('fill', '#000000')
            .style('text-anchor', 'middle')
            .style('dominant-baseline', 'central')
            .style('font-size', this.fontSize ? this.fontSize : '0.8rem');
    }

    private removeExistingChartFromParent() {
        // !!!!Caution!!!
        // Make sure not to do;
        //     d3.select('svg').remove();
        // That will clear all other SVG elements in the DOM
        d3.select(this.hostElement.nativeElement).select('svg').remove();
    }
}

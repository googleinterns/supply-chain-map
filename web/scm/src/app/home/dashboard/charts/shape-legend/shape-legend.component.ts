import { Component, Input } from '@angular/core';

@Component({
    selector: 'scm-shape-legend',
    templateUrl: './shape-legend.component.html',
    styleUrls: ['./shape-legend.component.scss']
})
export class ShapeLegendComponent {
    @Input() data: { title: string, iconColor: string }[];
}

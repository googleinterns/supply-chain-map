import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'scm-line',
  templateUrl: './line.component.html'
})
export class LineComponent implements OnInit {
  @Input()
  route: {
    to: {
      lat: number,
      long: number,
    },
    from: {
      lat: number,
      long: number
    },
    color: string | undefined
  };
  infoWindowData: {
    latitude: number,
    longitude: number,
    isOpen: boolean
  };
  isMouseHovering = false;

  constructor() { }

  ngOnInit(): void {
  }

  openInfoWindow(event) {
    this.infoWindowData = {
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng(),
      isOpen: true
    };
  }
}

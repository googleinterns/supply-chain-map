import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { setDashboardHeight } from '../store/actions';
import { selectDashboardHeight } from '../store/selectors';

@Directive({
    selector: '[scmTopResizable]'
})
export class TopResizableDirective implements OnInit {

    @Input() resizableGrabHeight = 20;
    @Input() resizableMinHeight = 200;
    @Input() collapsibleMinHeight = this.resizableMinHeight / 2;

    dragging = false;

    constructor(private el: ElementRef, private store: Store) {

        function preventGlobalMouseEvents() {
            document.body.style['pointer-events'] = 'none';
        }

        function restoreGlobalMouseEvents() {
            document.body.style['pointer-events'] = 'auto';
        }


        const newHeight = (incomingHeight: number) => {
            const height = incomingHeight <= this.collapsibleMinHeight ? 0 : Math.max(this.resizableMinHeight, incomingHeight);
            store.dispatch(setDashboardHeight({ dashboardHeight: height }));
        };

        const setHeight = (height: number) => {
            if (height === 0) {
                el.nativeElement.classList.add('hide-children');
            } else {
                el.nativeElement.classList.remove('hide-children');
            }
            el.nativeElement.style.height = height === Infinity ? '100%' : (height) + 'px';
            window.dispatchEvent(new Event('resize'));
        };

        const mouseMoveG = (evt: MouseEvent) => {
            if (!this.dragging) {
                return;
            }
            newHeight(this.el.nativeElement.clientHeight
                + this.el.nativeElement.getBoundingClientRect().top
                + document.documentElement.scrollTop
                - evt.clientY);
            evt.stopPropagation();
        };


        const mouseUpG = (evt: MouseEvent) => {
            if (!this.dragging) {
                return;
            }
            restoreGlobalMouseEvents();
            this.dragging = false;
            evt.stopPropagation();
        };

        const mouseDown = (evt: MouseEvent) => {
            if (this.inDragRegion(evt)) {
                this.dragging = true;
                preventGlobalMouseEvents();
                evt.stopPropagation();
            }
        };


        const mouseMove = (evt: MouseEvent) => {
            if (this.inDragRegion(evt) || this.dragging) {
                el.nativeElement.style.cursor = 'row-resize';
            } else {
                el.nativeElement.style.cursor = 'default';
            }
        };


        document.addEventListener('mousemove', mouseMoveG, true);
        document.addEventListener('mouseup', mouseUpG, true);
        el.nativeElement.addEventListener('mousedown', mouseDown, true);
        el.nativeElement.addEventListener('mousemove', mouseMove, true);
        newHeight(this.resizableMinHeight);
        const styleSheet = document.createElement('style')
        styleSheet.type = 'text/css'
        styleSheet.innerText = '.hide-children>*{display:none;}';
        document.head.appendChild(styleSheet);
        this.store.select(selectDashboardHeight).subscribe(
            setHeight
        );
    }

    ngOnInit(): void {
        this.el.nativeElement.style['padding-top'] = this.resizableGrabHeight + 'px';
    }

    inDragRegion(evt: MouseEvent) {
        return evt.clientY
        - this.el.nativeElement.getBoundingClientRect().top
        + document.documentElement.scrollTop
        < this.resizableGrabHeight;
    }

}

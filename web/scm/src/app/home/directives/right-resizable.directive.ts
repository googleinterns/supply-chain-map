import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { setSidePanelWidth } from '../store/actions';
import { selectSidePanelWidth } from '../store/selectors';

@Directive({
    selector: '[scmRightResizable]'
})
export class RightResizableDirective implements OnInit {

    @Input() resizableGrabWidth = 20;
    @Input() resizableMinWidth = 300;
    @Input() resizableMaxWidth = 500;
    @Input() collapsibleMinWidth = this.resizableMinWidth / 2;

    dragging = false;

    constructor(private el: ElementRef, private store: Store) {

        function preventGlobalMouseEvents() {
            document.body.style['pointer-events'] = 'none';
        }

        function restoreGlobalMouseEvents() {
            document.body.style['pointer-events'] = 'auto';
        }


        const newWidth = (incomingWidth: number) => {
            const width = incomingWidth <= this.collapsibleMinWidth ? 0 : Math.min(this.resizableMinWidth, incomingWidth);
            this.store.dispatch(setSidePanelWidth({ sidePanelWidth: width }));
        };

        const setWidth = (width: number) => {
            if (width === 0) {
                el.nativeElement.classList.add('hide-children');
            } else {
                el.nativeElement.classList.remove('hide-children');
            }
            el.nativeElement.style.width = width === Infinity ? '100%' : (width) + 'px';
            window.dispatchEvent(new Event('resize'));
        };


        const mouseMoveG = (evt: MouseEvent) => {
            if (!this.dragging) {
                return;
            }
            newWidth(evt.clientX - el.nativeElement.offsetLeft);
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
                el.nativeElement.style.cursor = 'col-resize';
            } else {
                el.nativeElement.style.cursor = 'default';
            }
        };


        document.addEventListener('mousemove', mouseMoveG, true);
        document.addEventListener('mouseup', mouseUpG, true);
        el.nativeElement.addEventListener('mousedown', mouseDown, true);
        el.nativeElement.addEventListener('mousemove', mouseMove, true);
        newWidth(this.resizableMinWidth);
        const styleSheet = document.createElement('style')
        styleSheet.type = 'text/css'
        styleSheet.innerText = '.hide-children>*{display:none;}';
        document.head.appendChild(styleSheet);
        this.store.select(selectSidePanelWidth).subscribe(
            setWidth
        );
    }

    ngOnInit(): void {
        this.el.nativeElement.style['padding-right'] = this.resizableGrabWidth + 'px';
    }

    inDragRegion(evt: MouseEvent) {
        return this.el.nativeElement.clientWidth - evt.clientX + this.el.nativeElement.offsetLeft < this.resizableGrabWidth;
    }

}

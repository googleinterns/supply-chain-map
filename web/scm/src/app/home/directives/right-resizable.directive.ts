import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
    selector: '[scmRightResizable]'
})
export class RightResizableDirective implements OnInit {

    @Input() resizableGrabWidth = 20;
    @Input() resizableMinWidth = 300;
    @Input() resizableMaxWidth = 500;
    @Input() collapsibleMinWidth = this.resizableMinWidth / 2;

    dragging = false;

    constructor(private el: ElementRef) {

        function preventGlobalMouseEvents() {
            document.body.style['pointer-events'] = 'none';
        }

        function restoreGlobalMouseEvents() {
            document.body.style['pointer-events'] = 'auto';
        }


        const newWidth = (incomingWidth: number) => {
            el.nativeElement.classList.remove('hide-children');
            if (incomingWidth <= this.collapsibleMinWidth) {
                el.nativeElement.classList.add('hide-children');
                el.nativeElement.style.width = '0px';
            } else if (incomingWidth <= this.resizableMinWidth) {
                el.nativeElement.style.width = (this.resizableMinWidth) + 'px';
            } else {
                el.nativeElement.style.width = (Math.min(this.resizableMaxWidth, incomingWidth)) + 'px';
            }
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
    }

    ngOnInit(): void {
        this.el.nativeElement.style['padding-right'] = this.resizableGrabWidth + 'px';
    }

    inDragRegion(evt: MouseEvent) {
        return this.el.nativeElement.clientWidth - evt.clientX + this.el.nativeElement.offsetLeft < this.resizableGrabWidth;
    }

}

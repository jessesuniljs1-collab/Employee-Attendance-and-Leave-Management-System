import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges
} from '@angular/core';

/**
 * HighlightAbsentDirective — custom attribute directive that applies
 * conditional CSS highlight classes to attendance rows based on status.
 *
 * Usage in templates:
 *   <div class="att-row" [appHighlightAbsent]="emp.status">
 *
 * Applied classes:
 *   - 'row-present'  → green left border for Present
 *   - 'row-absent'   → red left border for Absent (key UX indicator)
 *   - 'row-half-day' → amber left border for Half-Day
 */
@Directive({
    selector: '[appHighlightAbsent]',
    standalone: true
})
export class HighlightAbsentDirective implements OnChanges {

    /** The attendance status value — triggers re-evaluation on change */
    @Input() appHighlightAbsent: string = '';

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnChanges(changes: SimpleChanges): void {
        // Remove all previous state classes
        this.renderer.removeClass(this.el.nativeElement, 'row-present');
        this.renderer.removeClass(this.el.nativeElement, 'row-absent');
        this.renderer.removeClass(this.el.nativeElement, 'row-half-day');

        // Apply the appropriate highlight class based on the current status
        switch (this.appHighlightAbsent) {
            case 'Present':
                this.renderer.addClass(this.el.nativeElement, 'row-present');
                break;
            case 'Absent':
                this.renderer.addClass(this.el.nativeElement, 'row-absent');
                break;
            case 'Half-Day':
                this.renderer.addClass(this.el.nativeElement, 'row-half-day');
                break;
        }
    }
}

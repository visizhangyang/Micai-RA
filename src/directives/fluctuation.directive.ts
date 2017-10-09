import { Directive, ElementRef, Input, HostListener } from '@angular/core'

@Directive({ selector: '[fluctuation]' })
export class FluctuationDirective {

    @Input('fluctuation') value: number

    ngOnInit() {
        this.toggleClass()
    }

    ngOnChanges() {
        this.toggleClass()
    }

    toggleClass() {
        let klass
        if (this.value > 0) {
            klass = 'fluctuation-up'
        } if (this.value < 0) {
            klass = 'fluctuation-down'
        }
        if (klass) {
            this.el.nativeElement.classList.add(klass)
        }
    }

    constructor(private el: ElementRef) {

    }
}
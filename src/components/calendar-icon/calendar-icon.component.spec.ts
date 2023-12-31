import { ComponentFixture, TestBed } from "@angular/core/testing"

import { CalendarIconComponent } from "./calendar-icon.component"

describe("CalendarIconComponent", () => {
	let component: CalendarIconComponent
	let fixture: ComponentFixture<CalendarIconComponent>

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [CalendarIconComponent]
		})
		fixture = TestBed.createComponent(CalendarIconComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () => {
		expect(component).toBeTruthy()
	})
})

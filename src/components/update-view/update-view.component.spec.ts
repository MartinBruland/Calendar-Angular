import { ComponentFixture, TestBed } from "@angular/core/testing"

import { UpdateViewComponent } from "./update-view.component"

describe("UpdateViewComponent", () => {
	let component: UpdateViewComponent
	let fixture: ComponentFixture<UpdateViewComponent>

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [UpdateViewComponent]
		})
		fixture = TestBed.createComponent(UpdateViewComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () => {
		expect(component).toBeTruthy()
	})
})

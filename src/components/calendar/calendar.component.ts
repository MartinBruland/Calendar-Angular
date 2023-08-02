import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core"
import { EventValidated } from "../../app/supabase.service"

@Component({
	selector: "app-calendar",
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements OnInit {
	@Input() inputEvents: EventValidated[] | undefined

	@Output() outputDate: EventEmitter<Date> = new EventEmitter<Date>()

	today = new Date()

	currentMonth = this.today.getMonth()

	currentYear = this.today.getFullYear()

	monthLabels = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	]

	weekdayLabels = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday"
	]

	previousMonthLabel = ""

	currentMonthLabel = ""

	nextMonthLabel = ""

	calendarLabel = ""

	visibleDates: number[] = []

	selectedDate: Date | undefined = undefined

	ngOnInit() {
		this.updateUI()
	}

	updateUI() {
		this.currentMonthLabel = this.monthLabels[this.currentMonth]
		this.previousMonthLabel = this.monthLabels[(this.currentMonth - 1 + 12) % 12]
		this.nextMonthLabel = this.monthLabels[(this.currentMonth + 1) % 12]
		this.calendarLabel = this.currentMonthLabel + " " + this.currentYear
		this.visibleDates = this.getVisibleDates()
	}

	onPreviousMonthHandler() {
		this.currentMonth = this.getPreviousMonth().previousMonth
		this.currentYear = this.getPreviousMonth().previousYear
		this.updateUI()
	}

	onNextMonthHandler() {
		this.currentMonth = this.getNextMonth().nextMonth
		this.currentYear = this.getNextMonth().nextYear
		this.updateUI()
	}

	onSelectDateHandler(val: number) {
		const date = new Date(this.currentYear, this.currentMonth, val)

		const isEqual =
			this.selectedDate?.getDate() === date.getDate() &&
			this.selectedDate?.getMonth() === date.getMonth() &&
			this.selectedDate?.getFullYear() === date.getFullYear()

		this.selectedDate = isEqual ? undefined : date

		this.outputDate.emit(this.selectedDate)
	}

	getPreviousMonth() {
		const previousMonth = (this.currentMonth - 1 + 12) % 12
		const previousYear =
			this.currentMonth === 11 ? this.currentYear - 1 : this.currentYear
		return { previousMonth, previousYear }
	}

	getNextMonth() {
		const nextMonth = (this.currentMonth + 1) % 12
		const nextYear =
			this.currentMonth === 0 ? this.currentYear + 1 : this.currentYear
		return { nextMonth, nextYear }
	}

	getVisibleDates() {
		const firstWeekDaySunday = new Date(this.currentYear, this.currentMonth, 1)
		const firstWeekDayMonday =
			firstWeekDaySunday.getDay() == 0 ? 7 : firstWeekDaySunday.getDay()
		const numberOfDays = new Date(
			this.currentYear,
			this.currentMonth + 1,
			0
		).getDate()
		const firstDayList = [...Array(firstWeekDayMonday - 1).keys()].map(val => 0)
		const listOfDays = [...Array(numberOfDays + 1).keys()].filter(
			val => val !== 0
		)
		return [...firstDayList, ...listOfDays]
	}

	dateHasContent(date: number) {
		if (!this.inputEvents) return false

		const found = this.inputEvents.find(
			obj =>
				obj.date_start &&
				obj.date_start.getDate() === date &&
				obj.date_start.getMonth() === this.currentMonth &&
				obj.date_start.getFullYear() === this.currentYear
		)

		if (found) return true

		return false
	}

	isDateCurrent(date: number) {
		return (
			date === this.today.getDate() &&
			this.currentMonth == this.today.getMonth() &&
			this.currentYear === this.today.getFullYear()
		)
	}

	isDateSelected(date: number) {
		if (!this.selectedDate) return false
		return (
			date === this.selectedDate.getDate() &&
			this.currentMonth === this.selectedDate.getMonth() &&
			this.currentYear === this.selectedDate.getFullYear()
		)
	}

	isDateHidden(date: number) {
		return date === 0
	}
}

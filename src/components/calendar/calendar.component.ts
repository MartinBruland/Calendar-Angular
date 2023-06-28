import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  today = new Date();
  
  currentMonth = this.today.getMonth();
  
  currentYear = this.today.getFullYear();

  monthLabels = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
  
  weekdayLabels = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
  
  previousMonthLabel = "";
  
  currentMonthLabel = "";
  
  nextMonthLabel = "";

  visibleDates: number[] = [];

  selectedDate: Date | undefined = undefined;


  ngOnInit(): void {
    this.updateUI()
  };

  updateUI = () => {
    this.currentMonthLabel = this.monthLabels[this.currentMonth];
    this.previousMonthLabel = this.monthLabels[(this.currentMonth - 1 + 12) % 12];
    this.nextMonthLabel = this.monthLabels[(this.currentMonth + 1) % 12];
    this.visibleDates = this.getVisibleDates();
  };

  previousHandler = () => {
    this.currentMonth = this.getPreviousMonth().previousMonth;
    this.currentYear = this.getPreviousMonth().previousYear;
    this.updateUI();
  };

  nextHandler = () => {
    this.currentMonth = this.getNextMonth().nextMonth;
    this.currentYear = this.getNextMonth().nextYear;
    this.updateUI();
  };

  selectHandler = (val: number) => {
    this.selectedDate = new Date(this.currentYear, this.currentMonth, val);
  };

  getPreviousMonth = () => {
    const previousMonth = (this.currentMonth - 1 + 12) % 12;
    const previousYear = this.currentMonth === 11 ? this.currentYear - 1 : this.currentYear;
    return { previousMonth, previousYear }
  };

  getNextMonth = () => {
    const nextMonth = (this.currentMonth + 1) % 12;
    const nextYear = this.currentMonth === 0 ? this.currentYear + 1 : this.currentYear;
    return { nextMonth, nextYear }
  };

  getVisibleDates = () => {
    const firstWeekDaySunday = new Date(this.currentYear, this.currentMonth, 1);
    const firstWeekDayMonday = firstWeekDaySunday.getDay() == 0 ? 7 : firstWeekDaySunday.getDay();
    const numberOfDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayList = [...Array(firstWeekDayMonday - 1).keys()].map(val => 0);
    const listOfDays = [...Array(numberOfDays + 1).keys()].filter(val => val !== 0);
    return [...firstDayList, ...listOfDays]
  };

}
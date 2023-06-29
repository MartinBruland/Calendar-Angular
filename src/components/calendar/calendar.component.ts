import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CalendarEvent } from 'src/types/types';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnChanges, OnInit {
  
  @Input() inputEvents: CalendarEvent[] | undefined;
  @Output() outputDate: EventEmitter<Date> = new EventEmitter<Date>();

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


  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === "inputEvents") {
        const chng = changes[propName];
        const updatedEvents: CalendarEvent[] = chng.currentValue;
        //this.availableTags = updatedEvents.map(item => item.tag);
      }
    }
  };

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

  outputEmitHandler = (date: Date | undefined) => {
    this.outputDate.emit(date);
  };

  selectHandler = (val: number) => {
    const date = new Date(this.currentYear, this.currentMonth, val);

    const isEqual = 
    (this.selectedDate?.getDate() === date.getDate()) && 
    (this.selectedDate?.getMonth() === date.getMonth()) && 
    (this.selectedDate?.getFullYear() === date.getFullYear());

    this.selectedDate = isEqual ? undefined : date;
    this.outputEmitHandler(this.selectedDate)   
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

  hasContent = (date: number): boolean => {
    const found = this.inputEvents?.find(obj => 
      obj.startDate?.getDate() === date && 
      obj.startDate.getMonth() === this.currentMonth && 
      obj.startDate.getFullYear() === this.currentYear
    );
    if (found) return true;
    return false;
  };

}
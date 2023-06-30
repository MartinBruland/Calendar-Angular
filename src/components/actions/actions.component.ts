import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CalendarEvent } from 'src/types/types';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnChanges {

  @Input() inputEvents: CalendarEvent[] | undefined;

  @Output() outputTag: EventEmitter<string> = new EventEmitter<string>();

  labelTitle = "Filters";

  defaultTags = ["All", "Completed"];

  availableTags = this.defaultTags;

  selectedTag = this.defaultTags[0];


  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === "inputEvents") {
        const chng = changes[propName];
        const updatedEvents: CalendarEvent[] = chng.currentValue;       
        const tags = [...this.defaultTags, ...updatedEvents.map(event => event.tag)]
        this.availableTags = [...new Set(tags)];
      };
    }
  };

  outputEmitHandler(val: string) {
    this.outputTag.emit(val);
  };

  onSelectHandler = (val: string) => {
    this.selectedTag = val;
    this.outputEmitHandler(val);
  };

}
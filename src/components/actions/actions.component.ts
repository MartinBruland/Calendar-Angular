import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { EventValidated } from 'src/types/types'

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnChanges {

  labelTitle = "Filters";



  @Input() inputEvents: EventValidated[] | undefined;

  @Output() outputTag: EventEmitter<string> = new EventEmitter<string>();

  
  defaultTags = ["All", "Completed"];

  availableTags = this.defaultTags;

  selectedTag = this.defaultTags[0];


  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === "inputEvents") {
        const chng = changes[propName];
        const updatedEvents: EventValidated[] = chng.currentValue;       
        const tags = [...this.defaultTags, ...updatedEvents.map(event => event.tag)]
        .filter(tag => tag !== undefined) // Filter out null values
        .map(tag => tag as string); // Type assertion to convert remaining values to strings      
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
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-d-card',
  templateUrl: './d-card.component.html',
  styleUrls: ['./d-card.component.scss']
})
export class DCardComponent implements OnInit {
  @Input() subject: string;
  @Input() class: string;
  @Input() dueDate: String;
  @Input() viewClassLink: any;
  @Input() instructor:string;
  @Input() process :string;
  constructor() {
  }

  ngOnInit(): void {
    this.process==null ?"Processing":this.process;
  }

}

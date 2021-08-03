import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'fc-validation-error',
  templateUrl: './validation-error.component.html',
  styleUrls: ['./validation-error.component.scss'],
})
export class ValidationErrorComponent implements OnInit {
  @Input() control: FormControl;
  @Input() min: number = -1;
  @Input() max: number = -1;

  errorMessages: { [key: string]: string };
  constructor() {}

  ngOnInit(): void {
    this.errorMessages = {
      required: 'The field is required',
      minlength: 'Min length is 4',
      min: `Min value is ${this.min}`,
      max: `Max value is ${this.max}`,
      email: 'Enter a valid email',
    };
  }
}

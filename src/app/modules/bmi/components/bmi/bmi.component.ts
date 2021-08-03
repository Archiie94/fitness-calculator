import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, debounceTime, tap, delay, takeUntil } from 'rxjs/operators';
import { markAsDirtyAndTouched } from 'src/app/core/components/app.functions';
import {
  LBS_TO_KILO_RATIO,
  INCH_TO_CM_RATIO,
  METRIC,
} from 'src/app/core/constants/app.constants';
import { IBMRForm } from 'src/app/modules/bmr/components/bmr/bmr.component';

@Component({
  selector: 'app-bmi',
  templateUrl: './bmi.component.html',
  styleUrls: ['./bmi.component.scss'],
})
export class BmiComponent implements OnDestroy {
  bmiFG: FormGroup;
  result = 0;
  isSuccess = false;
  isCalculating = false;

  agePostFix = 'years';
  weightPostFix = 'kg';
  heightPostfix = 'cm';

  private notifier$ = new Subject();

  @ViewChild('resultBox') resultBoxER: ElementRef;
  @ViewChild('formBox') formBoxER: ElementRef;

  constructor(private fb: FormBuilder) {
    this.bmiFG = this.fb.group({
      unit: ['metric', Validators.required],
      height: [
        '',
        [Validators.required, Validators.min(1), Validators.max(270)],
      ],
      weight: [
        '',
        [Validators.required, Validators.min(1), Validators.max(800)],
      ],
    });

    this.bmiFG.valueChanges
      .pipe(
        takeUntil(this.notifier$),
        filter(() => this.bmiFG.valid),
        debounceTime(800),
        tap(() => {
          this.isCalculating = true;
        }),
        delay(800)
      )
      .subscribe((form: IBMRForm) => {
        this.isSuccess = true;
        this.result = this._calcBMI(form);
        this.isCalculating = false;
      });

    this.bmiFG
      .get('unit')
      .valueChanges.pipe(takeUntil(this.notifier$))
      .subscribe((val: string) => {
        this._updateUnits(val);
      });
  }

  reCalc() {
    this.formBoxER.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  calculate() {
    markAsDirtyAndTouched(this.bmiFG);

    this.bmiFG.valid &&
      this.resultBoxER.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  }

  _updateUnits(val: string) {
    const isMetric = val === METRIC;
    this.weightPostFix = isMetric ? 'kg' : 'lbs';
    this.heightPostfix = isMetric ? 'cm' : 'inch';
  }

  _calcBMI(form: IBMRForm): number {
    // FORMULA: BMI = mass (kg) / height^2 (m)
    const isMetric = form.unit === METRIC;
    const weight = isMetric ? +form.weight : +form.weight * LBS_TO_KILO_RATIO;
    const height =
      (isMetric ? +form.height : +form.height * INCH_TO_CM_RATIO) / 100;

    return weight / (height * height);
  }

  ngOnDestroy(): void {
    this.notifier$.next();
    this.notifier$.complete();
  }
}

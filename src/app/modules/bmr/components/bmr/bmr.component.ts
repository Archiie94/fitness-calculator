import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, delay, filter, takeUntil, tap } from 'rxjs/operators';
import { markAsDirtyAndTouched } from 'src/app/core/components/app.functions';
import {
  LBS_TO_KILO_RATIO,
  INCH_TO_CM_RATIO,
  METRIC,
  MALE,
} from 'src/app/core/constants/app.constants';
import {
  MALE_GENDER_INCREMENETER,
  FEMALE_GENDER_INCREMENETER,
  FEMALE_WEIGHT_MULTIPLIER,
  MALE_WEIGHT_MULTIPLIER,
  FEMALE_AGE_MULTIPLIER,
  FEMALE_LENGTH_MULTIPLIER,
  MALE_AGE_MULTIPLIER,
  MALE_LENGTH_MULTIPLIER,
} from '../../constants/bmr.constants';

export interface IBMRForm {
  unit: string;
  activity: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
}

@Component({
  selector: 'app-bmr',
  templateUrl: './bmr.component.html',
  styleUrls: ['./bmr.component.scss'],
})
export class BmrComponent {
  bmrFG: FormGroup;
  result = 0;
  isSuccess = false;
  isCalculating = false;

  agePostFix = 'years';
  weightPostFix = 'kg';
  heightPostfix = 'cm';

  @ViewChild('resultBox') resultBoxER: ElementRef;
  @ViewChild('formBox') formBoxER: ElementRef;

  private notifier$ = new Subject();

  constructor(private fb: FormBuilder) {
    this.bmrFG = this.fb.group({
      unit: [METRIC, Validators.required],
      activity: ['1.2', Validators.required],
      gender: [MALE, Validators.required],
      age: ['', [Validators.required, Validators.min(1), Validators.max(130)]],
      height: [
        '',
        [Validators.required, Validators.min(1), Validators.max(270)],
      ],
      weight: [
        '',
        [Validators.required, Validators.min(1), Validators.max(800)],
      ],
    });

    this.bmrFG.valueChanges
      .pipe(
        takeUntil(this.notifier$),
        filter(() => this.bmrFG.valid),
        debounceTime(800),
        tap(() => {
          this.isCalculating = true;
        }),
        delay(800)
      )
      .subscribe((form: IBMRForm) => {
        this.isSuccess = true;
        this.result = this._calcBMR(form);
        this.isCalculating = false;
      });

    this.bmrFG
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
    markAsDirtyAndTouched(this.bmrFG);

    this.bmrFG.valid &&
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

  _calcBMR(form: IBMRForm): number {
    // BMR for Men = 66.47 + (13.75 * weight [kg]) + (5.003 * size [cm]) − (6.755 * age [years])
    // BMR for Women = 655.1 + (9.563 * weight [kg]) + (1.85 * size [cm]) − (4.676 * age [years])
    const isMetric = form.unit === METRIC;
    const isMale = form.gender === MALE;
    const genderIncrementer = isMale
      ? MALE_GENDER_INCREMENETER
      : FEMALE_GENDER_INCREMENETER;
    const genderWeightMultiplier = isMale
      ? MALE_WEIGHT_MULTIPLIER
      : FEMALE_WEIGHT_MULTIPLIER;
    const genderLengthMultiplier = isMale
      ? MALE_LENGTH_MULTIPLIER
      : FEMALE_LENGTH_MULTIPLIER;
    const genderAgeMultiplier = isMale
      ? MALE_AGE_MULTIPLIER
      : FEMALE_AGE_MULTIPLIER;

    const weight = isMetric ? +form.weight : +form.weight * LBS_TO_KILO_RATIO;
    const height = isMetric ? +form.height : +form.height * INCH_TO_CM_RATIO;

    return (
      (genderIncrementer +
        genderWeightMultiplier * weight +
        genderLengthMultiplier * height +
        genderAgeMultiplier * +form.age) *
      +form.activity
    );
  }

  ngOnDestroy(): void {
    this.notifier$.next();
    this.notifier$.complete();
  }
}

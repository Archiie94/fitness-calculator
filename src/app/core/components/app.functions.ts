import { FormGroup } from '@angular/forms';

export function markAsDirtyAndTouched(formGroup: FormGroup) {
  (<any>Object).values(formGroup.controls).forEach((control) => {
    control.markAsTouched();
    control.markAsDirty();

    if (control.controls) {
      this.markFormGroupTouched(control);
    }
  });
}

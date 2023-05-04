import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { userDetailsType } from 'src/app/services/mock-service';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent {
  private _data!: userDetailsType;
  public get data(): userDetailsType {
    return this._data;
  }
  @Input()
  public set data(value: userDetailsType) {
    // när data uppdateras i store sätts detta i formControls för att undvika onödig kontroll och uppdatering av data vid flera tillfällen
    // detta ger en naturlig "rundgång" enl. pattern store -> control -> reducer -> store -> control..
    this.nameFC.setValue(value.name);
    this.ageFC.setValue(value.age);
    this.numberFC.setValue(value.favoriteNumber);
    this._data = value;
  }

  @Output() save = new EventEmitter<{
    data: userDetailsType;
    updateName: boolean;
  }>();

  nameFC = this.formBuilder.control('');
  ageFC = this.formBuilder.control('');
  numberFC = this.formBuilder.control('');

  formGrp = this.formBuilder.group({
    nameFC: this.nameFC,
    ageFC: this.ageFC,
    numberFC: this.numberFC,
  });

  constructor(private formBuilder: FormBuilder) {}

  submit() {
    this.save.emit({
      data: {
        id: this._data.id,
        name: this.nameFC.value,
        age: this.ageFC.value,
        favoriteNumber: this.numberFC.value,
      },
      updateName: this._data.name !== this.nameFC.value,
    });
  }
}

import { Component, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {

  constructor(public dialogRef: MdDialogRef<ConfirmationDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
      this.dialogRef.close();
    }

}

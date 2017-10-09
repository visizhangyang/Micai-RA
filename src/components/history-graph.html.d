<div class="datePicker">
    <ul>
        <li *ngFor="let picker of datePickerList" [ngClass]="{active: picker.active}" (click)="pick(picker)">
            {{ picker.text }}
        </li>
    </ul>
</div>
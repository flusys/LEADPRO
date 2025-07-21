import { FormControl } from '@angular/forms';

export interface IProfileInfoForm {
    nidPhoto: FormControl<File | number | null>;
    fatherName: FormControl<string>;
    motherName: FormControl<string>;
    maritalStatus: FormControl<'Single' | 'Married' | 'Divorced' | string>;
    presentAddress: FormControl<string>;
    permanentAddress: FormControl<string>;
    profession: FormControl<string>;
    nomineeName: FormControl<string>;
    relationWithNominee: FormControl<string>;
    nomineeNidPhoto: FormControl<File | number | null>;
    comments: FormControl<string | null>;
}
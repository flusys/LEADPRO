import { FormControl } from '@angular/forms';

export interface IProfileInfoForm {
    name: FormControl<string>;
    fatherName: FormControl<string>;
    motherName: FormControl<string>;
    maritalStatus: FormControl<'Single' | 'Married' | 'Divorced' | string>;
    presentAddress: FormControl<string>;
    permanentAddress: FormControl<string>;
    profession: FormControl<string>;
    nomineeName: FormControl<string>;
    relationWithNominee: FormControl<string>;
    nidPhoto: FormControl<File | number | null>;
    nomineeNidPhoto: FormControl<File | number | null>;
    nidPhotoUrl: FormControl<string>;
    nomineeNidPhotoUrl: FormControl<string>;
    comments: FormControl<string | null>;
}
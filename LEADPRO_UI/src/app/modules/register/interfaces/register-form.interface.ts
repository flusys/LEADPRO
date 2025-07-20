import { FormControl } from '@angular/forms';

export interface IRegistrationForm {
    fullName: FormControl<string>;
    personalPhoto: FormControl<File | number | null>;
    nidPhoto: FormControl<File | number | null>;
    fatherName: FormControl<string>;
    motherName: FormControl<string>;
    maritalStatus: FormControl<'Single' | 'Married' | 'Divorced' | string>;
    email: FormControl<string>;
    presentAddress: FormControl<string>;
    permanentAddress: FormControl<string>;
    phoneNumber: FormControl<string>;
    profession: FormControl<string>;
    nomineeName: FormControl<string>;
    relationWithNominee: FormControl<string>;
    nomineeNidPhoto: FormControl<File | number | null>;
    comments: FormControl<string | null>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;

}

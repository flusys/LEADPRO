import { FormControl } from '@angular/forms';

export interface IRegistrationForm {
    fullName: FormControl<string>;
    personalPhoto: FormControl<File | null>;
    nidPhoto: FormControl<File | null>;
    fatherName: FormControl<string>;
    motherName: FormControl<string>;
    maritalStatus: FormControl<'Single' | 'Married' | 'Divorced' | string>;
    email: FormControl<string>;
    presentAddress: FormControl<string>;
    permanentAddress: FormControl<string>;
    phoneNumber: FormControl<string>;
    profession: FormControl<string>;
    referenceUserId: FormControl<string>;
    nomineeName: FormControl<string>;
    relationWithNominee: FormControl<string>;
    nomineeNidPhoto: FormControl<File | null>;
    comments: FormControl<string | null>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;

}

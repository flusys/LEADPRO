export interface RegistrationFormData {
    fullName: string;
    personalPhoto: File;
    nidPhoto: File;
    fatherName: string;
    motherName: string;
    maritalStatus: 'Single' | 'Married' | 'Divorced' | string;
    email: string;
    presentAddress: string;
    permanentAddress: string;
    phoneNumber: string;
    profession: string;
    referenceUserId: string;
    idNo: string;
    nomineeName: string;
    relationWithNominee: string;
    nomineeNidPhoto: File;
    comments?: string;
}

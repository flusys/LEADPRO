export interface IProfileInfo {
    nidPhoto: File;
    fatherName: string;
    motherName: string;
    maritalStatus: 'Single' | 'Married' | 'Divorced' | string;
    presentAddress: string;
    permanentAddress: string;
    profession: string;
    idNo: string;
    nomineeName: string;
    relationWithNominee: string;
    nomineeNidPhoto: File;
    comments?: string;
}

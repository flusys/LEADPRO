import { IGallery } from "@flusys/flusysnest/modules/gallery/interfaces";

export interface IProfileInfo {
    name: string;
    nidPhoto: IGallery;
    fatherName: string;
    motherName: string;
    maritalStatus: 'Single' | 'Married' | 'Divorced' | string;
    presentAddress: string;
    permanentAddress: string;
    profession: string;
    idNo: string;
    nomineeName: string;
    relationWithNominee: string;
    nomineeNidPhoto: IGallery;
    comments?: string;
}

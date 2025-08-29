import { IGallery } from "@flusys/flusysng/modules/gallery/gallery/interfaces";
import { IUser } from "@flusys/flusysng/modules/settings/user/interfaces";


export interface ProfileInfoData {
    nidPhoto: IGallery;
    name: string;
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
    referUser?: IUser;
}

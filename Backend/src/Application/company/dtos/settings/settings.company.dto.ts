import CompanyEntity from "../../../../Domain/entities/Company.entity"
import { FileUpload } from '../../../../Shared/types/fileUpload.type'

export interface UpdateCompanyProfileInputDTO {
  id: string
  name?: string
  profileLogo?: string
  legalName?: string
  domain?: string
  website?: string
  teamSize: number
  about?: string
  phoneNumber?: string
  streetName?: string
  country?: string
  state?: string
  city?: string
  pinCode?: string
  primaryContactName?: string
  primaryContactEmail?: string
  billingEmail?: string
  certificateType: 'GST' | 'COI'
  certificateNumber?: string
  certificateFile?: FileUpload

}

export interface UpdateCompanyProfileOutputDTO {
    company: CompanyEntity
}

export interface getCompanyProfileInputDTO {
    id: string
}

export interface getCompanyProfileOutputDTO {
  id: string
  name?: string
  profileLogo?: string
  legalName?: string
  domain?: string
  website?: string
  teamSize?: number
  about?: string
  phoneNumber?: string
  streetName?: string
  country?: string
  state?: string
  city?: string
  pinCode?: string
  primaryContactName?: string
  primaryContactEmail?: string
  billingEmail?: string
  certificateType?: 'GST' | 'COI'
  certificateNumber?: string
  certificateFile?: string
}

export interface UploadProfileImageInputDTO {
    id: string,
    file: FileUpload
}
export interface UploadProfileImageOutputDTO {
    company: CompanyEntity
}
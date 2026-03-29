export class JobRolesEntity {
    id: string;
    name: string;
    skills: string[];
    experienceMin: number;
    experienceMax: number
    openings: number
    isActive: boolean
    isDeleted: boolean
   

    constructor(id: string, name:string, skills: string[], experienceMin: number, experienceMax: number, openings: number, isActive: boolean, isDeleted: boolean){
        this.id = id
        this.name = name
        this.skills = skills
        this.experienceMin = experienceMin
        this.experienceMax = experienceMax
        this.openings = openings
        this.isActive = isActive
        this.isDeleted = isDeleted
    }
}
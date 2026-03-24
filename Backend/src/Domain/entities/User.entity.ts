import userRole from "../enums/userRole.enum";

export default class UserEntity {
    id: string;
    protected name: string;
    protected email: string;
    protected password: string
    protected role?: userRole
    protected isVerified: boolean;
    protected googleId?: string;
    protected isBlocked: boolean;
    protected refreshTokens?: string[]
    protected lastActive: Date;


    protected constructor(id: string, name: string, email: string, password: string, isVerified: boolean,isBlocked: boolean, role?: userRole, googleId?: string, refreshToken: string[] = []){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.isVerified = isVerified;
        this.isBlocked = isBlocked
        this.googleId = googleId;
        this.refreshTokens = refreshToken
        this.lastActive = new Date()
    }

    public getId(): string {
        return this.id;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }

    public getRole(): userRole {
        return this.role!
    }

    public getName(): string {
        return this.name;
    }

    public isUserVerified(): boolean {
        return this.isVerified;
    }

    public markAsVerified(): void {
        this.isVerified = true;
    }
    public getGoogleId(): string | undefined{
        return this.googleId;
    }
    public getRefreshToken(): string[] | undefined {
        return this.refreshTokens? [...this.refreshTokens]: undefined
    }

    public hasRefreshToken(token: string): boolean {
        return this.refreshTokens? this.refreshTokens.includes(token) : false
    }

    public getIsBlocked():boolean {
        return this.isBlocked
    }
    public setBlocked(blocked: boolean):void {
        this.isBlocked = blocked
    }
    public getLastActive(): Date {
        return this.lastActive
    }

    public setLastActive(date: Date): void {
        this.lastActive = date
    }
}
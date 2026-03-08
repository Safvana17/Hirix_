export interface Candidate{
    id: string;
    name: string;
    email: string;
    status: 'Active' | 'Blocked';
}
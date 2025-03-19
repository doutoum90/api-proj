export class CreateUserDto {
    email: string;
    name: string;
    password: string;
    typeAbonnement: 'Essentiel' | 'PRO' | 'Expert';
    trialActive: boolean;
    trialStartDate: Date;   
}

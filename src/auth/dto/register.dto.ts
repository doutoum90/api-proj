export class RegisterDto {
    email: string;
    password: string;

    name: string;
    lastname: string;
    dateOfBirth: string;
    profession: string;
    typeAbonnement: 'Essentiel' | 'PRO' | 'Expert';
    trialActive: boolean;
  }
  
export interface KeyCloakTokenModel {
    access_token?: string;
    expires_in?: number;
    token_type?: string;
    isTokenValid: boolean;
}
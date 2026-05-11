package com.stock.gestion_stock.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilisateurDTO {

    private Long id;
    private String nom;
    private String prenom;
    private String username;
    private String role;
    private boolean actif;
}

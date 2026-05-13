package com.stock.gestion_stock.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FournisseurDTO {

    private Long id;
    private String nom;
    private String email;
    private String telephone;
    private String adresse;
    private Integer nombreProduits;
}

package com.stock.gestion_stock.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProduitDTO {

    private Long id;
    private String nom;
    private String description;
    private Double prix;
    private Integer quantite;
    private Integer seuilAlerte;
    private Long fournisseurId;
    private String fournisseurNom;
    private Boolean stockFaible;
}

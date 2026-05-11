package com.stock.gestion_stock.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MouvementStockDTO {

    private Long id;

    @NotNull(message = "Le type de mouvement est obligatoire")
    private String typeMouvement; // "ENTREE" ou "SORTIE"

    @NotNull(message = "La quantité est obligatoire")
    @Min(value = 1, message = "La quantité doit être au moins 1")
    private Integer quantite;

    private LocalDateTime dateMouvement;
    private String remarque;

    @NotNull(message = "L'ID du produit est obligatoire")
    private Long produitId;

    private String produitNom;
    private String utilisateurNom;
}

package com.stock.gestion_stock.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatsDTO {

    private long totalProduits;
    private long totalFournisseurs;
    private long produitsStockFaible;
    private long totalMouvements;
    private double valeurTotaleStock;
    private List<ProduitDTO> produitsEnAlerte;
    private List<MouvementStockDTO> mouvementsRecents;
}
